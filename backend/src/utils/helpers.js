export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export const getCategoryIcon = (category) => {
  const icons = {
    'Food': '🍕',
    'Travel': '🚗',
    'Shopping': '🛍️',
    'Bills': '📄',
    'Entertainment': '🎬',
    'Health': '🏥',
    'Education': '📚',
    'Subscription': '📺',
    'Other': '📌',
    'Wallet': '💳'
  }
  return icons[category] || '📌'
}

export const getCategoryColor = (category) => {
  const colors = {
    'Food': '#FF6B6B',
    'Travel': '#4ECDC4',
    'Shopping': '#FFD93D',
    'Bills': '#6C63FF',
    'Entertainment': '#FF8A5C',
    'Health': '#A29BFE',
    'Education': '#00D2FF',
    'Subscription': '#FF6B9D',
    'Other': '#95A5A6',
    'Wallet': '#2ECC71'
  }
  return colors[category] || '#95A5A6'
}

export const calculateTotal = (transactions) => {
  return transactions.reduce((sum, t) => sum + t.amount, 0)
}

export const calculateCategoryTotal = (transactions, category) => {
  return transactions
    .filter(t => t.category === category)
    .reduce((sum, t) => sum + t.amount, 0)
}

export const groupByCategory = (transactions) => {
  const groups = {}
  transactions.forEach(t => {
    if (!groups[t.category]) {
      groups[t.category] = []
    }
    groups[t.category].push(t)
  })
  return groups
}

export const getTopSpendingCategories = (transactions, limit = 5) => {
  const categoryTotals = {}
  transactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
  })
  
  return Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, total]) => ({ category, total }))
}

export const getMonthlySpending = (transactions, year, month) => {
  return transactions.filter(t => {
    const date = new Date(t.date)
    return date.getFullYear() === year && date.getMonth() === month
  })
}

export const getDailySpending = (transactions, date) => {
  return transactions
    .filter(t => t.date === date)
    .reduce((sum, t) => sum + t.amount, 0)
}

export const getSpendingTrend = (transactions, months = 6) => {
  const trend = []
  const now = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const total = getMonthlySpending(transactions, year, month)
      .reduce((sum, t) => sum + t.amount, 0)
    
    trend.push({
      month: `${monthName} ${year}`,
      amount: total
    })
  }
  
  return trend
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000)
}

export const isToday = (date) => {
  const today = new Date()
  const compareDate = new Date(date)
  return today.getDate() === compareDate.getDate() &&
         today.getMonth() === compareDate.getMonth() &&
         today.getFullYear() === compareDate.getFullYear()
}

export const getPercentage = (part, total) => {
  if (total === 0) return 0
  return (part / total) * 100
}

export const truncateText = (text, length = 20) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}