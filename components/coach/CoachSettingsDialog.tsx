'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type AIProvider = 'anthropic' | 'openai' | 'google';

interface CoachSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoachSettingsDialog({ open, onOpenChange }: CoachSettingsDialogProps) {
  const [provider, setProvider] = useState<AIProvider>('anthropic');
  const [apiKey, setApiKey] = useState('');

  // Load from local storage when opened
  useEffect(() => {
    if (open) {
      const savedProvider = localStorage.getItem('coach_ai_provider') as AIProvider | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedProvider) setProvider(savedProvider);
      
      const savedKey = localStorage.getItem('coach_ai_api_key');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedKey) setApiKey(savedKey);
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem('coach_ai_provider', provider);
    localStorage.setItem('coach_ai_api_key', apiKey.trim());
    onOpenChange(false);
  };

  const getHelpLink = () => {
    switch (provider) {
      case 'anthropic':
        return 'https://console.anthropic.com/settings/keys';
      case 'openai':
        return 'https://platform.openai.com/api-keys';
      case 'google':
        return 'https://aistudio.google.com/app/apikey';
      default:
        return '#';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Coach API Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Aria needs an API key to provide coaching. Your key is stored securely in your browser and never saved to our servers.
          </p>

          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={(value: AIProvider) => setProvider(value)}>
              <SelectTrigger id="provider">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anthropic">Anthropic (Claude 3.5 Sonnet)</SelectItem>
                <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                <SelectItem value="google">Google (Gemini 2.5 Pro)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder={`Enter your ${provider === 'anthropic' ? 'Anthropic' : provider === 'openai' ? 'OpenAI' : 'Google'} API Key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Don&apos;t have one? Get it from the{' '}
              <a 
                href={getHelpLink()} 
                target="_blank" 
                rel="noreferrer" 
                className="text-primary hover:underline font-medium"
              >
                Developer Console
              </a>.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
