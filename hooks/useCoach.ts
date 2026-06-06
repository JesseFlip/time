import { useState, useCallback, useEffect } from 'react';
import { type CoachMessage, type BoardContext } from '@/types/coach';
import { useTaskStore } from '@/lib/store/useTaskStore';
import { createClient } from '@/lib/supabase/client';

export function useCoach() {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const tasks = useTaskStore((state) => state.filteredTasks || state.tasks);


  const triggerSystemPrompt = useCallback(async (promptText: string) => {
    // Hidden message to trigger the coach
    sendMessage(promptText, true);
  }, []);

  const saveSession = useCallback(async (newMessages: CoachMessage[]) => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    await supabase.from('coach_sessions').upsert({
      user_id: userData.user.id,
      messages: newMessages,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  }, []);

  const getBoardContext = useCallback((): BoardContext => {
    const doTasks = tasks.filter((t) => t.quadrant === 'do');
    
    let oldestAge: number | null = null;
    if (doTasks.length > 0) {
      const oldest = doTasks.reduce((prev, current) => 
        (new Date(prev.created_at) < new Date(current.created_at)) ? prev : current
      );
      oldestAge = Math.floor((new Date().getTime() - new Date(oldest.created_at).getTime()) / 86400000);
    }

    return {
      quadrants: {
        do: doTasks,
        schedule: tasks.filter((t) => t.quadrant === 'schedule'),
        delegate: tasks.filter((t) => t.quadrant === 'delegate'),
        eliminate: tasks.filter((t) => t.quadrant === 'delete'),
      },
      taskCount: tasks.length,
      oldestDoTaskAge: oldestAge,
      userLocalTime: new Date().toISOString()
    };
  }, [tasks]);

  const sendMessage = useCallback(async (content: string, isHidden: boolean = false) => {
    const userMsg: CoachMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const asstMsgId = crypto.randomUUID();
    const asstMsgPlaceholder: CoachMessage = {
      id: asstMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    const updatedMessages = isHidden 
      ? [...messages, asstMsgPlaceholder] 
      : [...messages, userMsg, asstMsgPlaceholder];
      
    setMessages(updatedMessages);
    setIsLoading(true);

    const provider = localStorage.getItem('coach_ai_provider') || 'anthropic';
    const apiKey = localStorage.getItem('coach_ai_api_key');

    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === asstMsgId ? { 
            ...m, 
            content: "Please click the settings icon above to configure your AI provider and API key before we begin!", 
            isStreaming: false 
          } : m
        ));
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      })).slice(-10); // keep last 10 for context window

      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-ai-provider': provider,
          'x-ai-api-key': apiKey
        },
        body: JSON.stringify({
          messages: apiMessages,
          boardContext: getBoardContext()
        })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      if (!res.body) throw new Error('No readable stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.delta) {
                assistantContent += data.delta;
                setMessages(prev => prev.map(m => 
                  m.id === asstMsgId ? { ...m, content: assistantContent } : m
                ));
              }
            } catch (e) {
              console.error('Error parsing SSE data', e);
            }
          }
        }
      }

      const finalMessages = updatedMessages.map(m => 
        m.id === asstMsgId ? { ...m, content: assistantContent, isStreaming: false } : m
      );
      setMessages(finalMessages);
      saveSession(finalMessages);

    } catch (err: any) {
      console.error(err);
      
      let errorMsg = "I'm having trouble connecting right now. Check back in a moment.";
      if (err?.message) {
        errorMsg = `API Error: ${err.message}`;
      }
      
      // Replace placeholder with error
      setMessages(prev => prev.map(m => 
        m.id === asstMsgId ? { 
          ...m, 
          content: errorMsg, 
          isStreaming: false 
        } : m
      ));
    } finally {
      setIsLoading(false);
    }
  }, [messages, getBoardContext, saveSession]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    saveSession([]);
  }, [saveSession]);

  // Load persisted messages from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    const loadSession = async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      
      let loadedMessages: CoachMessage[] = [];
      if (userData?.user) {
        const { data } = await supabase
          .from('coach_sessions')
          .select('messages')
          .eq('user_id', userData.user.id)
          .single();

        if (data && data.messages) {
          loadedMessages = data.messages as CoachMessage[];
          if (isMounted) setMessages(loadedMessages);
        }
      }

      // Check-in logic
      const lastCheckin = localStorage.getItem('coach_last_checkin_date');
      const today = new Date().toDateString();

      if (lastCheckin !== today && loadedMessages.length >= 0) {
        // Trigger check-in
        setTimeout(() => {
          triggerSystemPrompt(
            "It's a new day. Let's do a daily check-in. What's the most important thing to tackle?"
          );
        }, 1000);
        localStorage.setItem('coach_last_checkin_date', today);
      } else {
        // Evaluate other triggers if not check-in
        const board = getBoardContext();
        if (board.quadrants.do.length > 4) {
          const lastOverload = localStorage.getItem('coach_last_overload_date');
          if (lastOverload !== today) {
            setTimeout(() => {
              triggerSystemPrompt("I noticed you have more than 4 tasks in the DO quadrant. Can I help you prioritize or delegate some of these?");
            }, 2000);
            localStorage.setItem('coach_last_overload_date', today);
          }
        } else if (board.oldestDoTaskAge !== null && board.oldestDoTaskAge >= 2) {
          const lastStale = localStorage.getItem('coach_last_stale_date');
          if (lastStale !== today) {
            setTimeout(() => {
              triggerSystemPrompt(`One of your tasks in the DO quadrant has been there for ${board.oldestDoTaskAge} days. What's blocking it?`);
            }, 2000);
            localStorage.setItem('coach_last_stale_date', today);
          }
        }
      }
    };
    loadSession();

    // Listen for suggestion badge clicks
    const handleSuggest = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const taskTitle = customEvent.detail;
      const saved = localStorage.getItem('coach_panel_open');
      if (saved !== 'true') {
        localStorage.setItem('coach_panel_open', 'true');
        window.dispatchEvent(new Event('coach-open-panel'));
      }
      setTimeout(() => {
        // Pre-fill by actually sending or just putting in input?
        // Let's send directly or we need an input ref.
        sendMessage(`Can you help me think through '${taskTitle}'?`);
      }, 500);
    };
    window.addEventListener('coach-suggest', handleSuggest);

    return () => { 
      isMounted = false; 
      window.removeEventListener('coach-suggest', handleSuggest);
    };
  }, [getBoardContext, triggerSystemPrompt, sendMessage]);
  return { messages, setMessages, isLoading, sendMessage, clearHistory, getBoardContext };
}
