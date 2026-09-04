import { exec } from 'child_process'
import { promisify } from 'util'
import dotenv from 'dotenv'

const execAsync = promisify(exec)
dotenv.config()

const PACKAGE_ID = process.env.SUI_PACKAGE_ID || '0xYOUR_PACKAGE_ID'
const MODULE_NAME = 'budget_tracker'

export const recordOnChain = async (userId, amount, category, payee) => {
  try {
    const command = `sui client call --package ${PACKAGE_ID} --module ${MODULE_NAME} --function record_transaction --args ${amount} "${category}" "${payee}" --gas-budget 10000000`
    
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      console.error('Sui error:', stderr)
      throw new Error('Blockchain transaction failed')
    }
    
    return { success: true, txHash: stdout }
  } catch (error) {
    console.error('Blockchain error:', error)
    return { success: false, error: error.message }
  }
}

export const getOnChainTransactions = async (userId) => {
  try {
    const command = `sui client call --package ${PACKAGE_ID} --module ${MODULE_NAME} --function get_transactions --args ${userId} --gas-budget 10000000`
    
    const { stdout } = await execAsync(command)
    return { success: true, data: stdout }
  } catch (error) {
    return { success: false, error: error.message }
  }
}