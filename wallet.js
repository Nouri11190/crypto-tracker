const API_KEY = "cqt_rQYP4Ht4X7jvVDrRmBXGGdCdFjXc";
const CHAIN_ID = "1"; // Ethereum Mainnet

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('connect-btn').addEventListener('click', connectWallet);
});

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask not found. Please install it.");
    return;
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    document.getElementById('wallet-address').value = walletAddress;
    loadWalletData(walletAddress);
  } catch (err) {
    console.error("Wallet connect error:", err);
    alert("Failed to connect MetaMask");
  }
}

function manualLoad() {
  const addr = document.getElementById('wallet-address').value.trim();
  if (addr) loadWalletData(addr);
}

async function loadWalletData(walletAddress) {
  try {
    const [tokenRes, covalentRes] = await Promise.all([
      fetch('./tokens.json'),
      fetch(`https://api.covalenthq.com/v1/${CHAIN_ID}/address/${walletAddress}/balances_v2/?key=${API_KEY}`)
    ]);

    const tokens = await tokenRes.json();
    const covalentData = await covalentRes.json();

    if (!covalentData || !covalentData.data || !covalentData.data.items) {
      throw new Error("Invalid response from Covalent.");
    }

    const items = covalentData.data.items;
    let html = `<h3>Token Balances for ${walletAddress}</h3><ul>`;

    for (const token of tokens) {
      let tokenData;

      if (token.address.toLowerCase() === "native") {
        tokenData = items.find(t => t.contract_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      } else {
        tokenData = items.find(t => t.contract_address.toLowerCase() === token.address.toLowerCase());
      }

      if (tokenData) {
        const balance = (parseFloat(tokenData.balance) / Math.pow(10, token.decimals)).toFixed(4);
        html += `<li><img src="${token.logo}" width="20" onerror="this.src='fallback.png'" /> ${token.symbol}: ${balance}</li>`;
      } else {
        html += `<li><img src="${token.logo}" width="20" onerror="this.src='fallback.png'" /> ${token.symbol}: 0.0000</li>`;
      }
    }

    html += "</ul>";
    document.getElementById("wallet-display").innerHTML = html;

  } catch (error) {
    console.error("Error loading wallet data:", error);
    document.getElementById("wallet-display").innerHTML = `<p style="color:red;">Failed to load wallet data.</p>`;
  }
}
