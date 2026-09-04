import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import dotenv from 'dotenv'

dotenv.config()

let db

export const getDb = async () => {
  if (!db) {
    db = await open({
      filename: './budgetbuddy.db',
      driver: sqlite3.Database
    })
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount REAL NOT NULL,
        payee TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        upi_id TEXT,
        is_waste INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        limit_amount REAL NOT NULL,
        spent REAL DEFAULT 0,
        UNIQUE(user_id, category)
      );
    `)
  }
  return db
}

export default getDb