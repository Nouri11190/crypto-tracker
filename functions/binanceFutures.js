// functions/binanceFutures.js
import fetch from "node-fetch";

export async function handler(event, context) {
  // Replace with your actual Binance API Key and Secret
  const apiKey = "YOUR_API_KEY";
  const secretKey = "YOUR_SECRET_KEY";

  // Example: Fetching a simple futures orderbook snapshot for BTCUSDT
  const symbol = "BTCUSDT";
  const limit = 5;

  try {
    const res = await fetch(`https://fapi.binance.com/fapi/v1/depth?symbol=${symbol}&limit=${limit}`, {
      headers: { "X-MBX-APIKEY": apiKey }
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: "Failed to fetch data" })
      };
    }

    const data = await res.json();
    // Flatten bids/asks into simple objects
    const formatted = [
      ...data.bids.map(([price, qty]) => ({ side: "bid", price, qty })),
      ...data.asks.map(([price, qty]) => ({ side: "ask", price, qty })),
    ];

    return {
      statusCode: 200,
      body: JSON.stringify({ data: formatted })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}