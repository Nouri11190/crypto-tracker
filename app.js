const tokenList = {
    WETH: 'weth',
    aUSDT: 'tether',
    CBBTC: 'bitcoin',
};

async function fetchPrices() {
    for (let [symbol, id] of Object.entries(tokenList)) {
        try {
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
            const data = await res.json();
            const price = data[id].usd;
            document.querySelector(`#${symbol} span`).textContent = `$${price}`;
        } catch (e) {
            document.querySelector(`#${symbol} span`).textContent = `Error`;
        }
    }
}

fetchPrices();
