import { setBudget, getBudgetsByUser } from '../models/Budget.js'

export const setBudgetLimit = async (req, res) => {
  try {
    const { category, limit } = req.body
    const userId = req.userId

    if (!category || !limit || limit <= 0) {
      return res.status(400).json({ message: 'Invalid budget data' })
    }

    const budget = await setBudget(userId, category, limit)
    res.json(budget)
  } catch (error) {
    res.status(500).json({ message: 'Failed to set budget' })
  }
}

export const getBudgets = async (req, res) => {
  try {
    const userId = req.userId
    const budgets = await getBudgetsByUser(userId)
    res.json(budgets)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get budgets' })
  }
}