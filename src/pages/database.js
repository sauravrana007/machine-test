// database.js
import sqlite3 from 'better-sqlite3';

const db = sqlite3('database.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS countries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
  
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    country_id INTEGER,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL
  );
`);

// Insert sample countries if they don't already exist
const insertCountriesIfNotExist = db.transaction((countries) => {
  const insert = db.prepare('INSERT OR IGNORE INTO countries (name) VALUES (?)');
  for (const country of countries) {
    insert.run(country);
  }
});

// Sample country data
const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'New Zealand'];

// Insert sample countries
insertCountriesIfNotExist(countries);

export default db;
