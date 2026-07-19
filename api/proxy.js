module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Variables de entorno SUPABASE_URL y SUPABASE_KEY no configuradas.' });
  }

  try {
    const table = req.query.table;
    if (!table) {
      return res.status(400).json({ error: 'Parámetro "table" requerido.' });
    }

    if (req.method === 'GET') {
      const limit = req.query.limit || '5000';
      const select = req.query.select || '*';
      const url = `${SUPABASE_URL}/${table}?select=${select}&limit=${limit}`;

      const r = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!r.ok) {
        const err = await r.text();
        return res.status(r.status).json({ error: err });
      }

      const data = await r.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const url = `${SUPABASE_URL}/${table}`;
      const body = req.body;

      const r = await fetch(url, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(body)
      });

      const data = await r.json();
      if (!r.ok) {
        return res.status(r.status).json({ error: data });
      }

      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
