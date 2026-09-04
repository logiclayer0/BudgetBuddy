import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export function useWallet() {
  const [address, setAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Connection check failed:', error)
      }
    }
  }

  const connect = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask')
        return false
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAddress(accounts[0])
      setIsConnected(true)
      toast.success('Wallet connected!')
      return true
    } catch (error) {
      toast.error('Failed to connect wallet')
      return false
    }
  }

  const disconnect = () => {
    setAddress('')
    setIsConnected(false)
    toast.success('Wallet disconnected')
  }

  return { address, isConnected, connect, disconnect }
}