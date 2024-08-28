import pool from '../database';

export default async function handler(req, res) {
  let connection;

  try {
    connection = await pool.getConnection();

    if (req.method === 'POST') {
      const { firstname, lastname, country_id } = req.body;
      const [result] = await connection.query(
        'INSERT INTO users (firstname, lastname, country_id) VALUES (?, ?, ?)',
        [firstname, lastname, country_id]
      );
      res.status(201).json({ id: result.insertId });

    } else if (req.method === 'GET') {
      const [users] = await connection.query(
        'SELECT u.*, c.name AS country FROM users u LEFT JOIN countries c ON u.country_id = c.id'
      );
      res.status(200).json(users);

    } else if (req.method === 'PUT') {
      const { id, firstname, lastname, country_id } = req.body;
      await connection.query(
        'UPDATE users SET firstname = ?, lastname = ?, country_id = ? WHERE id = ?',
        [firstname, lastname, country_id, id]
      );
      res.status(200).json({ message: 'User updated' });

    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      await connection.query('DELETE FROM users WHERE id = ?', [id]);
      res.status(204).end();

    } else {
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database operation failed:', error.message);
    res.status(500).json({ error: 'Database operation failed' });
  } finally {
    if (connection) connection.release(); // Release connection only if it was successfully acquired
  }
}
