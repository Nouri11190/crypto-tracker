const API_KEY = "cqt_rQYP4Ht4X7jvVDrRmBXGGdCdFjXc";
const CHAIN_ID = "1"; // Ethereum Mainnet

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('connect-btn').addEventListener('click', connectWallet);
});

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask not found. Please install MetaMask extension.");
    return;
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    document.getElementById('wallet-address').value = walletAddress;
    loadWalletData(walletAddress);
  } catch (err) {
    console.error("Wallet connect error:", err);
    alert("Failed to connect to MetaMask.");
  }
}

function manualLoad() {
  const addr = document.getElementById('wallet-address').value.trim();
  if (addr) loadWalletData(addr);
}

async function loadWalletData(walletAddress) {
  const spinner = document.getElementById('spinner');
  const display = document.getElementById('wallet-display');

  spinner.style.display = 'block';
  display.innerHTML = '';

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
    let balances = [];

    for (const token of tokens) {
      let tokenData;

      if (token.address.toLowerCase() === "native") {
        // Match ETH either by address or symbol
        tokenData = items.find(t =>
          t.contract_ticker_symbol === "ETH" ||
          t.contract_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        );
      } else {
        tokenData = items.find(t =>
          t.contract_address.toLowerCase() === token.address.toLowerCase()
        );
      }

      const balance = tokenData
        ? (parseFloat(tokenData.balance) / Math.pow(10, token.decimals))
        : 0;

      balances.push({
        symbol: token.symbol,
        logo: token.logo,
        value: balance.toFixed(4)
      });
    }

    // Sort by token value descending
    balances.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

    let html = `<h3>Token Balances for ${walletAddress}</h3><ul>`;
    for (const b of balances) {
      html += `
        <li>
          <img src="${b.logo}" width="20" onerror="this.src='fallback.png'" />
          ${b.symbol}: ${b.value}
        </li>`;
    }
    html += "</ul>";
    display.innerHTML = html;

  } catch (error) {
    console.error("Error loading wallet data:", error);
    display.innerHTML = `<p style="color:red;">Failed to load wallet data.</p>`;
  } finally {
    spinner.style.display = 'none';
  }
}
