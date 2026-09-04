import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

function TransactionHistory() {
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(response.data)
    } catch (error) {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const filtered = transactions.filter(t => 
    t.payee.toLowerCase().includes(filter.toLowerCase()) ||
    t.category.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading) return <div className="text-center text-gray-400">Loading...</div>

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Transaction History</h2>
      
      <input
        type="text"
        placeholder="Search transactions..."
        className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-primary"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="bg-secondary/50 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark/50 border-b border-gray-800">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">Payee</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">Category</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">Amount</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">Date</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((t, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-white/5">
                  <td className="px-6 py-4">{t.payee}</td>
                  <td className="px-6 py-4">
                    <span className="bg-primary/20 px-2 py-1 rounded text-sm">{t.category}</span>
                  </td>
                  <td className="px-6 py-4 text-accent">-₹{t.amount}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {t.is_waste ? (
                      <span className="text-accent text-sm">⚠️ Waste</span>
                    ) : (
                      <span className="text-green-400 text-sm">✅ On Track</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionHistory