import express from 'express'
import multer from 'multer'
import { authMiddleware } from '../middleware/auth.js'
import { addTransaction, getTransactions, importCSV, getCategoryBreakdown } from '../controllers/transactionController.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.use(authMiddleware)

router.post('/', addTransaction)
router.get('/', getTransactions)
router.post('/import', upload.single('csv'), importCSV)
router.get('/categories', getCategoryBreakdown)

export default router
