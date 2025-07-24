const API_KEY = "cqt_rQYP4Ht4X7jvVDrRmBXGGdCdFjXc";

const CHAINS = {
  ethereum: { id: "1", name: "Ethereum" },
  polygon: { id: "137", name: "Polygon" },
  arbitrum: { id: "42161", name: "Arbitrum" }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connect-btn").addEventListener("click", connectWallet);
  document.getElementById("chain-select").addEventListener("change", updateChain);
});

let currentWallet = "";
let currentChain = "ethereum";

function updateChain() {
  currentChain = document.getElementById("chain-select").value;
  if (currentWallet) {
    loadWalletData(currentWallet);
  }
}

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask not found. Please install it.");
    return;
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const wallet = accounts[0];
    currentWallet = wallet;
    document.getElementById("wallet-address").value = wallet;
    loadWalletData(wallet);
  } catch (err) {
    alert("MetaMask connection failed.");
  }
}

function manualLoad() {
  const addr = document.getElementById("wallet-address").value.trim();
  if (addr) {
    currentWallet = addr;
    loadWalletData(addr);
  }
}

async function loadWalletData(walletAddress) {
  const display = document.getElementById("wallet-display");
  const spinner = document.getElementById("spinner");

  spinner.style.display = "block";
  display.innerHTML = "";

  try {
    const tokenRes = await fetch(`./tokens/${currentChain}.json`);
    const tokens = await tokenRes.json();

    const chainID = CHAINS[currentChain].id;
    const covalentURL = `https://api.covalenthq.com/v1/${chainID}/address/${walletAddress}/balances_v2/?key=${API_KEY}`;

    const covalentRes = await fetch(covalentURL);
    const covalentData = await covalentRes.json();

    const items = covalentData.data.items;
    let balances = [];
    let totalUSD = 0;

    for (const token of tokens) {
      let tokenData;

      if (token.address === "native") {
        tokenData = items.find(t =>
          t.contract_ticker_symbol.toUpperCase() === token.symbol ||
          t.contract_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        );
      } else {
        tokenData = items.find(t =>
          t.contract_address.toLowerCase() === token.address.toLowerCase()
        );
      }

      const raw = tokenData
        ? parseFloat(tokenData.balance) / Math.pow(10, token.decimals)
        : 0;

      const price = tokenData?.quote_rate || 0;
      const usdValue = raw * price;
      totalUSD += usdValue;

      balances.push({
        symbol: token.symbol,
        logo: token.logo,
        amount: raw.toFixed(4),
        usd: usdValue.toFixed(2),
        price: price.toFixed(2)
      });
    }

    balances.sort((a, b) => parseFloat(b.usd) - parseFloat(a.usd));

    let html = `<h3>${CHAINS[currentChain].name} Portfolio: $${totalUSD.toFixed(2)}</h3>`;
    html += `<ul>`;
    for (const b of balances) {
      html += `
        <li>
          <img src="${b.logo}" width="20" onerror="this.src='fallback.png'" />
          ${b.symbol}: ${b.amount} × $${b.price} = <strong>$${b.usd}</strong>
        </li>`;
    }
    html += "</ul>";
    display.innerHTML = html;

  } catch (err) {
    console.error("Multichain error:", err);
    display.innerHTML = `<p style="color:red;">Error loading data for ${currentChain}.</p>`;
  } finally {
    spinner.style.display = "none";
  }
}
