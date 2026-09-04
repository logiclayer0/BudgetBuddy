import { exec } from 'child_process'
import { promisify } from 'util'
import dotenv from 'dotenv'

const execAsync = promisify(exec)
dotenv.config()

const PACKAGE_ID = process.env.SUI_PACKAGE_ID || '0xYOUR_PACKAGE_ID'
const MODULE_NAME = 'budget_tracker'

export const recordTransactionOnChain = async (amount, category, payee) => {
  try {
    const command = `sui client call --package ${PACKAGE_ID} --module ${MODULE_NAME} --function record_transaction --args ${amount} "${category}" "${payee}" --gas-budget 10000000`
    
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr && !stderr.includes('Success')) {
      throw new Error(stderr)
    }
    
    return { 
      success: true, 
      txHash: stdout.match(/0x[a-fA-F0-9]{64}/)?.[0] || 'Transaction recorded',
      output: stdout 
    }
  } catch (error) {
    console.error('Blockchain recording error:', error)
    return { success: false, error: error.message }
  }
}

export const setBudgetOnChain = async (category, limit) => {
  try {
    const command = `sui client call --package ${PACKAGE_ID} --module ${MODULE_NAME} --function set_budget --args "${category}" ${limit} --gas-budget 10000000`
    
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr && !stderr.includes('Success')) {
      throw new Error(stderr)
    }
    
    return { 
      success: true, 
      output: stdout 
    }
  } catch (error) {
    console.error('Blockchain budget error:', error)
    return { success: false, error: error.message }
  }
}

export const markWasteOnChain = async (transactionId) => {
  try {
    const command = `sui client call --package ${PACKAGE_ID} --module ${MODULE_NAME} --function mark_as_waste --args ${transactionId} --gas-budget 10000000`
    
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr && !stderr.includes('Success')) {
      throw new Error(stderr)
    }
    
    return { 
      success: true, 
      output: stdout 
    }
  } catch (error) {
    console.error('Blockchain mark waste error:', error)
    return { success: false, error: error.message }
  }
}

export const getOnChainTransactions = async (address) => {
  try {
    const command = `sui client objects ${address}`
    
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      throw new Error(stderr)
    }
    
    return { 
      success: true, 
      data: stdout 
    }
  } catch (error) {
    console.error('Get transactions error:', error)
    return { success: false, error: error.message }
  }
}

export const getWalletBalance = async (address) => {
  try {
    const command = `sui client balance ${address}`
    
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      throw new Error(stderr)
    }
    
    return { 
      success: true, 
      balance: stdout 
    }
  } catch (error) {
    console.error('Balance fetch error:', error)
    return { success: false, error: error.message }
  }
}

export const getTransactionDetails = async (txHash) => {
  try {
    const command = `sui client tx-block ${txHash}`
    
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      throw new Error(stderr)
    }
    
    return { 
      success: true, 
      details: stdout 
    }
  } catch (error) {
    console.error('Transaction details error:', error)
    return { success: false, error: error.message }
  }
}

export const getPackageDetails = async () => {
  try {
    const command = `sui client package ${PACKAGE_ID}`
    
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      throw new Error(stderr)
    }
    
    return { 
      success: true, 
      details: stdout 
    }
  } catch (error) {
    console.error('Package details error:', error)
    return { success: false, error: error.message }
  }
}