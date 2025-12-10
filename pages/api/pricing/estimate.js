export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Tylko POST' });
  try {
    const response = await fetch('http://localhost:3001/pricing/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Błąd połączenia z backendem' });
  }
}

