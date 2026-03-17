export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { model, max_tokens, system, messages } = req.body;

  // Convert Anthropic format to OpenAI/Groq format
  const groqMessages = [];
  if (system) {
    groqMessages.push({ role: 'system', content: system });
  }
  groqMessages.push(...messages);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: max_tokens || 1200,
      messages: groqMessages,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json(data);
  }

  // Convert Groq response back to Anthropic format
  const text = data.choices?.[0]?.message?.content || '';
  res.status(200).json({ content: [{ type: 'text', text }] });
}
