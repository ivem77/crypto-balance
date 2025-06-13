import { useState } from 'react'
import { Box, Heading, VStack, Input, Button, Text, HStack, Badge, Spinner, Alert } from '@chakra-ui/react'
import { fetchWalletBalance, fetchCryptoPrices } from './api/blockchainApi'

function App() {
  const [address, setAddress] = useState('')
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Function to detect blockchain type based on address format
  const detectBlockchain = (addr) => {
    if (!addr) return 'Unknown'
    
    // Bitcoin: starts with 1, 3, or bc1
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr) || /^bc1[a-z0-9]{39,59}$/.test(addr)) {
      return 'Bitcoin'
    }
    
    // Ethereum: starts with 0x and is 42 characters long
    if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      return 'Ethereum'
    }
    
    // Solana: base58 encoded, typically 32-44 characters
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)) {
      return 'Solana'
    }
    
    return 'Unknown'
  }

  const handleAddWallet = () => {
    if (!address.trim()) return
    
    const blockchain = detectBlockchain(address.trim())
    if (blockchain === 'Unknown') {
      setError('Invalid wallet address format')
      return
    }
    
    const newWallet = {
      id: Date.now(),
      address: address.trim(),
      blockchain
    }
    
    setWallets([...wallets, newWallet])
    setAddress('')
    setError('')
  }

  const handleRemoveWallet = (id) => {
    setWallets(wallets.filter(wallet => wallet.id !== id))
  }

  const handleFetchBalances = async () => {
    if (wallets.length === 0) return
    
    setLoading(true)
    setError('')
    
    try {
      console.log('Starting to fetch balances for', wallets.length, 'wallets')
      
      // Fetch crypto prices first
      const prices = await fetchCryptoPrices()
      console.log('Fetched prices:', prices)
      
      // Fetch balances for all wallets
      const balancePromises = wallets.map(wallet => fetchWalletBalance(wallet))
      const results = await Promise.all(balancePromises)
      console.log('Fetched balances:', results)
      
      // Calculate USD values
      const walletsWithUsd = results.map(wallet => {
        if (wallet.error) return wallet
        
        let usdPrice = 0
        switch (wallet.blockchain) {
          case 'Bitcoin':
            usdPrice = prices.bitcoin
            break
          case 'Ethereum':
            usdPrice = prices.ethereum
            break
          case 'Solana':
            usdPrice = prices.solana
            break
        }
        
        return {
          ...wallet,
          balanceUsd: wallet.balance * usdPrice,
          pricePerUnit: usdPrice
        }
      })
      
      setWallets(walletsWithUsd)
    } catch (err) {
      console.error('Error fetching balances:', err)
      setError(`Failed to fetch balances: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatBalance = (balance, symbol) => {
    if (typeof balance !== 'number') return 'N/A'
    return `${balance.toFixed(8)} ${symbol}`
  }

  const formatUsd = (usdValue) => {
    if (typeof usdValue !== 'number') return 'N/A'
    return `$${usdValue.toFixed(2)}`
  }

  const getSymbol = (blockchain) => {
    switch (blockchain) {
      case 'Bitcoin': return 'BTC'
      case 'Ethereum': return 'ETH'
      case 'Solana': return 'SOL'
      default: return ''
    }
  }

  const formatTokenBalance = (balance, decimals = 6) => {
    if (typeof balance !== 'number') return 'N/A'
    return balance.toFixed(decimals)
  }

  return (
    <Box 
      minH="100vh" 
      bg={{
        base: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        _dark: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 4, md: 6 }}
    >
      <Box
        w="full"
        maxW="2xl"
        bg={{ base: 'white', _dark: 'gray.800' }} 
        p={{ base: 6, md: 8 }} 
        borderRadius="xl" 
        boxShadow="2xl"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
      >
        <VStack spacing={8}>
          <VStack spacing={4} textAlign="center">
            <Heading 
              as="h1" 
              size={{ base: 'lg', md: 'xl' }}
              color={{ base: 'gray.800', _dark: 'white' }}
              fontWeight="bold"
            >
              Crypto Asset Monitor
            </Heading>
            
            <Text 
              fontSize={{ base: 'sm', md: 'md' }}
              color={{ base: 'green.600', _dark: 'green.400' }}
              fontWeight="medium"
            >
              🌐 Using live blockchain APIs
            </Text>
          </VStack>
          
          {error && (
            <Alert 
              status="error" 
              borderRadius="lg"
              bg={{ base: 'red.50', _dark: 'red.900' }}
              border="1px solid"
              borderColor={{ base: 'red.200', _dark: 'red.700' }}
            >
              ⚠️ {error}
            </Alert>
          )}
          
          <Box w="full">
            <Box mb={3} fontSize="sm" fontWeight="semibold" color={{ base: 'gray.700', _dark: 'gray.300' }}>
              Wallet Address
            </Box>
            <VStack spacing={3}>
              <Input 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                placeholder="Enter BTC, ETH, or SOL address" 
                onKeyPress={e => e.key === 'Enter' && handleAddWallet()}
                size={{ base: 'md', md: 'lg' }}
                bg={{ base: 'white', _dark: 'gray.700' }}
                borderColor={{ base: 'gray.300', _dark: 'gray.600' }}
                color={{ base: 'gray.800', _dark: 'white' }}
                _placeholder={{ color: { base: 'gray.500', _dark: 'gray.400' } }}
                _focus={{ 
                  borderColor: { base: 'blue.500', _dark: 'blue.300' },
                  boxShadow: { base: '0 0 0 3px rgba(66, 153, 225, 0.1)', _dark: '0 0 0 3px rgba(144, 205, 244, 0.1)' }
                }}
                borderRadius="lg"
              />
              <Button 
                onClick={handleAddWallet} 
                colorScheme="blue"
                size={{ base: 'md', md: 'lg' }}
                w={{ base: 'full', sm: 'auto' }}
                borderRadius="lg"
                fontWeight="semibold"
              >
                Add Wallet
              </Button>
            </VStack>
          </Box>

          {wallets.length > 0 && (
            <Box w="full">
              <Text 
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight="semibold" 
                mb={4} 
                color={{ base: 'gray.700', _dark: 'gray.300' }}
              >
                Added Wallets ({wallets.length}):
              </Text>
              <VStack spacing={4} align="stretch">
                {wallets.map(wallet => (
                  <Box 
                    key={wallet.id} 
                    p={{ base: 4, md: 5 }}
                    bg={{ base: 'gray.50', _dark: 'gray.700' }} 
                    borderRadius="xl" 
                    border="1px solid"
                    borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      borderColor: { base: 'gray.300', _dark: 'gray.500' }
                    }}
                  >
                    <HStack justify="space-between" mb={3}>
                      <HStack spacing={2} flexWrap="wrap">
                        <Badge 
                          colorScheme={
                            wallet.blockchain === 'Bitcoin' ? 'orange' :
                            wallet.blockchain === 'Ethereum' ? 'blue' :
                            wallet.blockchain === 'Solana' ? 'purple' : 'gray'
                          }
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {wallet.blockchain}
                        </Badge>
                        {wallet.error && (
                          <Badge colorScheme="red" fontSize="xs" px={2} py={1} borderRadius="md">
                            Error
                          </Badge>
                        )}
                        {wallet.tokenCount > 0 && (
                          <Badge colorScheme="green" fontSize="xs" px={2} py={1} borderRadius="md">
                            +{wallet.tokenCount} tokens
                          </Badge>
                        )}
                      </HStack>
                      <Button 
                        size="sm" 
                        colorScheme="red" 
                        variant="ghost" 
                        onClick={() => handleRemoveWallet(wallet.id)}
                        color={{ base: 'red.500', _dark: 'red.300' }}
                        _hover={{ bg: { base: 'red.50', _dark: 'red.900' } }}
                        borderRadius="lg"
                      >
                        ×
                      </Button>
                    </HStack>
                    
                    <Text 
                      fontSize="xs" 
                      color={{ base: 'gray.600', _dark: 'gray.400' }} 
                      wordBreak="break-all"
                      mb={3}
                      fontFamily="mono"
                      bg={{ base: 'gray.100', _dark: 'gray.800' }}
                      p={2}
                      borderRadius="md"
                    >
                      {wallet.address}
                    </Text>
                    
                    {wallet.balance !== undefined && !wallet.error && (
                      <VStack align="start" spacing={3}>
                        {/* Main balance */}
                        <HStack justify="space-between" w="full">
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color={{ base: 'gray.800', _dark: 'white' }}>
                            {formatBalance(wallet.balance, getSymbol(wallet.blockchain))}
                          </Text>
                          <Text fontSize={{ base: 'sm', md: 'md' }} color={{ base: 'green.600', _dark: 'green.400' }} fontWeight="semibold">
                            {formatUsd(wallet.balanceUsd)}
                          </Text>
                        </HStack>
                        
                        {/* SPL Tokens for Solana wallets */}
                        {wallet.blockchain === 'Solana' && wallet.splTokens && wallet.splTokens.length > 0 && (
                          <Box w="full" mt={2}>
                            <Text fontSize="xs" fontWeight="semibold" color={{ base: 'gray.700', _dark: 'gray.300' }} mb={2}>
                              SPL Tokens:
                            </Text>
                            <VStack spacing={2} align="stretch">
                              {wallet.splTokens.map((token, index) => (
                                <HStack 
                                  key={index} 
                                  justify="space-between" 
                                  fontSize="xs"
                                  p={2}
                                  bg={{ base: 'white', _dark: 'gray.800' }}
                                  borderRadius="md"
                                  border="1px solid"
                                  borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
                                >
                                  <HStack>
                                    <Badge size="sm" colorScheme="cyan" borderRadius="md">
                                      {token.symbol}
                                    </Badge>
                                    <Text color={{ base: 'gray.600', _dark: 'gray.400' }}>
                                      {token.name}
                                    </Text>
                                  </HStack>
                                  <Text color={{ base: 'gray.800', _dark: 'white' }} fontWeight="semibold">
                                    {formatTokenBalance(token.balance, Math.min(token.decimals, 4))}
                                  </Text>
                                </HStack>
                              ))}
                            </VStack>
                          </Box>
                        )}
                        
                        {wallet.note && (
                          <Text fontSize="xs" color={{ base: 'blue.600', _dark: 'blue.400' }} fontStyle="italic">
                            {wallet.note}
                          </Text>
                        )}
                      </VStack>
                    )}
                    
                    {wallet.error && (
                      <Text fontSize="sm" color={{ base: 'red.600', _dark: 'red.400' }} fontWeight="medium">
                        {wallet.error}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          {wallets.length > 0 && (
            <Button 
              colorScheme="teal" 
              size={{ base: 'md', md: 'lg' }}
              w="full" 
              onClick={handleFetchBalances}
              isLoading={loading}
              loadingText="Fetching Balances..."
              leftIcon={loading ? <Spinner size="sm" /> : undefined}
              borderRadius="lg"
              fontWeight="semibold"
              py={{ base: 6, md: 7 }}
            >
              {loading ? 'Fetching...' : `Fetch Balances (${wallets.length} wallet${wallets.length !== 1 ? 's' : ''})`}
            </Button>
          )}
        </VStack>
      </Box>
    </Box>
  )
}

export default App
