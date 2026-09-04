import { getTransactionsByUser } from '../models/Transaction.js'
import { getBudgetsByUser } from '../models/Budget.js'
import { detectWaste } from '../services/wasteDetector.js'
import { getAIAdvice } from '../services/aiservice.js'

export const getInsights = async (req, res) => {
  try {
    const userId = req.userId
    const transactions = await getTransactionsByUser(userId)
    const budgets = await getBudgetsByUser(userId)

    const waste = detectWaste(transactions, budgets)
    
    let aiAdvice = ''
    if (waste.length > 0) {
      aiAdvice = await getAIAdvice(waste, transactions)
    }

    res.json({ waste, aiAdvice })
  } catch (error) {
    res.status(500).json({ message: 'Failed to get insights' })
  }
}