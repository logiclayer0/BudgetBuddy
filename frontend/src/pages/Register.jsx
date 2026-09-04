import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register', formData)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-secondary/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
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
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register