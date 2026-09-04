import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const getAIAdvice = async (waste, transactions) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return 'Track your spending on Food and Travel - they seem to be your biggest expenses!'
    }
    
    const wasteCategories = waste.map(w => w.category).join(', ')
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: `You are a financial advisor. User spent ₹${totalSpent} total. Waste categories: ${wasteCategories}. Give 3 actionable tips to save money. Keep it short and friendly.`
          }]
        }]
      }
    )
    
    const advice = response.data.candidates[0].content.parts[0].text
    return advice || 'Set budgets for your top spending categories to save more!'
  } catch (error) {
    console.error('AI service error:', error.message)
    return 'Set budgets for your top spending categories to save more!'
  }
}