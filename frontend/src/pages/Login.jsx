import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-secondary/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary py-3 rounded-lg hover:bg-primary/80 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login