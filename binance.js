async function loadBinanceData() {
  const container = document.getElementById("binance-data");
  container.innerHTML = "<h2>Binance Top Gainers (24h)</h2><p>Loading...</p>";

  const proxyUrl = "https://corsproxy.io/?";  // Free CORS proxy for GitHub Pages
  const binanceUrl = "https://api.binance.com/api/v3/ticker/24hr";

  try {
    const response = await fetch(proxyUrl + binanceUrl);
    const data = await response.json();

    const topGainers = data
      .filter(item => item.symbol.endsWith("USDT"))
      .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
      .slice(0, 5);

    container.innerHTML = `
      <h2>Binance Top Gainers (24h)</h2>
      <ul style="list-style:none; padding-left:0;">
        ${topGainers.map(item => `
          <li style="margin-bottom: 8px;">
            <strong>${item.symbol}</strong>: 
            +${parseFloat(item.priceChangePercent).toFixed(2)}% 
            (${parseFloat(item.lastPrice).toFixed(4)} USDT)
          </li>`).join('')}
      </ul>
    `;
  } catch (err) {
    container.innerHTML = "<p>❌ Failed to load Binance data.</p>";
    console.error("Binance error:", err);
  }
}

window.addEventListener("load", loadBinanceData);
