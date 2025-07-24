# 💰 Famzzy Crypto Tracker

A mobile-optimized decentralized app (DApp) built to track crypto wallet balances, prices, and token activity using data from:
- **CoinMarketCap DEX APIs**
- **Binance**
- **DEXTools**
- Supports ENS integration and wallet connection (WIP)

## 🌐 Live Demo

🔗 [Visit Live Site](https://yourusername.github.io/crypto-tracker/)  
_(replace `yourusername` with your actual GitHub username)_

## 📦 Included Tokens

| Symbol | Network | Description        |
|--------|---------|--------------------|
| WETH   | Ethereum | Wrapped ETH        |
| aUSDT  | Aave     | Aave USDT Token    |
| CCBTC  | Custom   | Custom Bitcoin     |
| sllen.eth | ENS | Your ENS Identity  |

More tokens can be added dynamically via `tokens.json`.

## 📁 Project Structure

```bash
.
├── index.html      # Main landing page
├── styles.css      # Stylesheet
├── tokens.json     # Token metadata
├── wallet.js       # Wallet & ENS logic
└── tracker.js      # Token data logic (CMC, DEX)
```

## 🔧 Customization

You can:
- Add tokens in `tokens.json`
- Add ENS support and Web3 wallet features in `wallet.js`
- Fetch live token prices in `tracker.js`

## 🛠 Roadmap

- [ ] Wallet balance reader (Metamask, WalletConnect)
- [ ] Token send/receive interface
- [ ] IPFS deployment (via Fleek)
- [ ] Link with `sllen.eth`

## ✍️ Author

Built with ❤️ by [Famzzy](https://famzzypham.kit.com)

---

_This is part of a larger DApp project. More features incoming!_