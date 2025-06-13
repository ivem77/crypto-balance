// Mock API functions for testing when external APIs are blocked

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchMockBitcoinBalance = async (address) => {
  await delay(1000) // Simulate network delay
  return {
    balance: Math.random() * 2 + 0.1, // Random balance between 0.1 and 2.1 BTC
    balanceUsd: 0,
    transactions: Math.floor(Math.random() * 100) + 1
  }
}

export const fetchMockEthereumBalance = async (address) => {
  await delay(1200)
  return {
    balance: Math.random() * 10 + 0.5, // Random balance between 0.5 and 10.5 ETH
    balanceUsd: 0,
    transactions: Math.floor(Math.random() * 200) + 1
  }
}

export const fetchMockSolanaBalance = async (address) => {
  await delay(800)
  return {
    balance: Math.random() * 100 + 5, // Random balance between 5 and 105 SOL
    balanceUsd: 0,
    transactions: Math.floor(Math.random() * 50) + 1
  }
}

export const fetchMockCryptoPrices = async () => {
  await delay(500)
  return {
    bitcoin: 45000 + Math.random() * 10000, // Random price around $45k-55k
    ethereum: 2500 + Math.random() * 1000,  // Random price around $2.5k-3.5k
    solana: 80 + Math.random() * 40         // Random price around $80-120
  }
}

export const fetchMockWalletBalance = async (wallet) => {
  try {
    let balanceData
    
    switch (wallet.blockchain) {
      case 'Bitcoin':
        balanceData = await fetchMockBitcoinBalance(wallet.address)
        break
      case 'Ethereum':
        balanceData = await fetchMockEthereumBalance(wallet.address)
        break
      case 'Solana':
        balanceData = await fetchMockSolanaBalance(wallet.address)
        break
      default:
        throw new Error(`Unsupported blockchain: ${wallet.blockchain}`)
    }
    
    return {
      ...wallet,
      ...balanceData,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    return {
      ...wallet,
      error: error.message,
      lastUpdated: new Date().toISOString()
    }
  }
} 