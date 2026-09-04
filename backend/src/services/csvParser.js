import fs from 'fs'
import csv from 'csv-parser'

export const parseCSV = (filePath, userId) => {
  return new Promise((resolve, reject) => {
    const results = []
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const categoryMap = {
          'zomato': 'Food', 'swiggy': 'Food', 'uber': 'Travel',
          'ola': 'Travel', 'netflix': 'Subscription', 'spotify': 'Subscription',
          'amazon': 'Shopping', 'flipkart': 'Shopping'
        }
        
        const description = (data.Description || data['Transaction Details'] || '').toLowerCase()
        let category = 'Other'
        
        for (const [key, cat] of Object.entries(categoryMap)) {
          if (description.includes(key)) {
            category = cat
            break
          }
        }
        
        const amount = parseFloat((data.Amount || data['Debit'] || '0').replace(/[^0-9.]/g, ''))
        const date = data.Date || data['Transaction Date'] || new Date().toISOString()
        
        if (amount > 0) {
          results.push({
            userId,
            amount,
            payee: description.substring(0, 50),
            category,
            date: new Date(date).toISOString().split('T')[0],
            upiId: data['UPI Transaction ID'] || data['Transaction ID'] || ''
          })
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error))
  })
}