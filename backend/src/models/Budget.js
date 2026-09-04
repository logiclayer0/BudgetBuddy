import getDb from '../config/database.js'

export const setBudget = async (userId, category, limit) => {
  const db = await getDb()
  await db.run(
    `INSERT INTO budgets (user_id, category, limit_amount, spent) 
     VALUES (?, ?, ?, 0) 
     ON CONFLICT(user_id, category) 
     DO UPDATE SET limit_amount = ?`,
    [userId, category, limit, limit]
  )
  return await db.get(
    'SELECT * FROM budgets WHERE user_id = ? AND category = ?',
    [userId, category]
  )
}

export const getBudgetsByUser = async (userId) => {
  const db = await getDb()
  return await db.all(
    `SELECT b.*, COALESCE(SUM(t.amount), 0) as spent 
     FROM budgets b 
     LEFT JOIN transactions t ON b.user_id = t.user_id AND b.category = t.category 
     WHERE b.user_id = ? 
     GROUP BY b.id`,
    [userId]
  )
}