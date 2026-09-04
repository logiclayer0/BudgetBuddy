import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import budgetRoutes from './routes/budgetRoutes.js'
import insightRoutes from './routes/insightRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/insights', insightRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BudgetBuddy API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})