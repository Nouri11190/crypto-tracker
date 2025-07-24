const API_KEY = "cqt_rQYP4Ht4X7jvVDrRmBXGGdCdFjXc";
let provider;

const CHAIN_NAMES = {
  1: "Ethereum",
  56: "BSC",
  137: "Polygon",
  10: "Optimism",
  42161: "Arbitrum",
  8453: "Base"
};

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const wallet = accounts[0];
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      document.getElementById("wallet-address").value = wallet;
      loadWalletData(wallet, parseInt(chainId, 16));
      return;
    } catch (err) {
      alert("MetaMask connection failed.");
      return;
    }
  }

  // Mobile fallback using WalletConnect
  provider = new WalletConnectProvider.default({
    rpc: {
      1: "https://eth.llamarpc.com",
      56: "https://bsc-dataseed.binance.org",
      137: "https://polygon-rpc.com",
      10: "https://mainnet.optimism.io",
      42161: "https://arb1.arbitrum.io/rpc",
      8453: "https://mainnet.base.org"
    }
  });

  await provider.enable();
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const wallet = accounts[0];
  const chainId = await web3.eth.getChainId();
  document.getElementById("wallet-address").value = wallet;
  loadWalletData(wallet, chainId);
}

function manualLoad() {
  const addr = document.getElementById('wallet-address').value.trim();
  if (!addr) return;
  if (typeof window.ethereum !== "undefined") {
    ethereum.request({ method: 'eth_chainId' }).then(chainIdHex => {
      const chainId = parseInt(chainIdHex, 16);
      loadWalletData(addr, chainId);
    });
  } else if (provider) {
    const web3 = new Web3(provider);
    web3.eth.getChainId().then(chainId => {
      loadWalletData(addr, chainId);
    });
  } else {
    alert("Please connect a wallet first.");
  }
}

async function loadWalletData(walletAddress, chainId) {
  const display = document.getElementById("wallet-display");
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";
  display.innerHTML = "";

  const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`;
  const tokenFile = `tokens/${chainName}.json`;

  try {
    const [tokenRes, covalentRes] = await Promise.all([
      fetch(tokenFile),
      fetch(`https://api.covalenthq.com/v1/${chainId}/address/${walletAddress}/balances_v2/?key=${API_KEY}`)
    ]);

    const tokens = await tokenRes.json();
    const covalentData = await covalentRes.json();

    if (!covalentData.data || !covalentData.data.items) throw new Error("Invalid Covalent data");

    const items = covalentData.data.items;
    let balances = [];

    for (const token of tokens) {
      let tokenData = items.find(t =>
        (token.address.toLowerCase() === "native" &&
         (t.contract_ticker_symbol === "ETH" || t.contract_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")) ||
        t.contract_address.toLowerCase() === token.address.toLowerCase()
      );

      const balance = tokenData
        ? (parseFloat(tokenData.balance) / Math.pow(10, token.decimals))
        : 0;

      balances.push({
        symbol: token.symbol,
        logo: token.logo,
        value: balance.toFixed(4)
      });
    }

    balances.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

    let html = `<h3>${chainName} Token Balances for ${walletAddress}</h3><ul>`;
    for (const b of balances) {
      html += `
        <li>
          <img src="${b.logo}" width="20" onerror="this.src='fallback.png'" />
          ${b.symbol}: ${b.value}
        </li>`;
    }
    html += "</ul>";
    display.innerHTML = html;

  } catch (err) {
    console.error(err);
    display.innerHTML = `<p style="color:red;">Error loading data for ${chainName}</p>`;
  } finally {
    spinner.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connect-btn").addEventListener("click", connectWallet);
  document.getElementById("load-btn").addEventListener("click", manualLoad);
});
