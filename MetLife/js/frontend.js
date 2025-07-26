// No need to change this if redirect is configured
fetch("/api/getCMCTrending")
  .then(res => res.json())
  .then(data => {
    console.log("CMC Trending Coins:", data);
  });

fetch("/api/getBinanceList")
  .then(res => res.json())
  .then(data => {
    console.log("Binance Market Data:", data);
  });
