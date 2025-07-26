async function fetchCMCTrending() {
  const apiKey = '95aa6637-49bc-49ec-8d0e-eedc94be599d';
  const headers = {
    'X-CMC_PRO_API_KEY': apiKey,
    Accept: 'application/json'
  };

  try {
    // Step 1: Fetch trending coins
    const trendRes = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/latest', { headers });
    const trendData = await trendRes.json();
    const trendingCoins = trendData.data.slice(0, 10); // Top 10

    // Step 2: Get prices for trending coins
    const ids = trendingCoins.map(c => c.id).join(',');
    const quoteRes = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${ids}`, { headers });
    const quoteData = await quoteRes.json();

    // Step 3: Display in table
    const tbody = document.querySelector('#cmc-table tbody');
    tbody.innerHTML = '';

    trendingCoins.forEach((coin, i) => {
      const quote = quoteData.data[coin.id].quote.USD;
      const row = `
        <tr>
          <td>${i + 1}</td>
          <td>${coin.symbol}</td>
          <td>${coin.name}</td>
          <td>$${quote.price.toFixed(3)}</td>
          <td style="color:${quote.percent_change_24h >= 0 ? 'limegreen' : 'tomato'}">
            ${quote.percent_change_24h.toFixed(2)}%
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML('beforeend', row);
    });
  } catch (err) {
    console.error('CMC API Error:', err);
    document.querySelector('#cmc-trending').innerHTML = '⚠️ Unable to load CMC trending coins.';
  }
}

// Auto-run on page load
fetchCMCTrending();
