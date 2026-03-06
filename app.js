const balance = document.getElementById('balance');
const leverage = document.getElementById('leverage');
const pair = document.getElementById('pair');
const tp = document.getElementById('tp');
const sl = document.getElementById('sl');

const balanceValue = document.getElementById('balanceValue');
const leverageValue = document.getElementById('leverageValue');
const notional = document.getElementById('notional');
const startBtn = document.getElementById('startBtn');
const saveStatus = document.getElementById('saveStatus');
const appVersion = document.getElementById('appVersion');

const dashboard = document.getElementById('dashboard');
const dashPair = document.getElementById('dashPair');
const dashBalance = document.getElementById('dashBalance');
const dashLev = document.getElementById('dashLev');
const dashTpSl = document.getElementById('dashTpSl');
const livePrice = document.getElementById('livePrice');
const entry = document.getElementById('entry');
const pnl = document.getElementById('pnl');

let lastPrice = 84.42;
let saveTimeout;

function readFormState() {
  return {
    pair: pair.value,
    balance: Number(balance.value),
    leverage: Number(leverage.value),
    tp: Number(tp.value),
    sl: Number(sl.value)
  };
}

function applyFormState(state) {
  if (!state) {
    return;
  }

  if (state.pair) {
    pair.value = state.pair;
  }

  if (Number.isFinite(state.balance)) {
    balance.value = String(state.balance);
  }

  if (Number.isFinite(state.leverage)) {
    leverage.value = String(state.leverage);
  }

  if (Number.isFinite(state.tp)) {
    tp.value = String(state.tp);
  }

  if (Number.isFinite(state.sl)) {
    sl.value = String(state.sl);
  }
}

function recalc() {
  const b = Number(balance.value);
  const l = Number(leverage.value);
  balanceValue.textContent = `$${b.toFixed(2)}`;
  leverageValue.textContent = `${l}x`;
  notional.textContent = `$${(b * l).toFixed(2)}`;
}

function pumpPrice() {
  const drift = (Math.random() - 0.5) * 0.8;
  lastPrice = Math.max(1, lastPrice + drift);
  livePrice.textContent = `$${lastPrice.toFixed(2)}`;

  const entryPrice = Number(entry.textContent.replace('$', ''));
  const positionSize = Number(leverage.value) * (Number(balance.value) / 10);
  const value = (lastPrice - entryPrice) * positionSize;
  const sign = value >= 0 ? '+' : '-';
  pnl.textContent = `${sign}${Math.abs(value).toFixed(3)}$`;
  pnl.className = value >= 0 ? 'green' : '';
}

function scheduleSave() {
  if (!window.desktopAPI?.writeSettings) {
    return;
  }

  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    await window.desktopAPI.writeSettings(readFormState());
    saveStatus.textContent = 'Ustawienia zapisane lokalnie.';
  }, 180);
}

async function loadDesktopMeta() {
  if (!window.desktopAPI) {
    return;
  }

  const [settings, version] = await Promise.all([
    window.desktopAPI.readSettings(),
    window.desktopAPI.getVersion()
  ]);

  applyFormState(settings);
  recalc();
  saveStatus.textContent = 'Tryb desktop: ustawienia zapisują się automatycznie.';
  appVersion.textContent = `Wersja aplikacji: ${version}`;
}

[balance, leverage, pair, tp, sl].forEach((input) => {
  input.addEventListener('input', () => {
    recalc();
    scheduleSave();
  });
});

startBtn.addEventListener('click', () => {
  dashboard.hidden = false;
  dashPair.textContent = pair.value;
  dashBalance.textContent = `$${Number(balance.value).toFixed(2)}`;
  dashLev.textContent = `${Number(leverage.value)}x`;
  dashTpSl.textContent = `${Number(tp.value).toFixed(2)} / ${Number(sl.value).toFixed(2)}`;
  entry.textContent = `$${lastPrice.toFixed(2)}`;
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

recalc();
loadDesktopMeta();
setInterval(pumpPrice, 1200);
