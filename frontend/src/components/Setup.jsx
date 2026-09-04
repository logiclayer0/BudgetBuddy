import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

function Setup() {
  const [budgets, setBudgets] = useState([])
  const [categories] = useState(['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBudgets(response.data)
    } catch (error) {
      toast.error('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  const handleBudgetChange = async (category, limit) => {
    try {
      const token = localStorage.getItem('token')
      await api.post('/budgets', { category, limit }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(`Budget for ${category} updated!`)
      fetchBudgets()
    } catch (error) {
      toast.error('Failed to update budget')
    }
  }

  if (loading) return <div className="text-center text-gray-400">Loading...</div>

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Monthly Budget Setup</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => {
          const budget = budgets.find(b => b.category === cat)
          return (
            <div key={cat} className="bg-secondary/50 p-6 rounded-xl border border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">{cat}</h3>
                <span className="text-sm text-gray-400">
                  Spent: ₹{budget?.spent || 0}
                </span>
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Monthly limit"
                  className="flex-1 bg-dark border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  defaultValue={budget?.limit_amount || ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseFloat(e.target.value)
                      if (val > 0) handleBudgetChange(cat, val)
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector(`#budget-${cat}`)
                    const val = parseFloat(input?.value)
                    if (val > 0) handleBudgetChange(cat, val)
                  }}
                  className="bg-primary px-4 py-2 rounded-lg hover:bg-primary/80 transition"
                >
                  Set
                </button>
              </div>
              {budget?.limit_amount > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>Used: {((budget.spent / budget.limit_amount) * 100).toFixed(0)}%</span>
                    <span>Remaining: ₹{Math.max(budget.limit_amount - budget.spent, 0)}</span>
                  </div>
                  <div className="bg-gray-700 h-2 rounded-full mt-1">
                    <div 
                      className={`h-2 rounded-full ${(budget.spent / budget.limit_amount) > 0.8 ? 'bg-accent' : 'bg-primary'}`}
                      style={{ width: `${Math.min((budget.spent / budget.limit_amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Setup