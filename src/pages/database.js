import mysql from 'mysql2/promise';

// Create a connection pool to MySQL
const pool = mysql.createPool({
  host: 'localhost',   // Your MySQL host
  user: 'root',        // Your MySQL user
  password: 'Saurav@2024',// Your MySQL password
  database: 'myapp',    // Your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create tables if they don't exist
const createTables = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        country_id INT,
        FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL
      );
    `);
  } finally {
    connection.release();
  }
};

// Insert sample countries if they don't already exist
const insertCountriesIfNotExist = async (countries) => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query('SELECT name FROM countries');
    const existingCountries = new Set(rows.map(row => row.name));

    const insertPromises = countries
      .filter(country => !existingCountries.has(country))
      .map(country => connection.query('INSERT INTO countries (name) VALUES (?)', [country]));

    await Promise.all(insertPromises);
  } finally {
    connection.release();
  }
};

// Sample country data
const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'New Zealand'];

// Initialize the database
const initializeDatabase = async () => {
  await createTables();
  await insertCountriesIfNotExist(countries);
};

initializeDatabase().catch(console.error);

export default pool;
