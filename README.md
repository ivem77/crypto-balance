# Crypto Asset Monitor

A modern, responsive web application for monitoring cryptocurrency wallet balances across Bitcoin, Ethereum, and Solana blockchains using live blockchain APIs.

![Crypto Monitor](https://img.shields.io/badge/React-18.3.1-blue) ![Vite](https://img.shields.io/badge/Vite-6.3.5-purple) ![Chakra UI](https://img.shields.io/badge/Chakra%20UI-3.2.4-teal)

## ✨ Features

- **Multi-Blockchain Support**: Monitor Bitcoin, Ethereum, and Solana wallets
- **Automatic Address Detection**: Smart detection of blockchain type based on address format
- **Live Data**: Real-time balance fetching using public blockchain APIs
- **SPL Token Support**: View Solana SPL token holdings with detailed information
- **USD Conversion**: Real-time USD value calculation using CoinGecko API
- **Responsive Design**: Beautiful, mobile-first UI that works on all screen sizes
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Modern UI**: Glass morphism effects with smooth animations and transitions

## 🚀 Live APIs Used

- **Bitcoin**: Blockchair API for BTC balance queries
- **Ethereum**: Public Ethereum RPC for ETH balance queries
- **Solana**: Multiple RPC endpoints with fallback support for SOL and SPL tokens
- **Prices**: CoinGecko API for real-time cryptocurrency prices

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **UI Library**: Chakra UI v3
- **HTTP Client**: Axios
- **Styling**: CSS3 with Flexbox and Grid
- **Build Tool**: Vite with HMR support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crypto-monitor.git
   cd crypto-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🎯 Usage

1. **Add Wallet Addresses**
   - Enter any Bitcoin, Ethereum, or Solana wallet address
   - The app automatically detects the blockchain type
   - Click "Add Wallet" to add it to your monitoring list

2. **Fetch Balances**
   - Click "Fetch Balances" to get real-time data
   - View native token balances and USD values
   - For Solana wallets, see SPL token holdings

3. **Manage Wallets**
   - Remove wallets by clicking the "×" button
   - Add multiple wallets from different blockchains

## 📱 Supported Address Formats

- **Bitcoin**: 
  - Legacy (P2PKH): `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
  - Script (P2SH): `3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy`
  - Bech32 (P2WPKH/P2WSH): `bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4`

- **Ethereum**: 
  - Standard: `0x742d35Cc6634C0532925a3b8D4C9db96590c6C87`

- **Solana**: 
  - Base58: `DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK`

## 🔧 API Configuration

The app uses a Vite proxy configuration to handle CORS issues with external APIs. The proxy routes are configured in `vite.config.js`:

- `/api/blockchair/*` → Blockchair API
- `/api/ethereum/*` → Ethereum RPC
- `/api/solana/*` → Solana RPC endpoints
- `/api/coingecko/*` → CoinGecko API

## 🏗️ Project Structure

```
crypto-monitor/
├── src/
│   ├── api/
│   │   ├── blockchainApi.js    # Live API functions
│   │   └── mockApi.js          # Mock data for testing
│   ├── components/             # React components (future expansion)
│   ├── utils/                  # Utility functions (future expansion)
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── vite.config.js             # Vite configuration with API proxies
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🎨 Features in Detail

### Smart Address Detection
The app automatically identifies blockchain types using regex patterns:
- Bitcoin addresses (Legacy, SegWit, Bech32)
- Ethereum addresses (0x prefix, 40 hex characters)
- Solana addresses (Base58 encoding, 32-44 characters)

### SPL Token Support
For Solana wallets, the app fetches and displays:
- Native SOL balance
- All SPL token holdings
- Token symbols, names, and balances
- Proper decimal formatting for each token

### Responsive Design
- Mobile-first approach with breakpoint-specific styling
- Flexible layouts that adapt to screen sizes
- Touch-friendly interface elements
- Optimized typography and spacing

## 🚀 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Blockchair](https://blockchair.com/) for Bitcoin API
- [CoinGecko](https://coingecko.com/) for cryptocurrency prices
- [Chakra UI](https://chakra-ui.com/) for the beautiful component library
- [Vite](https://vitejs.dev/) for the fast build tool

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

**Made with ❤️ and React**
