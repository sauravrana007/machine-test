// pages/api/users.js
import db from '../database';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { firstname, lastname, country_id } = req.body;
    const stmt = db.prepare('INSERT INTO users (firstname, lastname, country_id) VALUES (?, ?, ?)');
    const info = stmt.run(firstname, lastname, country_id);
    res.status(201).json({ id: info.lastInsertRowid });
  } else if (req.method === 'GET') {
    const users = db.prepare('SELECT u.*, c.name AS country FROM users u LEFT JOIN countries c ON u.country_id = c.id').all();
    res.status(200).json(users);
  } else if (req.method === 'PUT') {
    const { id, firstname, lastname, country_id } = req.body;
    const stmt = db.prepare('UPDATE users SET firstname = ?, lastname = ?, country_id = ? WHERE id = ?');
    stmt.run(firstname, lastname, country_id, id);
    res.status(200).json({ message: 'User updated' });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
