const API_KEY = "cqt_rQYP4Ht4X7jvVDrRmBXGGdCdFjXc";
const CHAIN_ID = 1;  // Ethereum mainnet

async function loadWalletData(address) {
  const display = document.getElementById("wallet-display");
  display.innerHTML = "Loading...";

  try {
    const response = await fetch(`https://api.covalenthq.com/v1/${CHAIN_ID}/address/${address}/balances_v2/?key=${API_KEY}`);
    const data = await response.json();

    if (!data.data || !data.data.items) {
      display.innerHTML = "No token data found.";
      return;
    }

    let html = "<h3>Wallet Balances:</h3><ul>";
    data.data.items.forEach((token) => {
      if (token.balance > 0 && token.contract_ticker_symbol) {
        const balance = (token.balance / 10 ** token.contract_decimals).toFixed(4);
        html += `<li>${token.contract_ticker_symbol}: ${balance}</li>`;
      }
    });
    html += "</ul>";
    display.innerHTML = html;
  } catch (error) {
    display.innerHTML = "Error fetching wallet data.";
    console.error(error);
  }
}
