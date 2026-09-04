export const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Subscription',
  'Wallet',
  'Other'
]

export const CATEGORY_ICONS = {
  'Food': '🍕',
  'Travel': '🚗',
  'Shopping': '🛍️',
  'Bills': '📄',
  'Entertainment': '🎬',
  'Health': '🏥',
  'Education': '📚',
  'Subscription': '📺',
  'Wallet': '💳',
  'Other': '📌'
}

export const CATEGORY_COLORS = {
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

export const EXPENSE_LIMITS = {
  DAILY: 1000,
  WEEKLY: 7000,
  MONTHLY: 30000
}

export const WASTE_THRESHOLDS = {
  BUDGET_EXCEED: 0.8,
  SPIKE_PERCENTAGE: 1.3,
  MIN_WASTE_AMOUNT: 100
}

export const API_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'Something went wrong',
  UNAUTHORIZED: 'Please login to continue',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Please check your input'
}

export const BLOCKCHAIN_CONFIG = {
  NETWORK: 'sui_testnet',
  GAS_BUDGET: 10000000,
  MAX_RETRIES: 3
}