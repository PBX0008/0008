function safeNumber(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function roundTo(num, decimals = 1) {
  return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
}

function calcDHQ() {
  const desired = safeNumber(document.getElementById('desired')?.value);
  const have = safeNumber(document.getElementById('have')?.value);
  const quantity = safeNumber(document.getElementById('quantity')?.value);
  const unit = document.getElementById('quantityUnit')?.value?.trim() || 'units';
  const result = document.getElementById('dhqResult');
  if (!result) return;
  if (!desired || !have || !quantity) {
    result.textContent = 'Enter desired dose, dose on hand, and quantity.';
    return;
  }
  const answer = (desired / have) * quantity;
  result.textContent = `Answer: ${roundTo(answer, 2)} ${unit}`;
}

function calcMlHr() {
  const volume = safeNumber(document.getElementById('ivVolume')?.value);
  const hours = safeNumber(document.getElementById('ivHours')?.value);
  const result = document.getElementById('mlhrResult');
  if (!result) return;
  if (!volume || !hours) {
    result.textContent = 'Enter both volume and time.';
    return;
  }
  result.textContent = `Answer: ${roundTo(volume / hours, 2)} mL/hr`;
}

function calcGtt() {
  const volume = safeNumber(document.getElementById('gttVolume')?.value);
  const factor = safeNumber(document.getElementById('dropFactor')?.value);
  const hours = safeNumber(document.getElementById('gttHours')?.value) || 0;
  const minutes = safeNumber(document.getElementById('gttMinutes')?.value) || 0;
  const totalMinutes = (hours * 60) + minutes;
  const result = document.getElementById('gttResult');
  if (!result) return;
  if (!volume || !factor || !totalMinutes) {
    result.textContent = 'Enter volume, drop factor, and a valid infusion time.';
    return;
  }
  const answer = Math.round((volume * factor) / totalMinutes);
  result.textContent = `Answer: ${answer} gtt/min`;
}

function calcMgKg() {
  const kg = safeNumber(document.getElementById('kgWeight')?.value);
  const dose = safeNumber(document.getElementById('mgkg')?.value);
  const result = document.getElementById('mgkgResult');
  if (!result) return;
  if (!kg || !dose) {
    result.textContent = 'Enter weight and ordered mg/kg/dose.';
    return;
  }
  result.textContent = `Answer: ${roundTo(kg * dose, 2)} mg per dose`;
}

function calcTitration() {
  const wt = safeNumber(document.getElementById('tWt')?.value);
  const dose = safeNumber(document.getElementById('tDose')?.value);
  const bagDrug = safeNumber(document.getElementById('bagDrug')?.value);
  const bagVolume = safeNumber(document.getElementById('bagVolume')?.value);
  const result = document.getElementById('titrationResult');
  if (!result) return;
  if (!wt || !dose || !bagDrug || !bagVolume) {
    result.textContent = 'Enter all four values.';
    return;
  }
  const mcgPerHr = dose * wt * 60;
  const concentration = (bagDrug * 1000) / bagVolume;
  const mlhr = mcgPerHr / concentration;
  result.textContent = `Answer: ${roundTo(mlhr, 2)} mL/hr`;
}

function calcSafeRange() {
  const kg = safeNumber(document.getElementById('safeKg')?.value);
  const low = safeNumber(document.getElementById('safeLow')?.value);
  const high = safeNumber(document.getElementById('safeHigh')?.value);
  const ordered = safeNumber(document.getElementById('orderedDose')?.value);
  const result = document.getElementById('safeResult');
  if (!result) return;
  if (!kg || !low || !high || !ordered) {
    result.textContent = 'Enter weight, low dose, high dose, and ordered dose.';
    return;
  }
  const min = kg * low;
  const max = kg * high;
  const safety = ordered >= min && ordered <= max ? 'SAFE' : 'NOT SAFE';
  result.textContent = `Safe range: ${roundTo(min, 2)} mg to ${roundTo(max, 2)} mg. Ordered dose is ${safety}.`;
}

function toggleAnswer(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show');
}

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const navBackdrop = document.getElementById('navBackdrop');

function closeNav() {
  if (!sidebar || !menuToggle || !navBackdrop) return;
  sidebar.classList.remove('open');
  navBackdrop.classList.remove('show');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

function openNav() {
  if (!sidebar || !menuToggle || !navBackdrop) return;
  sidebar.classList.add('open');
  navBackdrop.classList.add('show');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = sidebar?.classList.contains('open');
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });
}

if (navBackdrop) {
  navBackdrop.addEventListener('click', closeNav);
}

document.querySelectorAll('.sidebar a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 1100) closeNav();
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) closeNav();
});

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const term = this.value.trim().toLowerCase();
    const blocks = document.querySelectorAll('.searchable, .card, .practice-item, .calc-panel, details');
    blocks.forEach((block) => {
      const text = (block.innerText || '').toLowerCase();
      block.classList.toggle('hidden-by-search', Boolean(term) && !text.includes(term));
    });
  });
}
