async function loadWalletData(wallet) {
  const display = document.getElementById('wallet-display');
  const spinner = document.getElementById('spinner');
  const selectedChainId = document.getElementById('chain-selector').value;

  spinner.style.display = 'block';
  display.innerHTML = '';

  try {
    const tokenFile = `./tokens/${getChainName(selectedChainId)}.json`;
    const tokenRes = await fetch(tokenFile);
    const tokenList = await tokenRes.json();

    const covalentUrl = `https://api.covalenthq.com/v1/${selectedChainId}/address/${wallet}/balances_v2/?key=${API_KEY}`;
    const covalentRes = await fetch(covalentUrl);
    const covalentData = await covalentRes.json();

    if (!covalentData?.data?.items) throw new Error("Invalid Covalent response");

    const items = covalentData.data.items;

    let balances = tokenList.map(token => {
      let match = items.find(item =>
        token.address === 'native'
          ? item.contract_ticker_symbol === 'ETH' || item.contract_address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          : item.contract_address.toLowerCase() === token.address.toLowerCase()
      );

      const value = match
        ? (parseFloat(match.balance) / Math.pow(10, token.decimals)).toFixed(4)
        : "0.0000";

      return {
        symbol: token.symbol,
        logo: token.logo,
        value
      };
    });

    balances = balances.filter(b => parseFloat(b.value) > 0);
    balances.sort((a, b) => parseFloat(b.value) < parseFloat(a.value) ? 1 : -1);

    display.innerHTML = `<h3>📊 Balances on ${getChainName(selectedChainId)}</h3><ul>` +
      balances.map(b => `
        <li>
          <img src="${b.logo}" width="20" onerror="this.src='fallback.png'" />
          ${b.symbol}: ${b.value}
        </li>
      `).join('') +
      '</ul>';

  } catch (err) {
    console.error(err);
    display.innerHTML = `<p style="color:red;">⚠️ Error loading data</p>`;
  } finally {
    spinner.style.display = 'none';
  }
}

function getChainName(id) {
  const map = {
    "1": "Ethereum",
    "56": "BSC",
    "137": "Polygon",
    "10": "Optimism",
    "42161": "Arbitrum",
    "8453": "Base"
  };
  return map[id] || "Ethereum";
}
