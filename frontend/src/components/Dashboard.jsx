import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import api from '../utils/api'

const COLORS = ['#6C63FF', '#FF6B6B', '#4ECDC4', '#FFD93D', '#FF8A5C', '#A29BFE']

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, budgetUsed: 0, waste: 0 })
  const [transactions, setTransactions] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const txns = await api.get('/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(txns.data.slice(0, 5))

      const total = txns.data.reduce((sum, t) => sum + t.amount, 0)
      const budget = await api.get('/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const budgetTotal = budget.data.reduce((sum, b) => sum + b.limit_amount, 0)
      const budgetUsed = budget.data.reduce((sum, b) => sum + (b.spent || 0), 0)

      const catMap = {}
      txns.data.forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount
      })
      const catData = Object.keys(catMap).map(key => ({
        name: key,
        value: catMap[key]
      }))
      setCategoryData(catData)

      setStats({
        total: total,
        budgetUsed: budgetTotal > 0 ? (budgetUsed / budgetTotal) * 100 : 0,
        waste: total * 0.15
      })
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-secondary/50 p-6 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Total Spent</p>
          <p className="text-3xl font-bold">₹{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-secondary/50 p-6 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Budget Used</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold">{stats.budgetUsed.toFixed(0)}%</p>
            <div className="flex-1 bg-gray-700 h-2 rounded-full">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(stats.budgetUsed, 100)}%` }}></div>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 p-6 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Potential Waste</p>
          <p className="text-3xl font-bold text-accent">₹{stats.waste.toFixed(0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary/50 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-secondary/50 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.map((t, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-700 pb-2">
                <div>
                  <p className="font-medium">{t.payee}</p>
                  <p className="text-sm text-gray-400">{t.category}</p>
                </div>
                <p className="text-accent">-₹{t.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard