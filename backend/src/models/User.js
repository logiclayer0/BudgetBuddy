import getDb from '../config/database.js'

export const createUser = async (name, email, password) => {
  const db = await getDb()
  const result = await db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  )
  const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [result.lastID])
  return user
}

export const findUserByEmail = async (email) => {
  const db = await getDb()
  return await db.get('SELECT * FROM users WHERE email = ?', [email])
}

export const findUserById = async (id) => {
  const db = await getDb()
  return await db.get('SELECT id, name, email FROM users WHERE id = ?', [id])
}