export const validateTransaction = (data) => {
  const errors = []
  
  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0')
  }
  
  if (!data.payee || data.payee.trim().length < 2) {
    errors.push('Payee name is required and must be at least 2 characters')
  }
  
  if (!data.category) {
    errors.push('Category is required')
  }
  
  if (data.date) {
    const date = new Date(data.date)
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateBudget = (data) => {
  const errors = []
  
  if (!data.category) {
    errors.push('Category is required')
  }
  
  if (!data.limit || data.limit <= 0) {
    errors.push('Budget limit must be greater than 0')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateUser = (data) => {
  const errors = []
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required')
  }
  
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const isValidAmount = (amount) => {
  return typeof amount === 'number' && amount > 0 && !isNaN(amount)
}

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '')
  }
  return input
}