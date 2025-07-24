const API_KEY = "cqt_rQYP4Ht4X7jvVDrRmBXGGdCdFjXc";

const CHAINS = {
  ethereum: { id: "1", name: "Ethereum" },
  polygon: { id: "137", name: "Polygon" },
  arbitrum: { id: "42161", name: "Arbitrum" },
  base: { id: "8453", name: "Base" },
  optimism: { id: "10", name: "Optimism" },
  bsc: { id: "56", name: "Binance Smart Chain" }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connect-btn").addEventListener("click", connectWallet);
});

let currentWallet = "";

async function connectWallet() {
  if (window.ethereum === undefined) {
    return alert("MetaMask not installed.");
  }
  try {
    const [wallet] = await ethereum.request({ method: 'eth_requestAccounts' });
    currentWallet = wallet;
    document.getElementById("wallet-address").value = wallet;
    loadAllChains(wallet);
  } catch {
    alert("MetaMask connect failed.");
  }
}

function manualLoad() {
  const addr = document.getElementById("wallet-address").value.trim();
  if (addr) loadAllChains(addr);
}

async function loadAllChains(wallet) {
  const spinner = document.getElementById("spinner");
  const dash = document.getElementById("dashboard");
  spinner.style.display = "block";
  dash.innerHTML = "";

  let overallTotal = 0;

  for (const key of Object.keys(CHAINS)) {
    const chain = CHAINS[key];
    const tokenFile = `./tokens/${key}.json`;

    try {
      const [tokenRes, dataRes] = await Promise.all([
        fetch(tokenFile),
        fetch(`https://api.covalenthq.com/v1/${chain.id}/address/${wallet}/balances_v2/?key=${API_KEY}`)
      ]);
      const tokens = await tokenRes.json();
      const data = await dataRes.json().then(res => res.data.items || []);
      
      let totalUSD = 0;
      let list = [];

      for (const t of tokens) {
        const record = data.find(it =>
          t.address === "native"
            ? (it.contract_ticker_symbol.toUpperCase() === t.symbol || it.contract_address.startsWith("0xeeee"))
            : it.contract_address.toLowerCase() === t.address.toLowerCase()
        );
        const amount = record ? parseFloat(record.balance) / (10 ** t.decimals) : 0;
        const usd = amount * (record?.quote_rate || 0);
        totalUSD += usd;
        if (amount > 0) {
          list.push({
            symbol: t.symbol,
            logo: t.logo,
            amount: amount.toFixed(4),
            price: (record?.quote_rate || 0).toFixed(2),
            usd: usd.toFixed(2)
          });
        }
      }

      overallTotal += totalUSD;

      dash.innerHTML += `
        <div class="chain-section">
          <h3>${chain.name} — $${totalUSD.toFixed(2)}</h3>
          <ul>
            ${list.map(b => `
              <li><img src="${b.logo}" width="20" onerror="this.src='fallback.png'"/> 
                ${b.symbol}: ${b.amount} × $${b.price} = <strong>$${b.usd}</strong>
              </li>`).join("")}
          </ul>
        </div>`;
    } catch (e) {
      dash.innerHTML += `<p style="color:red;">Failed to load ${chain.name}</p>`;
      console.error(chain.name, e);
    }
  }

  dash.innerHTML = `<h2>Total across chains: $${overallTotal.toFixed(2)}</h2>` + dash.innerHTML;
  spinner.style.display = "none";
}
