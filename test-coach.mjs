import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ai-provider': 'anthropic',
        'x-ai-api-key': 'sk-ant-test'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }],
        boardContext: {}
      })
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}

test();
