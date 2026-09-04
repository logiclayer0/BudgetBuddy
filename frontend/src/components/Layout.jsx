import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function Layout() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [isLoggedIn] = useState(!!token)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-dark">
      <nav className="bg-secondary/90 backdrop-blur-sm border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            💰 BudgetBuddy
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition text-sm">Dashboard</Link>
                <Link to="/add-transaction" className="text-gray-300 hover:text-white transition text-sm">Add</Link>
                <Link to="/budgets" className="text-gray-300 hover:text-white transition text-sm">Budgets</Link>
                <Link to="/insights" className="text-gray-300 hover:text-white transition text-sm">Insights</Link>
                <Link to="/history" className="text-gray-300 hover:text-white transition text-sm">History</Link>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition text-sm">Login</Link>
                <Link to="/register" className="bg-primary px-4 py-2 rounded-lg hover:bg-primary/80 transition text-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout