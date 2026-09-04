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
      <nav className="bg-secondary/90 backdrop-blur-sm border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition">
            💰 BudgetBuddy
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                  Dashboard
                </Link>
                <Link to="/add-transaction" className="text-gray-300 hover:text-white transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                  Add
                </Link>
                <Link to="/budgets" className="text-gray-300 hover:text-white transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                  Budgets
                </Link>
                <Link to="/insights" className="text-gray-300 hover:text-white transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                  Insights
                </Link>
                <Link to="/history" className="text-gray-300 hover:text-white transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                  History
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-500/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary px-5 py-2 rounded-lg hover:bg-primary/80 transition text-sm font-medium shadow-lg shadow-primary/20"
                >
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
