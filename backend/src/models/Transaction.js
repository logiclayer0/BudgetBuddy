import getDb from '../config/database.js'

export const createTransaction = async (userId, amount, payee, category, date, upiId, isWaste) => {
  const db = await getDb()
  const result = await db.run(
    `INSERT INTO transactions (user_id, amount, payee, category, date, upi_id, is_waste) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, amount, payee, category, date, upiId, isWaste ? 1 : 0]
  )
  return await db.get('SELECT * FROM transactions WHERE id = ?', [result.lastID])
}

export const getTransactionsByUser = async (userId) => {
  const db = await getDb()
  return await db.all(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
    [userId]
  )
}

export const getCategorySpending = async (userId) => {
  const db = await getDb()
  return await db.all(
    'SELECT category, SUM(amount) as total FROM transactions WHERE user_id = ? GROUP BY category',
    [userId]
  )
}