import pool from '../database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT DISTINCT * FROM countries');
      connection.release();
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch countries' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
