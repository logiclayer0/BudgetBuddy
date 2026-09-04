import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'

function AddTransaction() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories] = useState(['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'])
  const [formData, setFormData] = useState({
    amount: '',
    payee: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    upiId: '',
    isWaste: false
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await api.post('/transactions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Transaction added!')
      setFormData({ amount: '', payee: '', category: 'Food', date: new Date().toISOString().split('T')[0], upiId: '', isWaste: false })
    } catch (error) {
      toast.error('Failed to add transaction')
    } finally {
      setLoading(false)
    }
  }

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('csv', file)

    try {
      const token = localStorage.getItem('token')
      const response = await api.post('/transactions/import', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success(`Imported ${response.data.count} transactions!`)
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to import CSV')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Add Transaction</h2>
      
      <div className="bg-secondary/50 p-6 rounded-xl border border-gray-800 mb-6">
        <h3 className="text-lg font-semibold mb-3">Upload CSV (Google Pay/PhonePe)</h3>
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2"
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-secondary/50 p-6 rounded-xl border border-gray-800 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
          <input
            type="number"
            placeholder="450"
            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Payee / Description</label>
          <input
            type="text"
            placeholder="Zomato / Uber / Netflix"
            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            value={formData.payee}
            onChange={(e) => setFormData({...formData, payee: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <select
            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">UPI ID</label>
          <input
            type="text"
            placeholder="zomato@paytm"
            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            value={formData.upiId}
            onChange={(e) => setFormData({...formData, upiId: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Date</label>
          <input
            type="date"
            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isWaste"
            className="w-5 h-5 accent-primary"
            checked={formData.isWaste}
            onChange={(e) => setFormData({...formData, isWaste: e.target.checked})}
          />
          <label htmlFor="isWaste" className="text-gray-400">Mark as wasteful spending</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary py-3 rounded-lg hover:bg-primary/80 transition font-semibold disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  )
}

export default AddTransaction