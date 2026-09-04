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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Loading your finances...</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-secondary/80 to-secondary/40 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:shadow-primary/5">
          <p className="text-gray-400 text-sm font-medium">Total Spent</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">₹{stats.total.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>
        <div className="bg-gradient-to-br from-secondary/80 to-secondary/40 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:shadow-primary/5">
          <p className="text-gray-400 text-sm font-medium">Budget Used</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{stats.budgetUsed.toFixed(0)}%</p>
            <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-primary to-purple-400" style={{ width: `${Math.min(stats.budgetUsed, 100)}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Across all categories</p>
        </div>
        <div className="bg-gradient-to-br from-secondary/80 to-secondary/40 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:shadow-accent/5">
          <p className="text-gray-400 text-sm font-medium">Potential Waste</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-accent to-red-400 bg-clip-text text-transparent">₹{stats.waste.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">AI detected overspending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-primary">📊</span> Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={{ fill: '#9CA3AF', fontSize: 12 }}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid #374151', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-secondary/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-primary">📋</span> Recent Transactions
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
            {transactions.length > 0 ? (
              transactions.map((t, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-dark/50 border border-gray-800 hover:border-gray-700 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                      {t.category === 'Food' ? '🍕' : t.category === 'Travel' ? '🚗' : t.category === 'Shopping' ? '🛍️' : '📌'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.payee}</p>
                      <p className="text-xs text-gray-500">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-accent font-semibold">-₹{t.amount}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-4xl mb-2">📭</p>
                <p>No transactions yet</p>
                <p className="text-xs mt-1">Add your first expense!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
