export const sendBudgetAlert = (user, category, spent, limit) => {
  const percentage = (spent / limit) * 100
  
  let message = ''
  let type = 'info'
  let action = ''
  
  if (percentage >= 100) {
    message = `⚠️ You have exceeded your ${category} budget of ₹${limit}! Current spending: ₹${spent}`
    type = 'danger'
    action = 'Reduce spending in this category immediately'
  } else if (percentage >= 80) {
    message = `⚠️ You have used ${percentage.toFixed(0)}% of your ${category} budget (₹${limit})`
    type = 'warning'
    action = `Only ₹${Math.round(limit - spent)} remaining for this month`
  } else if (percentage >= 50) {
    message = `ℹ️ You have used ${percentage.toFixed(0)}% of your ${category} budget (₹${limit})`
    type = 'info'
    action = `₹${Math.round(limit - spent)} still available`
  }
  
  return { 
    message, 
    type, 
    action,
    category,
    spent,
    limit,
    percentage: Math.round(percentage)
  }
}

export const sendDailySummary = (transactions) => {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0)
  const count = transactions.length
  
  let message = ''
  let status = 'good'
  
  if (total > 1000) {
    message = `Today's spending: ₹${total} across ${count} transactions. You exceeded daily limit!`
    status = 'danger'
  } else if (total > 500) {
    message = `Today's spending: ₹${total} across ${count} transactions. You are on track!`
    status = 'warning'
  } else {
    message = `Today's spending: ₹${total} across ${count} transactions. Great job saving!`
    status = 'good'
  }
  
  return {
    message,
    total,
    count,
    status,
    date: new Date().toISOString().split('T')[0]
  }
}

export const sendWeeklyReport = (transactions, budgets) => {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0)
  const categorySummary = {}
  
  transactions.forEach(t => {
    categorySummary[t.category] = (categorySummary[t.category] || 0) + t.amount
  })
  
  let topCategory = ''
  let maxAmount = 0
  
  for (const [cat, amount] of Object.entries(categorySummary)) {
    if (amount > maxAmount) {
      maxAmount = amount
      topCategory = cat
    }
  }
  
  const budgetStatus = budgets.map(b => ({
    category: b.category,
    spent: b.spent || 0,
    limit: b.limit_amount,
    percentage: ((b.spent || 0) / b.limit_amount) * 100,
    status: ((b.spent || 0) / b.limit_amount) >= 0.8 ? 'danger' : 
            ((b.spent || 0) / b.limit_amount) >= 0.5 ? 'warning' : 'good'
  }))
  
  const overspentCategories = budgetStatus.filter(b => b.percentage >= 100)
  const warningCategories = budgetStatus.filter(b => b.percentage >= 80 && b.percentage < 100)
  
  let summary = `Weekly Report:\n`
  summary += `Total spent: ₹${total}\n`
  summary += `Top category: ${topCategory} (₹${maxAmount})\n`
  summary += `Transactions: ${transactions.length}\n`
  
  if (overspentCategories.length > 0) {
    summary += `⚠️ Overspent: ${overspentCategories.map(b => b.category).join(', ')}\n`
  }
  
  if (warningCategories.length > 0) {
    summary += `⚠️ Near limit: ${warningCategories.map(b => b.category).join(', ')}\n`
  }
  
  return {
    summary,
    total,
    topCategory,
    maxAmount,
    categorySummary,
    budgetStatus,
    transactionCount: transactions.length,
    overspentCategories,
    warningCategories,
    weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    weekEnd: new Date().toISOString().split('T')[0]
  }
}

export const sendMonthlyReport = (transactions, budgets) => {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0)
  const categorySummary = {}
  const dailySpending = {}
  
  transactions.forEach(t => {
    categorySummary[t.category] = (categorySummary[t.category] || 0) + t.amount
    const date = t.date
    dailySpending[date] = (dailySpending[date] || 0) + t.amount
  })
  
  const avgDaily = total / Object.keys(dailySpending).length || 0
  
  const categoryList = Object.entries(categorySummary)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
  
  const budgetStatus = budgets.map(b => ({
    category: b.category,
    spent: b.spent || 0,
    limit: b.limit_amount,
    percentage: ((b.spent || 0) / b.limit_amount) * 100,
    savings: Math.max((b.limit_amount - (b.spent || 0)), 0)
  }))
  
  const totalSavings = budgetStatus.reduce((sum, b) => sum + b.savings, 0)
  const totalBudget = budgetStatus.reduce((sum, b) => sum + b.limit, 0)
  
  let summary = `📊 Monthly Report\n`
  summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  summary += `💰 Total Spent: ₹${total}\n`
  summary += `💵 Total Budget: ₹${totalBudget}\n`
  summary += `💎 Total Savings: ₹${totalSavings}\n`
  summary += `📅 Avg Daily: ₹${Math.round(avgDaily)}\n`
  summary += `📦 Transactions: ${transactions.length}\n`
  summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  summary += `Top Categories:\n`
  
  categoryList.slice(0, 5).forEach((cat, i) => {
    summary += `  ${i+1}. ${cat.category}: ₹${cat.total}\n`
  })
  
  const overspent = budgetStatus.filter(b => b.percentage >= 100)
  if (overspent.length > 0) {
    summary += `\n⚠️ Overspent Categories:\n`
    overspent.forEach(b => {
      summary += `  - ${b.category}: ₹${b.spent} / ₹${b.limit}\n`
    })
  }
  
  return {
    summary,
    total,
    totalBudget,
    totalSavings,
    avgDaily: Math.round(avgDaily),
    transactionCount: transactions.length,
    categorySummary,
    budgetStatus,
    categoryList,
    overspentCategories: overspent,
    month: new Date().toISOString().substring(0, 7)
  }
}

export const sendWasteAlert = (wasteItems) => {
  if (wasteItems.length === 0) {
    return {
      message: '✅ No wasteful spending detected this month. Keep it up!',
      type: 'success',
      items: []
    }
  }
  
  const totalWaste = wasteItems.reduce((sum, w) => sum + w.excess, 0)
  
  let message = `⚠️ You wasted ₹${totalWaste} across ${wasteItems.length} categories:\n`
  
  wasteItems.forEach(w => {
    message += `  - ${w.category}: ₹${w.excess} over budget\n`
  })
  
  message += `\n💡 Tip: Reduce spending on ${wasteItems[0]?.category || 'your top category'} to save more!`
  
  return {
    message,
    type: 'danger',
    totalWaste,
    items: wasteItems
  }
}

export const getSmartSavingTips = (transactions, budgets) => {
  const tips = []
  
  const categorySpending = {}
  transactions.forEach(t => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
  })
  
  budgets.forEach(b => {
    const spent = categorySpending[b.category] || 0
    if (spent > b.limit_amount * 0.8) {
      tips.push({
        category: b.category,
        tip: `Reduce ${b.category} spending by ₹${Math.round(spent - b.limit_amount * 0.7)} per month`,
        potentialSavings: Math.round(spent - b.limit_amount * 0.7),
        priority: spent > b.limit_amount ? 'high' : 'medium'
      })
    }
  })
  
  const dailySpending = {}
  transactions.forEach(t => {
    const date = t.date
    dailySpending[date] = (dailySpending[date] || 0) + t.amount
  })
  
  let highSpendingDays = 0
  for (const [date, amount] of Object.entries(dailySpending)) {
    if (amount > 1000) {
      highSpendingDays++
    }
  }
  
  if (highSpendingDays > 5) {
    tips.push({
      category: 'Daily Spending',
      tip: `You had ${highSpendingDays} days with spending over ₹1000. Try setting a daily limit of ₹800`,
      potentialSavings: highSpendingDays * 200,
      priority: 'medium'
    })
  }
  
  tips.sort((a, b) => b.potentialSavings - a.potentialSavings)
  
  return tips
}