export const detectWaste = (transactions, budgets) => {
  const wasteInsights = []
  
  const categorySpending = {}
  transactions.forEach(t => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
  })
  
  budgets.forEach(b => {
    const spent = categorySpending[b.category] || 0
    if (spent > b.limit_amount * 0.8) {
      wasteInsights.push({
        category: b.category,
        message: `You've used ${((spent / b.limit_amount) * 100).toFixed(0)}% of your ${b.category} budget. ${spent > b.limit_amount ? 'Over budget!' : 'Almost there!'}`,
        severity: spent > b.limit_amount ? 'Critical' : 'Warning'
      })
    }
  })
  
  const dailyLimit = 1000
  const dailySpending = {}
  transactions.forEach(t => {
    const date = t.date
    dailySpending[date] = (dailySpending[date] || 0) + t.amount
  })
  
  for (const [date, amount] of Object.entries(dailySpending)) {
    if (amount > dailyLimit) {
      wasteInsights.push({
        category: 'Daily Spending',
        message: `You spent ₹${amount} on ${date}, exceeding your daily limit of ₹${dailyLimit}`,
        severity: 'Warning'
      })
    }
  }
  
  return wasteInsights.slice(0, 5)
}