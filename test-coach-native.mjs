async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ai-provider': 'google',
        'x-ai-api-key': 'dummy'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }],
        boardContext: {
          quadrants: { do: [], schedule: [], delegate: [], eliminate: [] },
          taskCount: 0,
          oldestDoTaskAge: null,
          userLocalTime: new Date().toISOString()
        }
      })
    });
    console.log(res.status);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error(e);
  }
}

test();
