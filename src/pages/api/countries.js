// pages/api/countries.js
import db from '../database';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch unique countries from the database
      const countries = db.prepare('SELECT DISTINCT * FROM countries').all();
      res.status(200).json(countries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch countries' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
