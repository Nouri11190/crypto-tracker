const API_KEY = "cqt_rQYP4Ht4X7jvVDrRmBXGGdCdFjXc";
const CHAIN_ID = "1"; // Ethereum Mainnet

async function loadWalletData(walletAddress) {
  if (!walletAddress) {
    alert("Please enter a wallet address.");
    return;
  }

  const response = await fetch("tokens.json");
  const tokens = await response.json();

  let html = `<h3>Token Balances for ${walletAddress}</h3><ul>`;

  for (const token of tokens) {
    const url = `https://api.covalenthq.com/v1/${CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${API_KEY}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const tokenData = data.data.items.find(t => t.contract_address.toLowerCase() === token.address.toLowerCase());

      if (tokenData) {
        const balance = (parseFloat(tokenData.balance) / Math.pow(10, token.decimals)).toFixed(4);
        html += `<li><img src="${token.logo}" width="20"/> ${token.symbol}: ${balance}</li>`;
      } else {
        html += `<li><img src="${token.logo}" width="20"/> ${token.symbol}: 0.0000</li>`;
      }
    } catch (err) {
      html += `<li>Error fetching ${token.symbol} balance</li>`;
    }
  }

  html += "</ul>";
  document.getElementById("wallet-display").innerHTML = html;
}
