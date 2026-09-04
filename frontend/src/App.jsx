import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './components/Dashboard'
import AddTransaction from './components/AddTransaction'
import Setup from './components/Setup'
import Insights from './components/Insights'
import TransactionHistory from './components/TransactionHistory'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A2E',
            color: '#FFFFFF',
            border: '1px solid #374151',
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-transaction" element={<AddTransaction />} />
          <Route path="budgets" element={<Setup />} />
          <Route path="insights" element={<Insights />} />
          <Route path="history" element={<TransactionHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
