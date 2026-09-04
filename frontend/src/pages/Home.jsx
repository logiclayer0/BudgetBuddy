import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="max-w-3xl">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Track Your UPI Spending
        </h1>
        <p className="text-xl text-gray-400 mb-4">
          BudgetBuddy helps you track every UPI transaction and shows you 
          <span className="text-accent font-semibold"> exactly where your money is wasting</span>
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/register" className="bg-primary px-8 py-3 rounded-xl hover:bg-primary/80 transition font-semibold">
            Get Started Free
          </Link>
          <Link to="/login" className="border border-gray-600 px-8 py-3 rounded-xl hover:bg-white/5 transition">
            Login
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-16">
          <div className="bg-secondary/50 p-6 rounded-xl backdrop-blur-sm">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold">Track Expenses</h3>
            <p className="text-sm text-gray-400">Log every UPI transaction instantly</p>
          </div>
          <div className="bg-secondary/50 p-6 rounded-xl backdrop-blur-sm">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold">Waste Detection</h3>
            <p className="text-sm text-gray-400">AI finds where you overspend</p>
          </div>
          <div className="bg-secondary/50 p-6 rounded-xl backdrop-blur-sm">
            <div className="text-3xl mb-3">⛓️</div>
            <h3 className="font-semibold">Blockchain Secure</h3>
            <p className="text-sm text-gray-400">Immutable records on Sui</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home