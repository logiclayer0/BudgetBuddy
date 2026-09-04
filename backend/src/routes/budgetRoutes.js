import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { setBudgetLimit, getBudgets } from '../controllers/budgt.cntrlr.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/', setBudgetLimit)
router.get('/', getBudgets)

export default router