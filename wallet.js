let provider;

async function connectWallet() {
  // If user is on MetaMask browser
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const wallet = accounts[0];
      document.getElementById("wallet-address").value = wallet;
      loadAllChains(wallet);
      return;
    } catch (err) {
      alert("MetaMask connection failed.");
      return;
    }
  }

  // If user is on mobile — use WalletConnect
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
  document.getElementById("wallet-address").value = wallet;
  loadAllChains(wallet);
}
