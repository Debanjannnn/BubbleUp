require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Replace with your Telegram bot token
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Function to create a visual card
async function createVisualCard(data) {
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Clean white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Add subtle pattern
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }

    // Header with gradient
    const headerGradient = ctx.createLinearGradient(0, 0, width, 0);
    headerGradient.addColorStop(0, '#4CAF50');
    headerGradient.addColorStop(1, '#2196F3');
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, width, 80);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Token Analysis', 30, 50);

    // Chain and contract info
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.fillText(`Chain: ${data.chain.toUpperCase()}`, 30, 110);
    ctx.fillText(`Contract: ${data.tokenAddress.slice(0, 6)}...${data.tokenAddress.slice(-4)}`, 30, 130);

    // Market Data Section
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Market Data', 30, 180);
    
    // Market data box with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.fillRect(25, 190, 350, 160);
    ctx.strokeRect(25, 190, 350, 160);
    ctx.shadowBlur = 0;
    
    // Market data content
    ctx.fillStyle = '#333333';
    ctx.font = '16px Arial';
    const marketData = [
        { icon: '💰', label: 'Price', value: data.price },
        { icon: '💵', label: 'Market Cap', value: data.marketCap },
        { icon: '📊', label: '24h Volume', value: data.volume24h },
        { icon: '📈', label: '24h Change', value: data.priceChange24h }
    ];
    
    marketData.forEach((item, index) => {
        ctx.fillText(`${item.icon} ${item.label}:`, 40, 220 + (index * 35));
        ctx.fillStyle = '#4CAF50';
        ctx.fillText(item.value, 200, 220 + (index * 35));
        ctx.fillStyle = '#333333';
    });

    // Token Health Section
    ctx.fillStyle = '#2196F3';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Token Health', 30, 380);
    
    // Health data box with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.fillRect(25, 390, 350, 160);
    ctx.strokeRect(25, 390, 350, 160);
    ctx.shadowBlur = 0;
    
    // Health data content
    ctx.fillStyle = '#333333';
    ctx.font = '16px Arial';
    const healthData = [
        { icon: '🎯', label: 'Decentralization', value: `${data.decentralizationScore}/100` },
        { icon: '⚠️', label: 'Concentration Risk', value: data.concentrationRisk },
        { icon: '💧', label: 'Liquidity Score', value: data.liquidityScore }
    ];
    
    healthData.forEach((item, index) => {
        ctx.fillText(`${item.icon} ${item.label}:`, 40, 420 + (index * 35));
        ctx.fillStyle = '#2196F3';
        ctx.fillText(item.value, 200, 420 + (index * 35));
        ctx.fillStyle = '#333333';
    });

    // Additional Info Section
    ctx.fillStyle = '#FF9800';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Additional Info', 400, 180);
    
    // Additional info box with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.fillRect(395, 190, 380, 360);
    ctx.strokeRect(395, 190, 380, 360);
    ctx.shadowBlur = 0;
    
    // Additional info content
    ctx.fillStyle = '#333333';
    ctx.font = '16px Arial';
    const additionalInfo = [
        { icon: '👥', label: 'Total Holders', value: data.totalHolders },
        { icon: '📦', label: 'Total Supply', value: data.totalSupply },
        { icon: '🔄', label: 'Circulating Supply', value: data.circulatingSupply },
        { icon: '💎', label: 'Max Supply', value: data.maxSupply },
        { icon: '📊', label: 'Market Rank', value: data.marketRank },
        { icon: '🌐', label: 'Website', value: data.website || 'N/A' }
    ];
    
    additionalInfo.forEach((item, index) => {
        ctx.fillText(`${item.icon} ${item.label}:`, 410, 220 + (index * 35));
        ctx.fillStyle = '#FF9800';
        ctx.fillText(item.value, 550, 220 + (index * 35));
        ctx.fillStyle = '#333333';
    });

    // Add footer
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.fillText('Powered by Bubblemaps', width - 150, height - 20);

    // Save the image
    const imagePath = path.join(imagesDir, `${data.chain}_${data.tokenAddress}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);
    return imagePath;
}

// Function to check if a token is available on Bubblemaps
async function checkTokenAvailability(chain, tokenAddress) {
    try {
        const response = await axios.get(`https://api-legacy.bubblemaps.io/map-availability?chain=${chain}&token=${tokenAddress}`);
        return response.data.availability;
    } catch (error) {
        console.error('Error checking token availability:', error);
        return false;
    }
}

// Function to get token data
async function getTokenData(chain, tokenAddress) {
    try {
        const response = await axios.get(`https://api-legacy.bubblemaps.io/map-data?token=${tokenAddress}&chain=${chain}`);
        return response.data;
    } catch (error) {
        console.error('Error getting token data:', error);
        return null;
    }
}

// Function to get market data from CoinGecko
async function getMarketData(chain, tokenAddress) {
    try {
        // First try to get the token directly
        const directResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${chain}/contract/${tokenAddress}`);
        
        if (directResponse.data && directResponse.data.market_data) {
            return directResponse.data;
        }

        // If direct lookup fails, try to search for the token
        const searchResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${chain}/contract/${tokenAddress}`);
        if (!searchResponse.data || !searchResponse.data.id) {
            return null;
        }

        const coinId = searchResponse.data.id;
        const marketResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
        
        return marketResponse.data;
    } catch (error) {
        console.error('Error getting market data:', error);
        return null;
    }
}

// Function to calculate decentralization score
function calculateDecentralizationScore(tokenData) {
    if (!tokenData || !tokenData.nodes) return null;
    
    const topHolders = tokenData.nodes.slice(0, 10);
    const totalSupply = topHolders.reduce((sum, holder) => sum + holder.amount, 0);
    
    // Calculate Gini coefficient
    const holderPercentages = topHolders.map(holder => holder.amount / totalSupply);
    const n = holderPercentages.length;
    const mean = holderPercentages.reduce((a, b) => a + b, 0) / n;
    
    let gini = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            gini += Math.abs(holderPercentages[i] - holderPercentages[j]);
        }
    }
    gini = gini / (2 * n * n * mean);
    
    // Convert Gini coefficient to decentralization score (0-100)
    const decentralizationScore = Math.round((1 - gini) * 100);
    return decentralizationScore;
}

// Function to calculate risk metrics
function calculateRiskMetrics(tokenData, marketData) {
    if (!tokenData || !marketData) return null;
    
    const top10Holders = tokenData.nodes.slice(0, 10);
    const top10Percentage = top10Holders.reduce((sum, holder) => sum + holder.percentage, 0);
    const liquidityScore = marketData.market_data.total_volume.usd / marketData.market_data.market_cap.usd;
    
    return {
        concentrationRisk: top10Percentage > 50 ? 'High' : top10Percentage > 30 ? 'Medium' : 'Low',
        liquidityScore: liquidityScore > 0.1 ? 'High' : liquidityScore > 0.05 ? 'Medium' : 'Low',
        whaleRisk: top10Holders.some(h => h.percentage > 20) ? 'High' : 'Low'
    };
}

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
        'Welcome to the Bubblemaps Bot! 🚀\n\n' +
        'To analyze a token, send me its contract address in the following format:\n' +
        '/analyze <chain> <contract_address>\n\n' +
        'Example: /analyze eth 0x123...abc\n\n' +
        'Supported chains: eth, bsc, ftm, avax, cro, arbi, poly, base, sol, sonic'
    );
});

// Handle /analyze command
bot.onText(/\/analyze (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const chain = match[1].toLowerCase();
    const tokenAddress = match[2];
    
    // Show typing indicator
    bot.sendChatAction(chatId, 'typing');
    
    try {
        // Validate chain
        const supportedChains = ['eth', 'bsc', 'ftm', 'avax', 'cro', 'arbi', 'poly', 'base', 'sol', 'sonic'];
        if (!supportedChains.includes(chain)) {
            bot.sendMessage(chatId, 
                '❌ Unsupported chain. Please use one of the following:\n' +
                supportedChains.join(', ')
            );
            return;
        }

        // Validate token address format
        if (!tokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            bot.sendMessage(chatId, '❌ Invalid token address format. Please provide a valid contract address.');
            return;
        }
        
        // Check if token is available
        bot.sendMessage(chatId, '🔍 Checking token availability...');
        const isAvailable = await checkTokenAvailability(chain, tokenAddress);
        if (!isAvailable) {
            bot.sendMessage(chatId, 
                '❌ This token is not available on Bubblemaps or is not yet computed.\n\n' +
                'Please note that only publicly available tokens are supported. If you believe this token should be available, ' +
                'you can try again in a few minutes as the map might be computing.'
            );
            return;
        }
        
        // Get token data
        bot.sendMessage(chatId, '📊 Fetching token data...');
        const [tokenData, marketData] = await Promise.all([
            getTokenData(chain, tokenAddress),
            getMarketData(chain, tokenAddress)
        ]);
        
        if (!tokenData) {
            bot.sendMessage(chatId, '❌ Error fetching token data. Please try again later.');
            return;
        }
        
        // Calculate metrics
        const decentralizationScore = calculateDecentralizationScore(tokenData);
        const riskMetrics = calculateRiskMetrics(tokenData, marketData);
        
        // Prepare data for visual card with better error handling
        const cardData = {
            chain: chain,
            tokenAddress: tokenAddress,
            price: marketData?.market_data?.current_price?.usd ? 
                `$${marketData.market_data.current_price.usd.toFixed(6)}` : 'N/A',
            marketCap: marketData?.market_data?.market_cap?.usd ? 
                `$${(marketData.market_data.market_cap.usd / 1000000).toFixed(2)}M` : 'N/A',
            volume24h: marketData?.market_data?.total_volume?.usd ? 
                `$${(marketData.market_data.total_volume.usd / 1000000).toFixed(2)}M` : 'N/A',
            priceChange24h: marketData?.market_data?.price_change_percentage_24h ? 
                `${marketData.market_data.price_change_percentage_24h.toFixed(2)}%` : 'N/A',
            decentralizationScore: decentralizationScore || 0,
            concentrationRisk: riskMetrics?.concentrationRisk || 'N/A',
            liquidityScore: riskMetrics?.liquidityScore || 'N/A',
            totalHolders: tokenData.nodes.length.toLocaleString(),
            totalSupply: tokenData.nodes.reduce((sum, holder) => sum + holder.amount, 0).toLocaleString(),
            circulatingSupply: tokenData.nodes.reduce((sum, holder) => sum + holder.amount, 0).toLocaleString(),
            maxSupply: tokenData.nodes.reduce((sum, holder) => sum + holder.amount, 0).toLocaleString(),
            marketRank: tokenData.nodes.length.toLocaleString(),
            website: tokenData.nodes[0].website || 'N/A'
        };
        
        // Create visual card
        const imagePath = await createVisualCard(cardData);
        
        // Prepare concise message
        const message = `<b>Token Analysis</b>\n\n` +
            `<b>🔗 View on Bubblemaps:</b>\n` +
            `https://app.bubblemaps.io/${chain}/token/${tokenAddress}\n\n` +
            `<b>👥 Top Holder:</b>\n` +
            `${tokenData.nodes[0].address.slice(0, 6)}...${tokenData.nodes[0].address.slice(-4)}: ${tokenData.nodes[0].percentage.toFixed(2)}%\n\n` +
            `<b>📊 Total Holders:</b> ${tokenData.nodes.length.toLocaleString()}`;
        
        // Send visual card with concise message
        await bot.sendPhoto(chatId, imagePath, { caption: message, parse_mode: 'HTML' });
        
        // Clean up
        fs.unlinkSync(imagePath);
        
    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, 
            '❌ An error occurred while processing your request.\n\n' +
            'Error details: ' + error.message + '\n\n' +
            'Please try again later or contact support if the problem persists.'
        );
    }
});

// Handle invalid commands
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text.startsWith('/')) {
        bot.sendMessage(chatId, 
            'Please use the /analyze command to analyze a token.\n\n' +
            'Format: /analyze <chain> <contract_address>\n' +
            'Example: /analyze eth 0x123...abc'
        );
    }
});

console.log('Bot is running...'); 