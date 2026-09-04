import { createTransaction, getTransactionsByUser, getCategorySpending } from '../models/Transaction.js'
import { recordOnChain } from '../services/suiService.js'
import { parseCSV } from '../services/csvParser.js'

export const addTransaction = async (req, res) => {
  try {
    const { amount, payee, category, date, upiId, isWaste } = req.body
    const userId = req.userId

    const transaction = await createTransaction(
      userId, amount, payee, category, date, upiId, isWaste || false
    )

    try {
      await recordOnChain(userId, amount, category, payee)
    } catch (blockchainError) {
      console.error('Blockchain recording failed:', blockchainError)
    }

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ message: 'Failed to add transaction' })
  }
}

export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId
    const transactions = await getTransactionsByUser(userId)
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' })
  }
}

export const importCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' })
    }

    const userId = req.userId
    const transactions = await parseCSV(req.file.path, userId)
    
    let imported = 0
    for (const txn of transactions) {
      await createTransaction(
        userId,
        txn.amount,
        txn.payee,
        txn.category,
        txn.date,
        txn.upiId || '',
        false
      )
      imported++
    }

    res.json({ message: 'CSV imported successfully', count: imported })
  } catch (error) {
    res.status(500).json({ message: 'Failed to import CSV' })
  }
}

export const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.userId
    const breakdown = await getCategorySpending(userId)
    res.json(breakdown)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get category breakdown' })
  }
}