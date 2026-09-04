import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getInsights } from '../controllers/insightController.js'

const router = express.Router()

router.use(authMiddleware)
router.get('/', getInsights)

export default router