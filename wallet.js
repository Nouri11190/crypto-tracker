const API_KEY = "cqt_rQYP4Ht4X7jvVDrRmBXGGdCdFjXc";
const CHAINS = {
  ethereum: 1,
  polygon: 137,
  bsc: 56,
  arb: 42161,
  base: 8453,
  optimism: 10
};

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      loadAllChains(accounts[0]);
    } catch (err) {
      alert("MetaMask connection rejected.");
    }
  } else {
    alert("MetaMask not found. Please install it or use mobile with WalletConnect.");
  }
}

async function manualLoad() {
  const addr = document.getElementById("wallet-address").value.trim();
  if (addr) loadAllChains(addr);
}

async function loadAllChains(walletAddress) {
  document.getElementById("wallet-address").value = walletAddress;
  const spinner = document.getElementById("spinner");
  const dash = document.getElementById("dashboard");
  spinner.style.display = "block";
  dash.innerHTML = "";

  let overall = 0;

  for (const [chainKey, chainId] of Object.entries(CHAINS)) {
    const tokenList = await fetch(`tokens/${chainKey}.json`).then(r => r.json()).catch(e => []);
    const resp = await fetch(`https://api.covalenthq.com/v1/${chainId}/address/${walletAddress}/balances_v2/?key=${API_KEY}`);
    const data = await resp.json().then(r => r.data.items).catch(() => []);

    let totalChain = 0;
    let rows = [];

    for (const t of tokenList) {
      const rec = data.find(it => 
        t.address === "native"
          ? (it.contract_ticker_symbol.toUpperCase() === t.symbol || it.contract_address.startsWith("0xeeee"))
          : it.contract_address.toLowerCase() === t.address.toLowerCase()
      );
      if (!rec) continue;
      const bal = parseFloat(rec.balance) / Math.pow(10, t.decimals);
      const usd = rec.quote || 0;
      if (bal <= 0) continue;
      totalChain += usd;
      rows.push({ symbol: t.symbol, logo: t.logo, amount: bal.toFixed(4), price: (rec.quote_rate || 0).toFixed(2), usd: usd.toFixed(2) });
    }

    overall += totalChain;

    dash.innerHTML += `
      <div style="margin-bottom:20px">
        <h3>${chainKey.toUpperCase()}: $${totalChain.toFixed(2)}</h3>
        <ul style="list-style:none;padding:0">
          ${rows.map(r => `<li><img src="${r.logo}" width="20" onerror="this.src='fallback.png'"/> ${r.symbol}: ${r.amount} × $${r.price} = <strong>$${r.usd}</strong></li>`).join("")}
        </ul>
      </div>`;
  }

  dash.insertAdjacentHTML("afterbegin", `<h2>Total Net Worth: $${overall.toFixed(2)}</h2>`);
  spinner.style.display = "none";
}
