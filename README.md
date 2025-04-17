# BubbleUP

A powerful Telegram bot that provides comprehensive token analysis using data from Bubblemaps and CoinGecko. This bot helps users analyze tokens across multiple chains, providing detailed market data, token health metrics, and risk assessments.

## 🌟 Features

- **Multi-Chain Support**: Analyze tokens across multiple chains (ETH, BSC, FTM, AVAX, CRO, ARBI, POLY, BASE, SOL, SONIC)
- **Comprehensive Analysis**: Get detailed token information including:
  - Market data (price, market cap, volume)
  - Token health metrics
  - Decentralization scores
  - Risk assessments
  - Holder information
- **Visual Data Presentation**: Beautiful visual cards with organized information
- **Real-time Data**: Fetch latest market data from CoinGecko
- **Risk Assessment**: Calculate concentration risk and liquidity scores
- **User-friendly Interface**: Simple commands and clear output

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bubblemaps-bot.git
cd bubblemaps-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

4. Start the bot:
```bash
node index.js
```

## 📋 Usage

### Basic Commands

- `/start` - Get started with the bot
- `/help` - View available commands
- `/analyze <chain> <contract_address>` - Analyze a token

### Example

To analyze a token on Ethereum:
```
/analyze eth 0x123...abc
```

### Supported Chains

| Chain | Description |
|-------|-------------|
| eth   | Ethereum    |
| bsc   | Binance Smart Chain |
| ftm   | Fantom      |
| avax  | Avalanche   |
| cro   | Cronos      |
| arbi  | Arbitrum    |
| poly  | Polygon     |
| base  | Base        |
| sol   | Solana      |
| sonic | Sonic       |

## 📊 Analysis Output

The bot provides a comprehensive analysis including:

### Market Data
- Current price
- Market capitalization
- 24-hour trading volume
- Price change percentage

### Token Health
- Decentralization score (0-100)
- Concentration risk assessment
- Liquidity score

### Additional Information
- Total holders count
- Supply metrics
- Market rank
- Project website

## 🔧 Technical Details

### Dependencies

- `node-telegram-bot-api`: Telegram bot interface
- `axios`: HTTP client for API requests
- `canvas`: Image generation for visual cards
- `dotenv`: Environment variable management

### API Integration

- **Bubblemaps API**: Token analysis and holder data
- **CoinGecko API**: Market data and price information

## 🛠️ Development

### Project Structure

```
bubblemaps-bot/
├── index.js          # Main bot file
├── package.json      # Project dependencies
├── .env              # Environment variables
└── images/           # Generated visual cards
```

### Adding New Features

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please:
1. Check the [documentation](docs/)
2. Open an issue on GitHub
3. Contact the maintainers

## 🔗 Links

- [Bubblemaps Website](https://bubblemaps.io)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🙏 Acknowledgments

- Bubblemaps for providing token analysis data
- CoinGecko for market data
- Telegram for the bot platform
