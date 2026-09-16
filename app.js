/* ============================================================
   GLOBAL STATE
============================================================ */

let vehicles = [];
let filteredVehicles = [];
let comparison = [];
let currentPage = 1;
const itemsPerPage = 6; // Six vehicles per page: 3 columns × 2 rows on desktop.

/* ==========================================================================
   GLOBAL UTILITY & LABEL HELPERS
   ========================================================================== */

function displayValue(val, fallback = 'N/A') {
  if (val === null || val === undefined || String(val).trim() === '') return fallback;
  return String(val).trim();
}

function yearLabel(v) {
  if (typeof v === 'object' && v !== null) return v.year ? String(v.year) : 'N/A';
  return v ? String(v) : 'N/A';
}

function priceLabel(v) {
  const price = typeof v === 'object' && v !== null ? v.price : v;
  if (price === null || price === undefined || price === '') return 'N/A';
  return `R ${Number(price).toLocaleString('en-ZA')}`;
}

function mileageLabel(v) {
  const km = typeof v === 'object' && v !== null ? (v.mileage ?? v.km) : v;
  if (km === null || km === undefined || km === '') return 'N/A';
  return `${Number(km).toLocaleString('en-ZA')} km`;
}

function vehicleLabel(v) {
  if (!v) return 'Unknown Vehicle';
  if (v.title) return v.title;
  return [v.year, v.make, v.model, v.variant].filter(Boolean).join(' ') || `Vehicle #${v.id || ''}`;
}

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   FORMATTING
============================================================ */

function money(value){
  if(value === null || value === undefined || !isFinite(value)){
    return "Insufficient data";
  }
  return new Intl.NumberFormat("en-ZA",{
    style:"currency",
    currency:"ZAR",
    maximumFractionDigits:0
  }).format(value);
}

function number(value){
  if(value === null || value === undefined || !isFinite(value)){
    return "—";
  }
  return new Intl.NumberFormat("en-ZA").format(value);
}

function pct(value){
  if(!isFinite(value)){
    return "—";
  }
  return `${value.toFixed(1)}%`;
}

/* ============================================================
   SVG DEMO VEHICLE IMAGE
============================================================ */

function vehicleSvg(vehicle){
  const assetType=String(vehicle.assetType||'automotive').toLowerCase();
  const label = `${vehicle.make || vehicle.brand || ''} ${vehicle.model || vehicle.propertyType || vehicle.itemType || ''}`.trim();
  if(assetType !== 'automotive'){
    const heading=assetType==='property'?'VECTORI PROPERTY INTELLIGENCE':'VECTORI FINE JEWELLERY INTELLIGENCE';
    const sub=assetType==='property'?'AUTHORISED PROPERTY LISTING':'AUTHORISED JEWELLERY LISTING';
    return `<svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(label)} VECTORI asset image"><defs><linearGradient id="asset-${escapeHtml(vehicle.id)}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10202f"/><stop offset="100%" stop-color="#071018"/></linearGradient></defs><rect width="620" height="280" fill="url(#asset-${escapeHtml(vehicle.id)})"/><circle cx="310" cy="138" r="76" fill="none" stroke="#6bd8ff" stroke-width="2" opacity=".45"/><circle cx="310" cy="138" r="48" fill="none" stroke="#6bd8ff" stroke-width="2" opacity=".28"/><text x="310" y="44" text-anchor="middle" fill="#8ddfff" font-size="13" font-family="Arial" letter-spacing="2">${heading}</text><text x="310" y="145" text-anchor="middle" fill="#d9e8f4" font-size="24" font-family="Arial" font-weight="700">${escapeHtml(label)}</text><text x="310" y="185" text-anchor="middle" fill="#71879b" font-size="11" font-family="Arial" letter-spacing="1.5">${sub}</text></svg>`;
  }
  const seed = vehicle.imageSeed || (vehicle.model ? vehicle.model.toLowerCase() : "swift");

  const shapes = {
    polo:`
      <path d="M105 210 L145 150 L220 125 L390 125 L455 155 L520 210 Z" fill="#162535" stroke="#63d5ff" stroke-width="3"/>
      <path d="M220 126 L260 82 L365 82 L390 126 Z" fill="#0c1824" stroke="#63d5ff" stroke-width="3"/>
      <circle cx="190" cy="215" r="35" fill="#080d13" stroke="#91a4b8" stroke-width="5"/>
      <circle cx="450" cy="215" r="35" fill="#080d13" stroke="#91a4b8" stroke-width="5"/>
    `,
    swift:`
      <path d="M100 210 L145 155 L225 128 L390 132 L470 164 L525 210 Z" fill="#182a35" stroke="#74dcff" stroke-width="3"/>
      <path d="M230 130 L270 88 L365 88 L397 133 Z" fill="#091722" stroke="#74dcff" stroke-width="3"/>
      <circle cx="190" cy="215" r="34" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
      <circle cx="450" cy="215" r="34" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
    `,
    rumion:`
      <rect x="110" y="115" width="400" height="100" rx="20" fill="#172938" stroke="#6bd8ff" stroke-width="3"/>
      <rect x="180" y="75" width="250" height="70" rx="12" fill="#0a1823" stroke="#6bd8ff" stroke-width="3"/>
      <circle cx="190" cy="215" r="35" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
      <circle cx="450" cy="215" r="35" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
    `,
    cross:`
      <path d="M95 210 L130 150 L205 130 L400 130 L490 165 L530 210 Z" fill="#1a2b37" stroke="#73dcff" stroke-width="3"/>
      <path d="M205 130 L245 85 L375 85 L405 130 Z" fill="#0a1721" stroke="#73dcff" stroke-width="3"/>
      <circle cx="180" cy="215" r="35" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
      <circle cx="460" cy="215" r="35" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
    `,
    i20:`
      <path d="M105 210 L150 155 L230 128 L395 128 L475 165 L520 210 Z" fill="#1c2936" stroke="#69d7ff" stroke-width="3"/>
      <path d="M230 128 L270 88 L365 88 L398 128 Z" fill="#091722" stroke="#69d7ff" stroke-width="3"/>
      <circle cx="190" cy="215" r="34" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
      <circle cx="445" cy="215" r="34" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
    `,
    sonet:`
      <path d="M100 210 L135 155 L210 128 L405 128 L480 160 L530 210 Z" fill="#172a38" stroke="#73dcff" stroke-width="3"/>
      <path d="M210 128 L255 84 L375 84 L410 128 Z" fill="#091722" stroke="#73dcff" stroke-width="3"/>
      <circle cx="185" cy="215" r="35" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
      <circle cx="455" cy="215" r="35" fill="#080d13" stroke="#a6b6c8" stroke-width="5"/>
    `
  };

  return `
    <svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(label)} VECTORI demo vehicle image">
      <defs>
        <linearGradient id="bg-${escapeHtml(vehicle.id)}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#10202f"/>
          <stop offset="100%" stop-color="#071018"/>
        </linearGradient>
      </defs>
      <rect width="620" height="280" fill="url(#bg-${escapeHtml(vehicle.id)})"/>
      <ellipse cx="310" cy="228" rx="245" ry="20" fill="#000" opacity=".45"/>
      ${shapes[seed] || shapes.swift}
      <text x="310" y="35" text-anchor="middle" fill="#8ddfff" font-size="13" font-family="Arial" letter-spacing="2">VECTORI DEMO VEHICLE IMAGE</text>
      <text x="310" y="262" text-anchor="middle" fill="#71879b" font-size="11" font-family="Arial">${escapeHtml(label)}</text>
    </svg>
  `;
}

/* ============================================================
   MARKET POSITION
============================================================ */

function marketPosition(vehicle){
  if(
    vehicle.price === null || vehicle.price === undefined || !isFinite(vehicle.price) ||
    vehicle.market === null || vehicle.market === undefined || !isFinite(vehicle.market) ||
    vehicle.market <= 0
  ){
    return {
      label:"Insufficient evidence",
      className:"warn",
      difference:null
    };
  }

  const difference = vehicle.price - vehicle.market;
  const percentage = (difference / vehicle.market) * 100;

  if(percentage <= -5){
    return {
      label:`Below benchmark ${pct(Math.abs(percentage))}`,
      className:"good",
      difference
    };
  }

  if(percentage <= 5){
    return {
      label:`Near benchmark ${pct(Math.abs(percentage))}`,
      className:"warn",
      difference
    };
  }

  return {
    label:`Above benchmark ${pct(Math.abs(percentage))}`,
    className:"bad",
    difference
  };
}

/* ==========================================================================
   FILTER OPTIONS
   ========================================================================== */

function populateFilters(){
  const makes = [...new Set(vehicles.map(v => v.make))].filter(Boolean).sort();
  const models = [...new Set(vehicles.map(v => v.model))].filter(Boolean).sort();
  const dealers = [...new Set(vehicles.map(v => displayValue(v.dealer)))].filter(v => v !== 'N/A').sort();
  const provinces = [...new Set(vehicles.map(v => v.province))].filter(Boolean).sort();

  populateSelect("filterMake", makes, "All makes");
  populateSelect("filterModel", models, "All models");
  populateSelect("filterDealer", dealers, "All dealers");
  populateSelect("filterProvince", provinces, "All provinces");

  const calc = document.getElementById("calcVehicle");
  if (calc) {
    calc.innerHTML =
      `<option value="">Select vehicle</option>` +
      vehicles.map(v =>
        `<option value="${escapeHtml(v.id)}">${escapeHtml(vehicleLabel(v))}</option>`
      ).join("");
  }
}

function populateSelect(id, values, defaultLabel){
  const select = document.getElementById(id);
  if (!select) return;

  select.innerHTML =
    `<option value="">${defaultLabel}</option>` +
    values.map(v =>
      `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`
    ).join("");
}

/* ============================================================
   RENDER VEHICLES & PAGINATION
============================================================ */

function renderVehicles(list){
  const container = document.getElementById("vehicleResults");
  const countEl = document.getElementById("resultsCount");

  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageList = list.slice(start, end);

  if (countEl) {
    if (totalItems > 0) {
      countEl.textContent = `Showing ${start + 1}–${Math.min(end, totalItems)} of ${totalItems} vehicles (Page ${currentPage} of ${totalPages})`;
    } else {
      countEl.textContent = `0 vehicles found`;
    }
  }

  if(!totalItems){
    container.innerHTML = `
      <div class="empty-state">
        No vehicles match the selected criteria.
      </div>
    `;
    renderPagination(0, 1);
    return;
  }

  container.innerHTML = pageList.map(vehicleCard).join("");
  renderPagination(totalItems, totalPages);
}

function renderPagination(totalItems, totalPages) {
  let pagEl = document.getElementById("paginationControls");
  if (!pagEl) {
    const resultsContainer = document.getElementById("vehicleResults");
    if (resultsContainer) {
      pagEl = document.createElement("div");
      pagEl.id = "paginationControls";
      resultsContainer.after(pagEl);
    } else {
      return;
    }
  }

  if (totalPages <= 1) {
    pagEl.innerHTML = "";
    return;
  }

  const prevDisabled = currentPage === 1 ? "disabled aria-disabled=\"true\"" : "";
  const nextDisabled = currentPage === totalPages ? "disabled aria-disabled=\"true\"" : "";

  let buttonsHtml = `
    <button class="btn btn-secondary btn-sm pagination-arrow" ${prevDisabled} aria-label="Previous vehicle page" onclick="goToPage(${currentPage - 1})">
      ← Previous
    </button>
  `;

  const visiblePages = [];
  const addPage = (page) => { if (page >= 1 && page <= totalPages && !visiblePages.includes(page)) visiblePages.push(page); };
  addPage(1);
  addPage(totalPages);
  addPage(currentPage - 1);
  addPage(currentPage);
  addPage(currentPage + 1);
  visiblePages.sort((a,b) => a-b);

  let lastPage = 0;
  visiblePages.forEach(page => {
    if (page - lastPage > 1) buttonsHtml += '<span class="pagination-ellipsis" aria-hidden="true">…</span>';
    const isCurrent = page === currentPage;
    buttonsHtml += `
      <button class="btn ${isCurrent ? "btn-primary" : "btn-secondary"} btn-sm page-number" aria-label="Page ${page}" aria-current="${isCurrent ? "page" : "false"}" onclick="goToPage(${page})">
        ${page}
      </button>
    `;
    lastPage = page;
  });

  buttonsHtml += `
    <button class="btn btn-secondary btn-sm pagination-arrow" ${nextDisabled} aria-label="Next vehicle page" onclick="goToPage(${currentPage + 1})">
      Next →
    </button>
  `;

  pagEl.innerHTML = `
    <div class="pagination">${buttonsHtml}</div>
    <div class="pagination-summary">Page ${currentPage} of ${totalPages} · ${itemsPerPage} vehicles per page · <span class="swipe-hint">Swipe left/right to change pages</span></div>
  `;
}

function goToPage(page) {
  currentPage = page;
  renderVehicles(filteredVehicles);
  const findSection = document.getElementById("find");
  if (findSection) {
    findSection.scrollIntoView({ behavior: "smooth" });
  }
}

function vehicleCard(v){
  const position=marketPosition(v);
  const selected=comparison.includes(v.id);
  const assetType=v.assetType||'automotive';
  const assetLabel=assetType==='fine_jewellery'?'Fine Jewellery':assetType==='property'?'Property':'Automotive';
  const isAuto=assetType==='automotive';
  return `
    <article class="vehicle-card">
      <div class="vehicle-image">${vehicleSvg(v)}</div>
      <div class="vehicle-info">
        <div class="vehicle-top">
          <div>
            <div class="vehicle-title">${escapeHtml(v.make||v.brand||'')} ${escapeHtml(v.model||'')}</div>
            <div class="vehicle-variant">${escapeHtml(v.variant||v.propertyType||v.itemType||'')}</div>
          </div>
        </div>
        <div class="vehicle-meta">
          <span class="asset-badge">${assetLabel}</span>
          ${isAuto?`<span class="tag">${escapeHtml(yearLabel(v))}</span><span class="tag">${Number.isFinite(v.mileage)?`${number(v.mileage)} km`:'Mileage not supplied'}</span><span class="tag">${escapeHtml(displayValue(v.fuel))}</span>`:''}
        </div>
        <div class="vehicle-dealer-badge">${escapeHtml(displayValue(v.dealer,'Dealer / agent not supplied'))}</div>
        <div class="vehicle-description">${escapeHtml(v.description||'')}</div>
        <div class="vehicle-data">
          <div class="data-box"><span>Dealer / agent</span><strong>${escapeHtml(displayValue(v.dealer))}</strong></div>
          <div class="data-box"><span>Location</span><strong>${escapeHtml(displayValue(v.province,displayValue(v.location)))}</strong></div>
          <div class="data-box"><span>Listing ID</span><strong>${escapeHtml(displayValue(v.listingId,v.id))}</strong></div>
          <div class="data-box"><span>Evidence status</span><strong>${escapeHtml(v.evidence||'Missing')}</strong></div>
        </div>
        <div class="small muted" style="margin-top:10px">Source: ${escapeHtml(displayValue(v.source,'VECTORI Database'))}${v.sourceUrl?` • <a href="${escapeHtml(v.sourceUrl)}" target="_blank" rel="noopener noreferrer">View source listing</a>`:''}</div>
      </div>
      <div class="vehicle-side">
        <div><div class="price">${money(v.price)}</div><div class="market ${position.className}">${position.label}</div></div>
        <div>
          <button class="btn btn-compare ${selected?'is-selected':''}" type="button" aria-pressed="${selected?'true':'false'}" onclick="toggleComparison('${escapeHtml(v.id)}',${selected?'false':'true'})">${selected?'✓ Compared':'＋ Add to Compare'}</button>
          ${isAuto?`<button class="btn btn-secondary" style="margin-top:8px;width:100%" onclick="analyseVehicle('${escapeHtml(v.id)}')">Run intelligence</button>`:`<button class="btn btn-secondary" style="margin-top:8px;width:100%" onclick="alert('The shared VECTORI outcome architecture is ready; connect the authorised ${assetLabel.toLowerCase()} finance/insurance feed to run the vertical-specific outcome.')">Intelligence path</button>`}
        </div>
      </div>
    </article>`;
}

/* ============================================================
   FILTERING
============================================================ */

function applyFilters(){
  const make = document.getElementById("filterMake").value;
  const model = document.getElementById("filterModel").value;
  const search = document.getElementById("filterSearch").value.trim().toLowerCase();
  const dealer = document.getElementById("filterDealer").value;
  const province = document.getElementById("filterProvince").value;
  const maxPrice = parseFloat(document.getElementById("filterMaxPrice").value);
  const maxMileage = parseFloat(document.getElementById("filterMaxMileage").value);
  const sort = document.getElementById("filterSort").value;

  filteredVehicles = vehicles.filter(v => {
    if(make && v.make !== make) return false;
    if(model && v.model !== model) return false;
    if(dealer && displayValue(v.dealer) !== dealer) return false;
    if(province && v.province !== province) return false;
    if(isFinite(maxPrice) && Number.isFinite(v.price) && v.price > maxPrice) return false;
    if(isFinite(maxMileage) && Number.isFinite(v.mileage) && v.mileage > maxMileage) return false;

    if(search){
      const text = [
        vehicleLabel(v), v.make, v.model, v.variant,
        v.fuel, v.transmission, v.dealer, v.province, v.listingId
      ].filter(Boolean).join(" ").toLowerCase();
      if(!text.includes(search)) return false;
    }

    return true;
  });

  filteredVehicles.sort((a,b) => {
    if(sort === "price"){
      const ap = Number.isFinite(a.price) ? a.price : Infinity;
      const bp = Number.isFinite(b.price) ? b.price : Infinity;
      return ap - bp;
    }

    if(sort === "km"){
      const ak = Number.isFinite(a.mileage) ? a.mileage : Infinity;
      const bk = Number.isFinite(b.mileage) ? b.mileage : Infinity;
      return ak - bk;
    }

    if(sort === "year"){
      const ay = Number.isFinite(a.year) ? a.year : -Infinity;
      const by = Number.isFinite(b.year) ? b.year : -Infinity;
      return by - ay;
    }

    if(sort === "deal"){
      const ad = Number.isFinite(a.market) && a.market > 0 && Number.isFinite(a.price) ? (a.price - a.market) / a.market : Infinity;
      const bd = Number.isFinite(b.market) && b.market > 0 && Number.isFinite(b.price) ? (b.price - b.market) / b.market : Infinity;
      return ad - bd;
    }

    if(sort === "burden"){
      return modelledBurden(a) - modelledBurden(b);
    }

    return decisionScore(b) - decisionScore(a);
  });

  currentPage = 1;
  renderVehicles(filteredVehicles);
}

function resetFilters(){
  document.getElementById("filterMake").value = "";
  document.getElementById("filterModel").value = "";
  document.getElementById("filterSearch").value = "";
  document.getElementById("filterDealer").value = "";
  document.getElementById("filterProvince").value = "";
  document.getElementById("filterMaxPrice").value = "";
  document.getElementById("filterMaxMileage").value = "";
  document.getElementById("filterSort").value = "best";

  filteredVehicles = [...vehicles];
  currentPage = 1;
  renderVehicles(filteredVehicles);
}

/* ============================================================
   COMPARISON
============================================================ */

function toggleComparison(id, checked){
  if(checked){
    if(comparison.includes(id)) return;
    if(comparison.length >= 6){
      alert("VECTORI comparison is limited to six vehicles.");
      renderVehicles(filteredVehicles);
      return;
    }
    comparison.push(id);
  } else {
    comparison = comparison.filter(item => item !== id);
  }

  renderVehicles(filteredVehicles);
  renderComparison();
}

function clearComparison(){
  comparison = [];
  renderVehicles(filteredVehicles);
  renderComparison();
}

function renderComparison(){
  const area = document.getElementById("compareArea");
  if (!area) return;

  const selected = comparison
    .map(id => vehicles.find(v => v.id === id))
    .filter(Boolean);

  if(!selected.length){
    area.innerHTML = `
      <div class="empty-state">
        Select vehicles from the Find section to begin a comparison.
      </div>
    `;
    return;
  }

  const burdenRows = selected.map(v => ({ vehicle:v, burden:modelledBurden(v) }));
  const burdenRange = burdenRows.filter(x => Number.isFinite(x.burden));
  const strongest = burdenRange.length ? burdenRange.reduce((best,current) => current.burden < best.burden ? current : best).vehicle : null;
  const lowestBurden = burdenRange.length ? Math.min(...burdenRange.map(x => x.burden)) : null;
  const highestBurden = burdenRange.length ? Math.max(...burdenRange.map(x => x.burden)) : null;

  area.innerHTML = `
    <div class="compare-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Metric</th>
            ${selected.map(v => `
              <th>
                ${escapeHtml(v.make)} ${escapeHtml(v.model)}
                <br>
                <span class="muted">${escapeHtml(v.variant)}</span>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
          ${compareRow("Asking price", selected, v => money(v.price))}
          ${compareRow("Year", selected, v => yearLabel(v))}
          ${compareRow("Mileage", selected, v => Number.isFinite(v.mileage) ? `${number(v.mileage)} km` : "Not supplied")}
          ${compareRow("Market benchmark", selected, v => money(v.market))}
          ${compareRow("Market position", selected, v => marketPosition(v).label)}
          ${compareRow("Consumption", selected, v => Number.isFinite(v.consumption) ? `${v.consumption} L/100km` : "Not supplied")}
          ${compareRow("Transmission", selected, v => displayValue(v.transmission))}
          ${compareRow("Dealer", selected, v => displayValue(v.dealer))}
          ${compareRow("Evidence", selected, v => displayValue(v.evidence))}
          ${compareRow("Listing ID", selected, v => displayValue(v.listingId, v.id))}
          ${compareRow("Ownership / service / warranty", selected, v => [v.owners !== null ? `${v.owners} owner(s)` : null, v.serviceHistory, v.warranty].filter(Boolean).join(" • ") || "Not supplied")}
          ${compareRow("Modelled monthly burden", selected, v => money(modelledBurden(v)))}
        </tbody>
      </table>
    </div>

    <div class="compare-analysis">
      <div class="signal" style="background:rgba(57,217,138,.1);color:var(--good);border:1px solid rgba(57,217,138,.2);">
        STRONGEST MODELLED BURDEN
      </div>
      <h3>${strongest ? escapeHtml(vehicleLabel(strongest)) : "Modelled burden unavailable"}</h3>
      <p class="muted">
        Based on the current demonstration assumptions, this vehicle has the lowest modelled monthly cash ownership burden among the selected vehicles.
        ${lowestBurden !== null && highestBurden !== null ? `The selected range is ${money(lowestBurden)} to ${money(highestBurden)} per month.` : ""}
        ${strongest ? "This is not a final recommendation because vehicle condition, history, warranty, financing terms and other evidence may materially affect the decision." : "A complete modelled burden cannot be established until fuel-consumption data is supplied for at least one selected vehicle."}
      </p>
    </div>
  `;
}

function compareRow(label, list, fn){
  return `
    <tr>
      <td><strong>${escapeHtml(label)}</strong></td>
      ${list.map(v => `<td>${escapeHtml(String(fn(v)))}</td>`).join("")}
    </tr>
  `;
}

/* ============================================================
   CALCULATOR
============================================================ */

function loadCalculatorVehicle(){
  const calcEl = document.getElementById("calcVehicle");
  if (!calcEl) return;
  const id = calcEl.value;
  const vehicle = vehicles.find(v => v.id === id);

  if(!vehicle) return;

  const priceEl = document.getElementById("calcPrice");
  const marketEl = document.getElementById("calcMarket");
  const consEl = document.getElementById("calcConsumption");

  if (priceEl) priceEl.value = vehicle.price ?? "";
  if (marketEl) marketEl.value = Number.isFinite(vehicle.market) ? vehicle.market : "";
  if (consEl) consEl.value = Number.isFinite(vehicle.consumption) ? vehicle.consumption : "";
}

function pmt(rate, nper, pv, futureValue = 0){
  if(!Number.isFinite(rate) || !Number.isFinite(nper) || nper <= 0 || !Number.isFinite(pv) || pv < 0){
    return NaN;
  }
  if(rate === 0){
    return (pv - Math.max(0, futureValue)) / nper;
  }
  const fv = Math.max(0, futureValue || 0);
  const discount = Math.pow(1 + rate, -nper);
  return (pv - fv * discount) * rate / (1 - discount);
}

function getInputNum(id, fallback = null){
  const el = document.getElementById(id);
  if(!el) return fallback;
  const value = parseFloat(el.value);
  return Number.isFinite(value) ? value : fallback;
}

function calculate(vehicle){
  const price = getInputNum("calcPrice");
  const market = getInputNum("calcMarket");
  const consumption = getInputNum("calcConsumption");
  const monthlyKm = getInputNum("calcKm");
  const fuelPrice = getInputNum("calcFuel");
  const deposit = getInputNum("calcDeposit");
  const annualInterest = getInputNum("calcInterest");
  const term = getInputNum("calcTerm");
  const balloonPct = getInputNum("calcBalloonPct", 0);
  const adminFee = getInputNum("calcAdminFee", 0);
  const initiationFee = getInputNum("calcInitiationFee", 0);
  const insurance = getInputNum("calcInsurance", 0);
  const maintenanceRate = getInputNum("calcMaintenance", 0);
  const licence = getInputNum("calcLicence", 0);
  const tyreCost = getInputNum("calcTyreCost", 0);
  const tyreLife = getInputNum("calcTyreLife", 0);
  const futureValue = getInputNum("calcFutureValue", null);
  const horizon = getInputNum("calcHorizon");
  const income = getInputNum("calcIncome");
  const debt = getInputNum("calcDebt", 0);
  const living = getInputNum("calcLiving", 0);
  const otherVehicle = getInputNum("calcOtherVehicle", 0);
  const tradeIn = getInputNum("calcTradeIn", 0);
  const errors = [];

  if(!Number.isFinite(price) || price <= 0) errors.push("A valid asking price is required.");
  if(!Number.isFinite(consumption) || consumption <= 0) errors.push("A valid fuel consumption value is required.");
  if(!Number.isFinite(monthlyKm) || monthlyKm < 0) errors.push("Monthly kilometres must be zero or greater.");
  if(!Number.isFinite(fuelPrice) || fuelPrice < 0) errors.push("Fuel price cannot be negative.");
  if(!Number.isFinite(deposit) || deposit < 0) errors.push("Deposit cannot be negative.");
  if(!Number.isFinite(tradeIn) || tradeIn < 0) errors.push("Trade-in value cannot be negative.");
  if(!Number.isFinite(annualInterest) || annualInterest < 0) errors.push("Interest rate cannot be negative.");
  if(!Number.isFinite(term) || term <= 0 || term > 120) errors.push("Finance term must be between 1 and 120 months.");
  if(!Number.isFinite(balloonPct) || balloonPct < 0 || balloonPct > 60) errors.push("Balloon percentage must be between 0% and 60%.");
  if(!Number.isFinite(adminFee) || adminFee < 0) errors.push("Monthly admin fee cannot be negative.");
  if(!Number.isFinite(initiationFee) || initiationFee < 0) errors.push("Initiation fee cannot be negative.");
  if(!Number.isFinite(insurance) || insurance < 0) errors.push("Insurance cannot be negative.");
  if(!Number.isFinite(maintenanceRate) || maintenanceRate < 0) errors.push("Maintenance rate cannot be negative.");
  if(!Number.isFinite(licence) || licence < 0) errors.push("Licence reserve cannot be negative.");
  if(!Number.isFinite(tyreCost) || tyreCost < 0) errors.push("Tyre cost cannot be negative.");
  if(!Number.isFinite(tyreLife) || tyreLife < 0) errors.push("Tyre life cannot be negative.");
  if(!Number.isFinite(income) || income <= 0) errors.push("Gross monthly income is required for affordability.");
  if(deposit + tradeIn > price && Number.isFinite(price)) errors.push("Deposit plus trade-in cannot exceed the asking price.");

  if(errors.length) return { errors };

  const netPurchasePrice = Math.max(0, price - tradeIn);
  const principal = Math.max(0, netPurchasePrice - deposit);
  const balloonAmount = principal * (balloonPct / 100);
  const monthlyRate = annualInterest / 100 / 12;
  const financePayment = principal === 0 ? 0 : pmt(monthlyRate, term, principal, balloonAmount);
  const fuelMonthly = consumption * monthlyKm / 100 * fuelPrice;
  const maintenanceMonthly = maintenanceRate * monthlyKm;
  const tyresMonthly = tyreLife > 0 ? monthlyKm / tyreLife * tyreCost : 0;
  const licenceMonthly = licence / 12;
  const horizonMonths = Number.isFinite(horizon) && horizon > 0 ? horizon : term;

  let depreciationMonthly = 0;
  if(futureValue !== null && futureValue >= 0 && horizonMonths > 0){
    depreciationMonthly = Math.max(0, netPurchasePrice - futureValue) / horizonMonths;
  }

  const financeCashMonthly = financePayment + adminFee;
  const operatingMonthly = fuelMonthly + insurance + maintenanceMonthly + licenceMonthly + tyresMonthly + otherVehicle;
  const totalCashMonthly = financeCashMonthly + operatingMonthly;
  const principalReductionMonthly = principal > 0 ? (principal - balloonAmount) / term : 0;
  const upfrontCashRequired = deposit + initiationFee;
  const totalFinanceRepayment = financePayment * term + balloonAmount + initiationFee + adminFee * term;
  const estimatedInterest = Math.max(0, totalFinanceRepayment - principal);
  const totalEconomicMonthly = totalCashMonthly - principalReductionMonthly + depreciationMonthly + (initiationFee / horizonMonths);
  const cashRemaining = income - debt - living - totalCashMonthly;
  const vehicleRatio = totalCashMonthly / income * 100;
  const debtServiceRatio = (debt + financePayment + adminFee) / income * 100;
  const balloonReserve = balloonAmount / Math.max(term, 1);
  const stressRate = (annualInterest + 1) / 100 / 12;
  const stressFinance = principal === 0 ? 0 : pmt(stressRate, term, principal, balloonAmount);
  const stressTotal = (stressFinance + adminFee) + (fuelMonthly * 1.20) + (insurance * 1.15) + (maintenanceMonthly * 1.20) + licenceMonthly + tyresMonthly + otherVehicle;
  const marketDelta = Number.isFinite(market) && market > 0 ? price - market : null;
  const marketPct = marketDelta !== null ? marketDelta / market * 100 : null;

  return {
    errors: [], price, market, principal, netPurchasePrice, balloonAmount, balloonPct, financePayment,
    totalFinanceRepayment, estimatedInterest, adminFee, initiationFee, upfrontCashRequired, principalReductionMonthly, fuelMonthly, insurance,
    maintenanceMonthly, licenceMonthly, tyresMonthly, otherVehicle, depreciationMonthly, totalCashMonthly,
    totalEconomicMonthly, vehicleRatio, debtServiceRatio, cashRemaining, stressTotal, balloonReserve,
    marketDelta, marketPct, vehicle
  };
}

/* ============================================================
   CALCULATOR OUTPUT
============================================================ */

function runCalculator(){
  const calcEl = document.getElementById("calcVehicle");
  if (!calcEl) return;
  const id = calcEl.value;
  const vehicle = vehicles.find(v => v.id === id);
  const result = calculate(vehicle);
  const output = document.getElementById("calcOutputs");
  const decision = document.getElementById("decisionPanel");

  if (!output || !decision) return;

  if(result.errors && result.errors.length){
    output.innerHTML = `<div class="warning-list">${result.errors.map(error => `<div class="warning">${escapeHtml(error)}</div>`).join("")}</div>`;
    decision.innerHTML = `<div class="empty-state">Correct the highlighted assumptions before running the purchase analysis.</div>`;
    return;
  }

  output.innerHTML = `
    <div class="big-output"><span>Estimated monthly cash ownership burden</span><strong>${money(result.totalCashMonthly)}</strong></div>
    <div class="output-card"><span>Finance instalment</span><strong>${money(result.financePayment)}</strong></div>
    <div class="output-card"><span>Monthly finance admin</span><strong>${money(result.adminFee)}</strong></div>
    <div class="output-card"><span>Upfront deposit + initiation fee</span><strong>${money(result.upfrontCashRequired)}</strong></div>
    <div class="output-card"><span>Balloon at term end</span><strong>${money(result.balloonAmount)}</strong></div>
    <div class="output-card"><span>Fuel</span><strong>${money(result.fuelMonthly)}</strong></div>
    <div class="output-card"><span>Insurance</span><strong>${money(result.insurance)}</strong></div>
    <div class="output-card"><span>Maintenance</span><strong>${money(result.maintenanceMonthly)}</strong></div>
    <div class="output-card"><span>Tyres</span><strong>${money(result.tyresMonthly)}</strong></div>
    <div class="output-card"><span>Licence reserve</span><strong>${money(result.licenceMonthly)}</strong></div>
    <div class="output-card"><span>Depreciation reserve</span><strong>${money(result.depreciationMonthly)}</strong></div>
    <div class="output-card"><span>Estimated finance interest + stated fees</span><strong>${money(result.estimatedInterest)}</strong></div>
    <div class="output-card"><span>Vehicle cash burden / gross income</span><strong>${pct(result.vehicleRatio)}</strong></div>
    <div class="output-card"><span>Debt service / gross income</span><strong>${pct(result.debtServiceRatio)}</strong></div>
    <div class="output-card"><span>Estimated cash remaining</span><strong>${money(result.cashRemaining)}</strong></div>
    <div class="output-card"><span>Balloon reserve planning amount</span><strong>${money(result.balloonReserve)}/mo</strong></div>
    <div class="output-card"><span>Stress-tested monthly burden</span><strong>${money(result.stressTotal)}</strong></div>
  `;
  renderDecision(result);
}

/* ============================================================
   DECISION ENGINE
============================================================ */

function renderDecision(result){
  const panel = document.getElementById("decisionPanel");
  if (!panel) return;

  const position = result.vehicle ? marketPosition(result.vehicle) : null;
  const warnings = [];
  const positives = [];

  if(position && position.className === "bad") warnings.push("Asking price is above the supplied market benchmark.");
  if(result.vehicleRatio > 30) warnings.push("Vehicle cash burden exceeds 30% of gross monthly income. This is a screening signal, not a lender rule.");
  if(result.cashRemaining < 0) warnings.push("The modelled purchase leaves negative monthly cash after stated debt, living costs and vehicle costs.");
  if(result.balloonAmount > 0) warnings.push(`A ${pct(result.balloonPct)} balloon remains due at term end. Plan for ${money(result.balloonAmount)} or an appropriate settlement strategy.`);
  if(result.debtServiceRatio > 40) warnings.push("Modelled debt service is above 40% of gross income; actual lender affordability criteria differ.");
  if(result.vehicle && String(result.vehicle.evidence || "").toLowerCase().includes("illustrative")) warnings.push("This vehicle is an illustrative development record and must not be treated as live inventory.");

  if(position && position.className === "good") positives.push("Asking price is below the supplied market benchmark.");
  if(result.cashRemaining >= 0) positives.push("Modelled monthly cash flow remains positive after stated expenses.");
  if(result.balloonAmount === 0) positives.push("No balloon payment is included in this scenario.");

  let signal = "REVIEW", signalClass = "background:rgba(255,202,88,.1);color:var(--warn);border:1px solid rgba(255,202,88,.2);";
  if(result.cashRemaining < 0 || result.vehicleRatio > 40) {
    signal = "HIGHER RISK";
    signalClass = "background:rgba(255,102,120,.1);color:var(--bad);border:1px solid rgba(255,102,120,.2);";
  } else if(result.vehicleRatio <= 25 && result.cashRemaining >= 0 && position && position.className === "good") {
    signal = "STRONGER CANDIDATE";
    signalClass = "background:rgba(57,217,138,.1);color:var(--good);border:1px solid rgba(57,217,138,.2);";
  }

  const vMake = result.vehicle ? result.vehicle.make : "";
  const vModel = result.vehicle ? result.vehicle.model : "Vehicle Analysis";

  panel.innerHTML = `
    <div class="signal" style="${signalClass}">${signal}</div>
    <h3>${escapeHtml(vMake)} ${escapeHtml(vModel)}</h3>
    <p class="muted">Asking price: <strong style="color:white">${money(result.price)}</strong><br>Supplied market benchmark: <strong style="color:white">${money(result.market)}</strong><br>Monthly cash burden: <strong style="color:white">${money(result.totalCashMonthly)}</strong><br>Stress burden: <strong style="color:white">${money(result.stressTotal)}</strong></p>
    <div class="decision-grid">
      <div class="status-box"><strong>What supports the case</strong><br><br>${positives.length ? positives.map(x => `✓ ${escapeHtml(x)}`).join('<br>') : 'No positive signal established.'}</div>
      <div class="status-box"><strong>What needs attention</strong><br><br>${warnings.length ? warnings.map(x => `! ${escapeHtml(x)}`).join('<br>') : 'No major warning triggered by the current assumptions.'}</div>
    </div>
    <div class="status-box"><strong style="color:#dce7f2">Evidence hierarchy</strong><br><br>Observed source facts → calculated metrics → explicit assumptions → missing/insufficient evidence. VECTORI should never convert missing evidence into a positive claim.</div>
  `;
}

/* ============================================================
   SIMPLE DECISION SCORE
============================================================ */

function decisionScore(v){
  if(!v) return 0;
  let score = 50;
  if(Number.isFinite(v.market) && v.market > 0 && Number.isFinite(v.price)) {
    score -= ((v.price - v.market) / v.market) * 100;
  }
  if(Number.isFinite(v.mileage)){
    if(v.mileage <= 20000) score += 10;
    else if(v.mileage <= 50000) score += 4;
    else score -= 5;
  }
  if(Number.isFinite(v.consumption)){
    if(v.consumption <= 5) score += 8;
    else if(v.consumption <= 6.5) score += 3;
    else score -= 4;
  }
  if(String(v.evidence || "").toLowerCase().includes("illustrative")) score -= 8;
  if(v.province) score += 2;
  return score;
}

/* ============================================================
   MODELLED BURDEN FOR SORTING / COMPARISON
============================================================ */

function modelledBurden(v){
  if(!v || !Number.isFinite(v.price) || v.price <= 0 || !Number.isFinite(v.consumption) || v.consumption <= 0) return Infinity;
  const deposit = 30000;
  const principal = Math.max(0, v.price - deposit);
  const annualRate = 0.125;
  const termMonths = 72;
  const monthlyRate = annualRate / 12;
  const finance = pmt(monthlyRate, termMonths, principal, 0);
  const fuel = v.consumption * 1500 / 100 * 26.92;
  const maintenance = 0.80 * 1500;
  const tyres = 1500 / 50000 * 5000;
  const licence = 1800 / 12;
  const admin = 69;
  const insurance = 1200;
  return finance + admin + fuel + insurance + maintenance + tyres + licence;
}

/* ============================================================
   ANALYSE SPECIFIC VEHICLE
============================================================ */

function analyseVehicle(id){
  const vehicle = vehicles.find(v => v.id === id);
  if(!vehicle) return;

  const calcEl = document.getElementById("calcVehicle");
  if (calcEl) {
    calcEl.value = vehicle.id;
    loadCalculatorVehicle();
  }

  const intelSec = document.getElementById("intelligence");
  if (intelSec) {
    intelSec.scrollIntoView({ behavior: "smooth" });
  }

  setTimeout(() => {
    runCalculator();
  }, 250);
}

/* ============================================================
   PRINT REPORT
============================================================ */

function printReport(){
  const outputs = document.getElementById("calcOutputs")?.innerHTML || "";
  const decision = document.getElementById("decisionPanel")?.innerHTML || "";
  const vehicleId = document.getElementById("calcVehicle")?.value;
  const vehicle = vehicles.find(v => v.id === vehicleId);

  if(!vehicle || outputs.includes("Select a vehicle")){
    alert("Please select a vehicle and run the analysis first.");
    return;
  }

  const report = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>VECTORI Purchase Intelligence Report</title>
      <style>
        body{ font-family:Arial,sans-serif; padding:40px; color:#111; }
        h1{ margin-bottom:5px; }
        .box{ border:1px solid #ddd; padding:15px; margin:12px 0; border-radius:8px; }
      </style>
    </head>
    <body>
      <h1>VECTORI</h1>
      <p>Vehicle Purchase Intelligence Report</p>
      <hr>
      <h2>${escapeHtml(vehicle.make)} ${escapeHtml(vehicle.model)} ${escapeHtml(vehicle.variant)}</h2>
      <p>Asking price: ${money(vehicle.price)}</p>
      <div class="box">${outputs}</div>
      <h2>Decision intelligence</h2>
      <div class="box">${decision}</div>
      <p>This report contains modelled estimates and is not a lender approval, insurance quotation, inspection report or legal opinion.</p>
    </body>
    </html>
  `;

  const blob = new Blob([report], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");

  if(!win){
    alert("Your browser blocked the report window. Please allow pop-ups for this page.");
    return;
  }

  win.onload = () => {
    setTimeout(() => { win.print(); }, 300);
  };
}

/* ============================================================
   DEALER PORTAL
============================================================ */

function submitDealer(event){
  event.preventDefault();

  const request = {
    reference: `VX-DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
    dealership: document.getElementById("dealerName")?.value.trim() || "",
    contact: document.getElementById("dealerContact")?.value.trim() || "",
    email: document.getElementById("dealerEmail")?.value.trim() || "",
    phone: document.getElementById("dealerPhone")?.value.trim() || "",
    province: document.getElementById("dealerProvince")?.value || "",
    feed: document.getElementById("dealerFeed")?.value || "",
    notes: document.getElementById("dealerNotes")?.value.trim() || "",
    submittedAt: new Date().toISOString(),
    status: "DEMO REQUEST — LOCAL ONLY"
  };

  localStorage.setItem("VECTORI_DEALER_REQUEST", JSON.stringify(request));

  const statusEl = document.getElementById("dealerStatus");
  if (statusEl) {
    statusEl.innerHTML = `
      <div class="status-box">
        <strong style="color:var(--good)">Uptake request created</strong><br><br>
        Reference: <strong style="color:white">${escapeHtml(request.reference)}</strong><br><br>
        This prototype stores the request locally in this browser. It has not been transmitted to VECTORI or a dealership management system.
      </div>
    `;
  }
}

function downloadDealerBrief(){
  const text = `
VECTORI — DEALER PILOT BRIEF
Vehicle Purchase Intelligence

PURPOSE
VECTORI is a vehicle search, comparison and purchase-intelligence
platform designed to help consumers find the better vehicle,
not simply the cheaper vehicle.

DEALER INVENTORY
VECTORI is designed to receive inventory through authorised sources.

Preferred routes:
1. Dealer API / authorised integration
2. Dealer CSV / JSON export
3. Dealer management-system integration
4. Another mutually approved feed
`;

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "VECTORI_Dealer_Brief.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ============================================================
   MODALS
============================================================ */

function openModal(id){
  const modal = document.getElementById(id);
  if(modal) modal.classList.add("open");
}

function closeModal(id){
  const modal = document.getElementById(id);
  if(modal) modal.classList.remove("open");
}

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if(event.target === modal) modal.classList.remove("open");
  });
});

document.addEventListener("keydown", event => {
  if(event.key === "Escape"){
    document.querySelectorAll(".modal.open").forEach(modal => modal.classList.remove("open"));
  }
});

/* ============================================================
   ADVERTISING MANAGER SYSTEM
============================================================ */

const AdManager = {
  campaigns:[
    {id:'CMP-001',company:'AutoFinance Corp',campaign:'Vehicle Finance',formats:['Medium Rectangle','Large Rectangle'],destinationUrl:'#promo-finance',active:true,priority:10,content:'<div class="ad-creative"><b>Finance smarter.</b><span>Compare vehicle costs before you commit.</span><button class="btn btn-primary ad-cta">Explore finance</button></div>'},
    {id:'CMP-002',company:'SecureDrive Insurance',campaign:'Cover',formats:['Half Page'],destinationUrl:'#promo-insurance',active:true,priority:9,content:'<div class="ad-creative ad-tall"><b>Protect the purchase.</b><span>Insurance is part of the real ownership cost.</span><button class="btn btn-secondary ad-cta">Get a quote</button></div>'},
    {id:'CMP-003',company:'AutoTrade Parts',campaign:'Accessories',formats:['Leaderboard','Wide Banner'],destinationUrl:'#promo-parts',active:true,priority:8,content:'<div class="ad-wide"><b>Upgrade your next drive.</b><span>Accessories, tyres and vehicle essentials.</span><button class="btn btn-secondary ad-cta">Shop now</button></div>'},
    {id:'CMP-004',company:'Dealer Partner Network',campaign:'Dealer Growth',formats:['Mobile Banner'],destinationUrl:'#dealer',active:true,priority:7,content:'<div class="ad-mobile"><b>Put your stock in front of ready buyers.</b><button class="btn btn-primary ad-cta">Join VECTORI</button></div>'},
    {id:'CMP-005',company:'RoadSafe Inspections',campaign:'Vehicle checks',formats:['Large Rectangle','Medium Rectangle'],destinationUrl:'#checks',active:true,priority:6,content:'<div class="ad-creative"><b>Check before you buy.</b><span>Service history, inspection and ownership evidence matter.</span><button class="btn btn-secondary ad-cta">Learn more</button></div>'},
    {id:'CMP-006',company:'Mobility Partner',campaign:'Vehicle Marketplace',formats:['Wide Banner','Leaderboard'],destinationUrl:'#mobility',active:true,priority:5,content:'<div class="ad-wide"><b>More choice. Better decisions.</b><span>Discover your next vehicle with confidence.</span><button class="btn btn-primary ad-cta">View offers</button></div>'}
  ],
  tracking:{impressions:{},clicks:{}},
  dims:{'Leaderboard':{h:'90px',mw:'970px'},'Wide Banner':{h:'90px',mw:'728px'},'Medium Rectangle':{h:'250px',mw:'300px'},'Large Rectangle':{h:'280px',mw:'336px'},'Half Page':{h:'600px',mw:'300px'},'Mobile Banner':{h:'100px',mw:'320px'}},
  init(){ document.querySelectorAll('.ad-slot').forEach(slot => this.renderAd(slot, slot.dataset.format)); },
  choose(format){ return this.campaigns.filter(c => c.active && c.formats.includes(format)).sort((a,b) => b.priority - a.priority)[0] || null; },
  renderAd(slot, format){
    const c = this.choose(format);
    const d = this.dims[format] || this.dims['Medium Rectangle'];
    slot.style.height = d.h;
    slot.style.maxWidth = d.mw;
    slot.classList.add('ad-container');
    const id = c ? c.id : 'fallback';
    const href = c ? c.destinationUrl : '#';
    slot.innerHTML = `<div class="ad-label">Advertisement${c?.company ? ' · '+escapeHtml(c.company) : ''}</div>${c ? c.content : `<div class="ad-empty">${escapeHtml(format)}<br>Space available</div>`}`;
    if('IntersectionObserver' in window){
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if(entry.isIntersecting && entry.intersectionRatio >= 0.5){
            this.trackImpression(id);
            observer.disconnect();
          }
        });
      }, { threshold:0.5 });
      observer.observe(slot);
    } else {
      this.trackImpression(id);
    }
    slot.onclick = () => { this.trackClick(id); if(href !== '#') window.location.hash = href.replace('#',''); };
  },
  trackImpression(id){ this.tracking.impressions[id] = (this.tracking.impressions[id] || 0) + 1; },
  trackClick(id){ this.tracking.clicks[id] = (this.tracking.clicks[id] || 0) + 1; }
};

/* ============================================================
   INITIALISE & LOAD DATA
============================================================ */

async function loadInventory(){
  let response=await fetch('./data/inventory.json',{cache:'no-store'});
  let sourceFile='data/inventory.json';
  if(!response.ok){
    response=await fetch('./data/inventory.demo.json',{cache:'no-store'});
    sourceFile='data/inventory.demo.json';
  }
  if(!response.ok) throw new Error(`Inventory request failed (${response.status})`);
  const data=await response.json();
  if(!Array.isArray(data)||data.length===0) throw new Error('Inventory file is empty or invalid.');

  const processed=data.map((v,idx)=>{
    const id=v.id!=null?String(v.id):`ASSET-${idx+1}`;
    const assetType=String(v.assetType||v.vertical||'automotive').toLowerCase();
    const normalized=window.VECTORIAssetEngine?.normalize({...v,assetType}) || v;
    return {
      ...v,...normalized,id,assetType,
      make:displayValue(v.make,displayValue(v.brand,'Unknown Make / Brand')),
      brand:displayValue(v.brand,v.make||''),
      model:displayValue(v.model,v.propertyType||v.itemType||'Unknown Asset'),
      variant:displayValue(v.variant,''),
      year:v.year!=null&&!isNaN(v.year)?Number(v.year):null,
      price:v.price!=null&&!isNaN(v.price)?Number(v.price):null,
      market:v.market!=null&&!isNaN(v.market)?Number(v.market):null,
      mileage:v.mileage!=null&&!isNaN(v.mileage)?Number(v.mileage):(v.km!=null&&!isNaN(v.km)?Number(v.km):null),
      consumption:v.consumption!=null&&!isNaN(v.consumption)?Number(v.consumption):null,
      owners:v.owners!=null&&!isNaN(v.owners)?Number(v.owners):null,
      dealer:v.dealer||v.dealership||v.agent||v.agency||v.jeweller||v.seller||'',
      province:v.province||v.location||v.city||v.suburb||'',
      evidence:v.evidence||'Missing',
      source:v.source || (sourceFile.endsWith('.demo.json') ? 'VECTORI Demo Dataset' : 'Authorised inventory source')
    };
  });
  vehicles.splice(0,vehicles.length,...processed);
  filteredVehicles=[...vehicles];
  return vehicles;
}

function showInventoryError(error){
  const message = error && error.message ? error.message : "The inventory could not be loaded.";
  const count = document.getElementById("resultsCount");
  const results = document.getElementById("vehicleResults");
  if(count) count.textContent = "Inventory unavailable";
  if(results) results.innerHTML = `<div class="notice notice-warning"><strong>Inventory unavailable.</strong><br>${escapeHtml(message)}<br><span class="muted">Check that data/inventory.json was deployed with the site. No vehicle data has been fabricated.</span></div>`;
}

function initMobileNav(){
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primaryNav");
  if(!toggle || !nav) return;
  const close = () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
  document.addEventListener("keydown", event => { if(event.key === "Escape") close(); });
}

function initVehicleSwipe(){
  const container = document.getElementById("vehicleResults");
  if (!container || container.dataset.swipeReady === "true") return;

  let startX = 0;
  let startY = 0;
  let tracking = false;

  container.addEventListener("touchstart", event => {
    if (!event.touches || event.touches.length !== 1) return;
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    tracking = true;
  }, { passive: true });

  container.addEventListener("touchend", event => {
    if (!tracking || !event.changedTouches || event.changedTouches.length !== 1) return;
    tracking = false;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const threshold = 55;

    // Only treat predominantly horizontal gestures as page navigation.
    if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy) * 1.25) return;

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
    if (dx < 0 && currentPage < totalPages) goToPage(currentPage + 1);
    if (dx > 0 && currentPage > 1) goToPage(currentPage - 1);
  }, { passive: true });

  container.dataset.swipeReady = "true";
}


/* ============================================================
   VECTORI 2.0 — OUTCOME ENGINE UI BRIDGE
============================================================ */
function getNum(id, fallback=null){ const el=document.getElementById(id); if(!el) return fallback; const v=parseFloat(el.value); return Number.isFinite(v)?v:fallback; }
function moduleState(){ return { automotive: document.getElementById('moduleAuto')?.checked !== false, insurance: document.getElementById('moduleInsurance')?.checked !== false, finance: document.getElementById('moduleFinance')?.checked !== false }; }
function buildOutcomeInput(vehicle){
  const modules=moduleState();
  return {
    modules,
    price:getNum('calcPrice',vehicle?.price), market:getNum('calcMarket',vehicle?.market), futureValue:getNum('calcFutureValue',null),
    monthlyKm:getNum('calcKm',1500), fuelPrice:getNum('calcFuel',26.92), consumption:getNum('calcConsumption',vehicle?.consumption),
    maintenancePerKm:getNum('calcMaintenance',0.8), tyreCost:getNum('calcTyreCost',5000), tyreLife:getNum('calcTyreLife',50000), licenceAnnual:getNum('calcLicence',1800),
    servicePlanMonthly:getNum('calcServicePlan',0), tollsMonthly:getNum('calcTolls',0), parkingMonthly:getNum('calcParking',0), otherVehicleMonthly:getNum('calcOtherVehicle',0),
    tradeIn:getNum('calcTradeIn',0), deposit:getNum('calcDeposit',30000), rate:getNum('calcInterest',12.5), term:getNum('calcTerm',72),
    balloonPct:getNum('calcBalloonPct',0), gfvAmount:getNum('calcGfvAmount',null), monthlyFee:getNum('calcAdminFee',69), initiationFee:getNum('calcInitiationFee',0),
    financeType:document.getElementById('calcFinanceType')?.value || 'instalment_sale',
    premiumMonthly:getNum('calcInsurance',1500), excess:getNum('calcInsuranceExcess',0), shortfallCoverMonthly:getNum('calcShortfall',0), creditProtectionMonthly:getNum('calcCreditProtection',0), otherInsuranceMonthly:getNum('calcOtherInsurance',0),
    netIncome:getNum('calcIncome',35000), existingDebt:getNum('calcDebt',3000), livingCosts:getNum('calcLiving',18000), horizon:getNum('calcHorizon',60), otherUpfront:0
  };
}
function evidenceBadge(status){ const map={OBSERVED:'Observed',CALCULATED:'Calculated','USER PROVIDED':'User supplied',ASSUMED:'Assumed',ESTIMATED:'Estimated',MISSING:'Missing'}; return `<span class="evidence-pill evidence-${status.toLowerCase().replace(/\s+/g,'-')}">${map[status]||status}</span>`; }
function calculate(vehicle){
  if(!vehicle) return {errors:['Select a vehicle before running the outcome.']};
  const input=buildOutcomeInput(vehicle);
  const errors=[];
  if(input.modules.automotive && (!Number.isFinite(input.price)||input.price<=0)) errors.push('A valid vehicle price is required for automotive analysis.');
  if(input.modules.automotive && (!Number.isFinite(input.consumption)||input.consumption<=0)) errors.push('Fuel/energy consumption is missing. Supply a verified figure before treating the automotive outcome as complete.');
  if(input.modules.finance && (!Number.isFinite(input.rate)||input.rate<0)) errors.push('A finance/profit rate is required for finance modelling.');
  if(input.modules.finance && (!Number.isFinite(input.term)||input.term<=0)) errors.push('A finance term is required.');
  if(input.modules.insurance && (!Number.isFinite(input.premiumMonthly)||input.premiumMonthly<0)) errors.push('An insurance premium is required for insurance modelling.');
  if(errors.length) return {errors,input};
  const outcome=window.VECTORIOutcomeEngine.customerOutcome(input);
  outcome.vehicle=vehicle; outcome.input=input; outcome.validation=window.VECTORIOutcomeEngine.validateResult(outcome);
  return {errors:[],...outcome};
}
function modelledBurden(v){
  if(!v) return Infinity;
  const result=calculate(v); return result.errors.length?Infinity:result.monthlyCashOutflow;
}
function renderDecision(result){
  const panel=document.getElementById('decisionPanel'); if(!panel) return;
  if(result.errors?.length){ panel.innerHTML=`<div class="warning-list">${result.errors.map(e=>`<div class="warning">${escapeHtml(e)}</div>`).join('')}</div>`; return; }
  const e=result;
  const evidenceMissing=e.evidence?.filter(x=>x.status==='MISSING')||[];
  const income=Number.isFinite(e.input.netIncome)?e.input.netIncome:NaN;
  const remaining=Number.isFinite(e.cashRemaining)?e.cashRemaining:NaN;
  const outcomeStatus=evidenceMissing.length?'INCOMPLETE EVIDENCE':'MODEL COMPLETE FOR SUPPLIED INPUTS';
  panel.innerHTML=`
    <div class="outcome-status">${outcomeStatus}</div>
    <h3>${escapeHtml(vehicleLabel(e.vehicle))}</h3>
    <div class="outcome-headline"><span>Monthly real cash exposure</span><strong>${money(e.monthlyCashOutflow)}</strong></div>
    <div class="outcome-metrics">
      <div><span>Horizon cash outflow</span><strong>${money(e.cashOutflowHorizon)}</strong></div>
      <div><span>Economic cost</span><strong>${Number.isFinite(e.economicCost)?money(e.economicCost):'Insufficient exit value'}</strong></div>
      <div><span>Net equity at horizon</span><strong>${Number.isFinite(e.netEquity)?money(e.netEquity):'Insufficient exit value'}</strong></div>
      <div><span>Cash remaining / month</span><strong>${Number.isFinite(remaining)?money(remaining):'Insufficient income'}</strong></div>
      <div><span>Vehicle/cover cash ratio</span><strong>${Number.isFinite(e.affordabilityRatio)?pct(e.affordabilityRatio):'Insufficient income'}</strong></div>
      <div><span>Evidence completeness</span><strong>${e.evidenceCompleteness}%</strong></div>
    </div>
    <div class="outcome-breakdown">
      <div><strong>Automotive</strong><span>${e.automotive?money(e.automotive.operatingMonthly)+' / month':'Not selected'}</span></div>
      <div><strong>Finance</strong><span>${e.finance?money(e.finance.monthlyPayment)+' / month':'Not selected'}</span></div>
      <div><strong>Insurance</strong><span>${e.insurance?money(e.insurance.monthly)+' / month':'Not selected'}</span></div>
    </div>
    <div class="scenario-row">
      <button class="scenario-btn" onclick="runOutcomeScenario('stress')">Stress view</button>
      <button class="scenario-btn" onclick="runOutcomeScenario('downside')">Downside view</button>
    </div>
    <div class="status-box"><strong>Evidence ledger</strong><br><br>${e.evidence.length?e.evidence.map(x=>`${evidenceBadge(x.status)} ${escapeHtml(x.label)}`).join(' &nbsp; '):'All required inputs supplied.'}</div>
    <p class="small muted">${income?`The cash-remaining figure is a user-input cash-flow model, not a lender affordability assessment.`:''} Economic cost depends on the supplied future/exit asset value and should be treated as a scenario, not a guaranteed market result.</p>
  `;
}
function runOutcomeScenario(kind){
  const calcEl=document.getElementById('calcVehicle'); const vehicle=vehicles.find(v=>v.id===calcEl?.value); if(!vehicle)return;
  const base=buildOutcomeInput(vehicle); const patch=kind==='stress'?{rate:(base.rate||0)+1,monthlyKm:(base.monthlyKm||0)*1.15,fuelPrice:(base.fuelPrice||0)*1.1,premiumMonthly:(base.premiumMonthly||0)*1.1,maintenancePerKm:(base.maintenancePerKm||0)*1.1}:{rate:(base.rate||0)+2,monthlyKm:(base.monthlyKm||0)*1.3,fuelPrice:(base.fuelPrice||0)*1.2,premiumMonthly:(base.premiumMonthly||0)*1.2,maintenancePerKm:(base.maintenancePerKm||0)*1.25};
  const out=window.VECTORIOutcomeEngine.customerOutcome({...base,...patch}); const panel=document.getElementById('decisionPanel');
  const title=kind==='stress'?'STRESS SCENARIO':'DOWNSIDE SCENARIO';
  panel.insertAdjacentHTML('afterbegin',`<div class="scenario-banner"><strong>${title}</strong><span>${money(out.monthlyCashOutflow)} monthly cash exposure · ${money(out.cashOutflowHorizon)} horizon cash outflow</span></div>`);
}
function runCalculator(){
  const calcEl=document.getElementById('calcVehicle'); if(!calcEl)return; const vehicle=vehicles.find(v=>v.id===calcEl.value); const output=document.getElementById('calcOutputs');
  if(!vehicle){if(output)output.innerHTML='<div class="empty-state">Select a vehicle first.</div>';return;}
  const result=calculate(vehicle); if(!output)return;
  if(result.errors?.length){output.innerHTML=`<div class="warning-list">${result.errors.map(e=>`<div class="warning">${escapeHtml(e)}</div>`).join('')}</div>`; renderDecision(result); return;}
  output.innerHTML=`
    <div class="big-output"><span>Real-world monthly cash exposure</span><strong>${money(result.monthlyCashOutflow)}</strong></div>
    <div class="output-card"><span>Horizon cash outflow</span><strong>${money(result.cashOutflowHorizon)}</strong></div>
    <div class="output-card"><span>Economic cost</span><strong>${Number.isFinite(result.economicCost)?money(result.economicCost):'Supply exit value'}</strong></div>
    <div class="output-card"><span>Expected asset value</span><strong>${Number.isFinite(result.assetValue)?money(result.assetValue):'Missing'}</strong></div>
    <div class="output-card"><span>Finance balance at horizon</span><strong>${money(result.financeBalanceAtHorizon)}</strong></div>
    <div class="output-card"><span>Net equity at horizon</span><strong>${Number.isFinite(result.netEquity)?money(result.netEquity):'Missing'}</strong></div>
    <div class="output-card"><span>Monthly automotive operating cost</span><strong>${result.automotive?money(result.automotive.operatingMonthly):'Not selected'}</strong></div>
    <div class="output-card"><span>Monthly finance payment</span><strong>${result.finance?money(result.finance.monthlyPayment):'Not selected'}</strong></div>
    <div class="output-card"><span>Monthly insurance exposure</span><strong>${result.insurance?money(result.insurance.monthly):'Not selected'}</strong></div>
    <div class="output-card"><span>Contingent insurance excess</span><strong>${result.insurance?money(result.contingentInsuranceExposure):'Not selected'}</strong></div>
    <div class="output-card"><span>Cash remaining after stated costs</span><strong>${Number.isFinite(result.cashRemaining)?money(result.cashRemaining):'Insufficient data'}</strong></div>
  `;
  renderDecision(result);
}
function printReport(){
  const calcEl=document.getElementById('calcVehicle'); const vehicle=vehicles.find(v=>v.id===calcEl?.value); if(!vehicle){alert('Select a vehicle and run the outcome first.');return;}
  const result=calculate(vehicle); if(result.errors?.length){alert('Resolve the required inputs before printing.');return;}
  const html=`<!doctype html><html><head><title>VECTORI Real-World Outcome</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#111}table{border-collapse:collapse;width:100%}td{padding:8px;border-bottom:1px solid #ddd}</style></head><body><h1>VECTORI</h1><h2>${escapeHtml(vehicleLabel(vehicle))}</h2><p>Real-world outcome analysis — version ${window.VECTORIOutcomeEngine.version}</p><table><tr><td>Monthly cash exposure</td><td>${money(result.monthlyCashOutflow)}</td></tr><tr><td>Horizon cash outflow</td><td>${money(result.cashOutflowHorizon)}</td></tr><tr><td>Economic cost</td><td>${Number.isFinite(result.economicCost)?money(result.economicCost):'Insufficient exit value'}</td></tr><tr><td>Net equity</td><td>${Number.isFinite(result.netEquity)?money(result.netEquity):'Insufficient exit value'}</td></tr><tr><td>Evidence completeness</td><td>${result.evidenceCompleteness}%</td></tr></table><p>This is analytical decision support, not a lender approval, insurance quote, regulated advice or guarantee.</p></body></html>`;
  const w=window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank'); if(w)w.onload=()=>setTimeout(()=>w.print(),300);
}


/* ============================================================
   VECTORI PLATFORM WEAVE + MULTI-DEALER DISTRIBUTION
============================================================ */

function diversifyListings(list, limit){
  if(!window.VECTORIListingUtils) return (list || []).slice(0, limit);
  const explicitDealer = document.getElementById('filterDealer')?.value;
  return window.VECTORIListingUtils.diversifyByDealer(list, limit, {disable:Boolean(explicitDealer)});
}

function renderDealerMix(list){
  const el=document.getElementById('dealerMixSummary');
  if(!el) return;
  const audit=window.VECTORIListingUtils?.distributionAudit(list, itemsPerPage);
  if(!audit || !audit.mix.length){ el.textContent='No listings available for this selection.'; return; }
  const labels=audit.mix.map(x=>`${escapeHtml(x.dealer)} · ${x.count}`).join('  •  ');
  el.innerHTML=`<div class="dealer-mix-bar"><span class="dealer-mix-label">Dealer mix</span><span>${labels}</span><span class="dealer-mix-note">Results are interleaved across available dealers; an explicit dealer filter remains exclusive.</span></div>`;
}

function wovenAdMarkup(index){
  const format=index % 2 === 0 ? 'Medium Rectangle' : 'Large Rectangle';
  const side=index % 2 === 0 ? 'ad-shift-right' : 'ad-shift-left';
  return `<div class="woven-ad ${side}" aria-label="Sponsored placement"><div class="ad-slot" data-format="${format}"></div></div>`;
}

function refreshWovenAds(){
  if(!window.AdManager) return;
  document.querySelectorAll('#vehicleResults .woven-ad .ad-slot').forEach(slot=>{
    const format=slot.dataset.format || 'Medium Rectangle';
    window.AdManager.renderAd(slot, format);
  });
}

function renderMarketStream(pageList){
  const items=[];
  pageList.forEach((vehicle,index)=>{
    items.push(vehicleCard(vehicle));
    if((index+1)%3===0){
      items.push(wovenAdMarkup(Math.floor(index/3)));
    }
  });
  return items.join('');
}

function renderVehicles(list){
  const container = document.getElementById('vehicleResults');
  const countEl = document.getElementById('resultsCount');
  if(!container) return;

  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const rawPageList = list.slice(start, end);
  const pageList = diversifyListings(rawPageList, itemsPerPage);

  if (countEl) {
    countEl.textContent = totalItems > 0
      ? `Showing ${start + 1}–${Math.min(end, totalItems)} of ${totalItems} listings (Page ${currentPage} of ${totalPages})`
      : '0 listings found';
  }

  renderDealerMix(pageList);

  if(!totalItems){
    container.innerHTML = `<div class="empty-state">No listings match the selected criteria.</div>`;
    renderPagination(0,1);
    return;
  }

  container.innerHTML = renderMarketStream(pageList);
  renderPagination(totalItems,totalPages);
  refreshWovenAds();
}

function populateFilters(){
  const assetTypes=[...new Set(vehicles.map(v=>v.assetType || 'automotive'))].filter(Boolean).sort();
  const makes=[...new Set(vehicles.map(v=>v.make || v.brand))].filter(Boolean).sort();
  const models=[...new Set(vehicles.map(v=>v.model || v.propertyType || v.itemType))].filter(Boolean).sort();
  const dealers=[...new Set(vehicles.map(v=>displayValue(v.dealer)))].filter(v=>v!=='N/A').sort();
  const provinces=[...new Set(vehicles.map(v=>v.province || v.location))].filter(Boolean).sort();

  const assetSelect=document.getElementById('filterAssetType');
  if(assetSelect){
    assetSelect.innerHTML='<option value="">All asset markets</option>'+assetTypes.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v==='fine_jewellery'?'Fine Jewellery':v[0].toUpperCase()+v.slice(1))}</option>`).join('');
  }
  populateSelect('filterMake',makes,'All makes / brands');
  populateSelect('filterModel',models,'All models / types');
  populateSelect('filterDealer',dealers,'All dealers / agents');
  populateSelect('filterProvince',provinces,'All provinces / locations');

  const calc=document.getElementById('calcVehicle');
  if(calc) calc.innerHTML='<option value="">Select listing</option>'+vehicles.filter(v=>(v.assetType||'automotive')==='automotive').map(v=>`<option value="${escapeHtml(v.id)}">${escapeHtml(vehicleLabel(v))}</option>`).join('');
}

function applyFilters(){
  const assetType=document.getElementById('filterAssetType')?.value || '';
  const make=document.getElementById('filterMake').value;
  const model=document.getElementById('filterModel').value;
  const search=document.getElementById('filterSearch').value.trim().toLowerCase();
  const dealer=document.getElementById('filterDealer').value;
  const province=document.getElementById('filterProvince').value;
  const maxPrice=parseFloat(document.getElementById('filterMaxPrice').value);
  const maxMileage=parseFloat(document.getElementById('filterMaxMileage').value);
  const sort=document.getElementById('filterSort').value;

  filteredVehicles=vehicles.filter(v=>{
    const type=v.assetType || 'automotive';
    if(assetType && type!==assetType) return false;
    if(make && (v.make || v.brand)!==make) return false;
    if(model && (v.model || v.propertyType || v.itemType)!==model) return false;
    if(dealer && displayValue(v.dealer)!==dealer) return false;
    if(province && (v.province || v.location)!==province) return false;
    if(isFinite(maxPrice) && Number.isFinite(v.price) && v.price>maxPrice) return false;
    if(isFinite(maxMileage) && Number.isFinite(v.mileage) && v.mileage>maxMileage) return false;
    if(search){
      const text=[vehicleLabel(v),v.make,v.brand,v.model,v.propertyType,v.itemType,v.variant,v.fuel,v.transmission,v.dealer,v.province,v.location,v.listingId].filter(Boolean).join(' ').toLowerCase();
      if(!text.includes(search)) return false;
    }
    return true;
  });

  filteredVehicles.sort((a,b)=>{
    if(sort==='price') return (Number.isFinite(a.price)?a.price:Infinity)-(Number.isFinite(b.price)?b.price:Infinity);
    if(sort==='km') return (Number.isFinite(a.mileage)?a.mileage:Infinity)-(Number.isFinite(b.mileage)?b.mileage:Infinity);
    if(sort==='year') return (Number.isFinite(b.year)?b.year:-Infinity)-(Number.isFinite(a.year)?a.year:-Infinity);
    if(sort==='deal'){
      const ad=Number.isFinite(a.market)&&a.market>0&&Number.isFinite(a.price)?(a.price-a.market)/a.market:Infinity;
      const bd=Number.isFinite(b.market)&&b.market>0&&Number.isFinite(b.price)?(b.price-b.market)/b.market:Infinity;
      return ad-bd;
    }
    if(sort==='burden') return modelledBurden(a)-modelledBurden(b);
    return decisionScore(b)-decisionScore(a);
  });

  currentPage=1;
  renderVehicles(filteredVehicles);
}

function resetFilters(){
  ['filterAssetType','filterMake','filterModel','filterSearch','filterDealer','filterProvince','filterMaxPrice','filterMaxMileage'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const sort=document.getElementById('filterSort');if(sort)sort.value='best';
  filteredVehicles=[...vehicles]; currentPage=1; renderVehicles(filteredVehicles);
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    try {
      initMobileNav();
      initVehicleSwipe();
      await loadInventory();
      populateFilters();
      renderVehicles(vehicles);
      renderComparison();
      AdManager.init();
      refreshWovenAds();

      const calcEl = document.getElementById("calcVehicle");
      if (calcEl && vehicles.length > 0) {
        calcEl.value = vehicles[0].id;
        loadCalculatorVehicle();
      }

    } catch(error) {
      console.error("VECTORI inventory load failed", error);
      showInventoryError(error);
    }
  }
);
/* ============================================================
   VECTORI 2.2 — TRUE MULTI-ASSET MARKETPLACE + WOVEN ADS
   Final overrides intentionally sit after legacy functions so the
   current codebase can evolve without removing the earlier demo logic.
============================================================ */
let vectoriSelectedAssetType = '';

function assetTypeLabel(type){
  return type === 'property' ? 'Property' : type === 'fine_jewellery' ? 'Fine Jewellery' : 'Automotive';
}
function assetProviderLabel(v){
  const type=v?.assetType||'automotive';
  return type==='property' ? (v.agent||v.agency||v.dealer||'Property practitioner') : type==='fine_jewellery' ? (v.jeweller||v.seller||v.dealer||'Jeweller') : (v.dealer||v.dealership||'Dealer');
}
function assetTitle(v){
  if(!v) return 'Unknown asset';
  if(v.title) return v.title;
  if((v.assetType||'automotive')==='property') return [v.propertyType,v.suburb,v.city].filter(Boolean).join(' • ') || 'Property listing';
  if((v.assetType||'automotive')==='fine_jewellery') return [v.brand,v.itemType,v.reference].filter(Boolean).join(' • ') || 'Fine jewellery listing';
  return [v.year,v.make,v.model].filter(Boolean).join(' ') || 'Vehicle listing';
}
function assetReferenceValue(v){
  return Number.isFinite(v?.valuation) ? v.valuation : Number.isFinite(v?.market) ? v.market : null;
}

function vehicleCard(v){
  const position=marketPosition(v);
  const selected=comparison.includes(v.id);
  const type=v.assetType||'automotive';
  const isAuto=type==='automotive';
  const isProperty=type==='property';
  const meta=isAuto
    ? `<span class="tag">${escapeHtml(yearLabel(v))}</span><span class="tag">${Number.isFinite(v.mileage)?`${number(v.mileage)} km`:'Mileage not supplied'}</span><span class="tag">${escapeHtml(displayValue(v.fuel))}</span>`
    : isProperty
      ? `<span class="tag">${escapeHtml(displayValue(v.propertyType,'Property'))}</span><span class="tag">${escapeHtml(displayValue(v.suburb,displayValue(v.city)))}</span>`
      : `<span class="tag">${escapeHtml(displayValue(v.itemType,'Jewellery'))}</span><span class="tag">${escapeHtml(displayValue(v.brand,'Brand not supplied'))}</span>`;
  const secondary = isAuto
    ? `Market reference ${Number.isFinite(v.market)?money(v.market):'Missing'}`
    : isProperty
      ? `Reference ${Number.isFinite(v.market)?money(v.market):'Missing'}`
      : `Valuation ${Number.isFinite(v.valuation)?money(v.valuation):'Missing'}`;
  return `
    <article class="vehicle-card asset-card asset-card-${type}">
      <div class="vehicle-image">${vehicleSvg(v)}</div>
      <div class="vehicle-info">
        <div class="vehicle-top"><div><div class="vehicle-title">${escapeHtml(assetTitle(v))}</div><div class="vehicle-variant">${escapeHtml(type==='automotive'?(v.variant||''):type==='property'?(v.propertyType||''):(v.reference||''))}</div></div></div>
        <div class="vehicle-meta"><span class="asset-badge">${assetTypeLabel(type)}</span>${meta}</div>
        <div class="vehicle-dealer-badge">${escapeHtml(assetProviderLabel(v))}</div>
        <div class="vehicle-description">${escapeHtml(v.description||'')}</div>
        <div class="vehicle-data">
          <div class="data-box"><span>Provider</span><strong>${escapeHtml(assetProviderLabel(v))}</strong></div>
          <div class="data-box"><span>Location</span><strong>${escapeHtml(displayValue(v.province,displayValue(v.location)))}</strong></div>
          <div class="data-box"><span>${isProperty?'Reference value':isAuto?'Market reference':'Current valuation'}</span><strong>${escapeHtml(secondary.replace(/^Market reference |^Reference |^Valuation /,''))}</strong></div>
          <div class="data-box"><span>Evidence</span><strong>${escapeHtml(v.evidence||'Missing')}</strong></div>
        </div>
        <div class="small muted" style="margin-top:10px">Source: ${escapeHtml(displayValue(v.source,'VECTORI Database'))}${v.sourceUrl?` • <a href="${escapeHtml(v.sourceUrl)}" target="_blank" rel="noopener noreferrer">View source listing</a>`:''}</div>
      </div>
      <div class="vehicle-side">
        <div><div class="price">${money(v.price)}</div><div class="market ${position.className}">${position.label}</div></div>
        <div class="asset-card-actions">
          <button class="btn btn-compare ${selected?'is-selected':''}" type="button" aria-pressed="${selected?'true':'false'}" onclick="toggleComparison('${escapeHtml(v.id)}',${selected?'false':'true'})">${selected?'✓ Compared':'＋ Add to Compare'}</button>
          <button class="btn btn-secondary" type="button" onclick="analyseVehicle('${escapeHtml(v.id)}')">Run ${assetTypeLabel(type).toLowerCase()} intelligence</button>
        </div>
      </div>
    </article>`;
}

function wovenAdMarkup(index){
  const format='Medium Rectangle';
  const side=index % 2 === 0 ? 'woven-ad-right' : 'woven-ad-left';
  return `<div class="woven-ad ${side}" aria-label="Sponsored advertisement"><div class="ad-slot" data-format="${format}" data-vertical="${escapeHtml(vectoriSelectedAssetType||'all')}" data-ad-slot-index="${index}"></div></div>`;
}

function refreshWovenAds(){
  if(!window.AdManager) return;
  document.querySelectorAll('#vehicleResults .woven-ad .ad-slot').forEach(slot=>{
    window.AdManager.renderAd(slot, slot.dataset.format || 'Medium Rectangle', slot.dataset.vertical || vectoriSelectedAssetType || 'all');
  });
}

function populateFilters(){
  const types=[...new Set(vehicles.map(v=>v.assetType||'automotive'))].filter(Boolean);
  const activeType=document.getElementById('filterAssetType')?.value || vectoriSelectedAssetType || '';
  const pool=activeType ? vehicles.filter(v=>(v.assetType||'automotive')===activeType) : vehicles;
  const makes=[...new Set(pool.map(v=>v.make||v.brand))].filter(Boolean).sort();
  const models=[...new Set(pool.map(v=>v.model||v.propertyType||v.itemType))].filter(Boolean).sort();
  const dealers=[...new Set(pool.map(v=>assetProviderLabel(v)))].filter(Boolean).sort();
  const provinces=[...new Set(pool.map(v=>v.province||v.location))].filter(Boolean).sort();
  const assetSelect=document.getElementById('filterAssetType');
  if(assetSelect){
    assetSelect.innerHTML='<option value="">All asset markets</option>'+types.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(assetTypeLabel(v))}</option>`).join('');
    assetSelect.value=activeType;
  }
  populateSelect('filterMake',makes,'All brands / agencies');
  populateSelect('filterModel',models,'All models / property / items');
  populateSelect('filterDealer',dealers,'All dealers / agents / jewellers');
  populateSelect('filterProvince',provinces,'All provinces / locations');
  const calc=document.getElementById('calcVehicle');
  if(calc){
    calc.innerHTML='<option value="">Select listing</option>'+pool.map(v=>`<option value="${escapeHtml(v.id)}">${escapeHtml(assetTitle(v))} — ${escapeHtml(assetProviderLabel(v))}</option>`).join('');
  }
  const mileageField=document.getElementById('mileageFilterField');
  if(mileageField) mileageField.hidden=activeType && activeType!=='automotive';
}

function selectAssetMarket(type){
  vectoriSelectedAssetType=type||'';
  const select=document.getElementById('filterAssetType'); if(select) select.value=vectoriSelectedAssetType;
  document.querySelectorAll('[data-asset-tab]').forEach(btn=>btn.classList.toggle('is-active',(btn.dataset.assetTab||'')===vectoriSelectedAssetType));
  populateFilters();
  applyFilters();
  const first=filteredVehicles[0];
  if(first){ setCalculatorAsset(first); }
}

function diversifyListings(list, limit){
  const explicitDealer=document.getElementById('filterDealer')?.value;
  if(explicitDealer || !window.VECTORIListingUtils) return (list||[]).slice(0,limit);
  return window.VECTORIListingUtils.diversifyByDealer(list, Math.min(limit,list.length));
}

function renderDealerMix(list){
  const el=document.getElementById('dealerMixSummary'); if(!el) return;
  const audit=window.VECTORIListingUtils?.distributionAudit(list,itemsPerPage);
  if(!audit||!audit.mix.length){el.textContent='No provider inventory available for this selection.';return;}
  const labels=audit.mix.map(x=>`<span class="dealer-mix-pill">${escapeHtml(x[0])} · ${x[1]}</span>`).join('');
  el.innerHTML=`<div class="dealer-mix-bar"><span class="dealer-mix-label">Provider distribution</span>${labels}<span class="dealer-mix-note">Interleaved across available providers; explicit provider filters remain exclusive.</span></div>`;
}

function renderMarketStream(pageList){
  const items=[];
  // Row 1: 3 listings + 1 ad. Row 2: 1 ad + 3 listings.
  // Across the two rows this is exactly 6 listing slots / 2 ad slots = 75/25.
  pageList.slice(0,3).forEach(v=>items.push(vehicleCard(v)));
  if(pageList.length>3) items.push(wovenAdMarkup(0));
  if(pageList.length>3) items.push(wovenAdMarkup(1));
  pageList.slice(3,6).forEach(v=>items.push(vehicleCard(v)));
  if(pageList.length<=3 && pageList.length>0) items.push(wovenAdMarkup(1));
  return items.join('');
}

function renderVehicles(list){
  const container=document.getElementById('vehicleResults'); const countEl=document.getElementById('resultsCount'); if(!container)return;
  const explicitDealer=document.getElementById('filterDealer')?.value;
  const distributed=explicitDealer ? list.slice() : (window.VECTORIListingUtils ? window.VECTORIListingUtils.diversifyByDealer(list,list.length) : list.slice());
  const totalItems=distributed.length; const totalPages=Math.ceil(totalItems/itemsPerPage)||1;
  if(currentPage>totalPages) currentPage=totalPages; if(currentPage<1)currentPage=1;
  const start=(currentPage-1)*itemsPerPage; const pageList=distributed.slice(start,start+itemsPerPage);
  if(countEl) countEl.textContent=totalItems?`Showing ${start+1}–${Math.min(start+pageList.length,totalItems)} of ${totalItems} listings · Page ${currentPage} of ${totalPages}`:'0 listings found';
  renderDealerMix(pageList);
  if(!totalItems){container.innerHTML='<div class="empty-state">No listings match the selected criteria.</div>';renderPagination(0,1);return;}
  container.innerHTML=renderMarketStream(pageList);
  renderPagination(totalItems,totalPages); refreshWovenAds();
}

function applyFilters(){
  const assetType=document.getElementById('filterAssetType')?.value||'';
  vectoriSelectedAssetType=assetType;
  const make=document.getElementById('filterMake')?.value||''; const model=document.getElementById('filterModel')?.value||'';
  const search=(document.getElementById('filterSearch')?.value||'').trim().toLowerCase(); const dealer=document.getElementById('filterDealer')?.value||'';
  const province=document.getElementById('filterProvince')?.value||''; const maxPrice=parseFloat(document.getElementById('filterMaxPrice')?.value); const maxMileage=parseFloat(document.getElementById('filterMaxMileage')?.value);
  const sort=document.getElementById('filterSort')?.value||'best';
  filteredVehicles=vehicles.filter(v=>{
    const type=v.assetType||'automotive';
    if(assetType&&type!==assetType)return false;
    if(make&&(v.make||v.brand)!==make)return false;
    if(model&&(v.model||v.propertyType||v.itemType)!==model)return false;
    if(dealer&&assetProviderLabel(v)!==dealer)return false;
    if(province&&(v.province||v.location)!==province)return false;
    if(Number.isFinite(maxPrice)&&Number.isFinite(v.price)&&v.price>maxPrice)return false;
    if(Number.isFinite(maxMileage)&&type==='automotive'&&Number.isFinite(v.mileage)&&v.mileage>maxMileage)return false;
    if(search){const text=[assetTitle(v),v.make,v.brand,v.model,v.propertyType,v.itemType,v.variant,v.fuel,v.transmission,assetProviderLabel(v),v.province,v.location,v.listingId,v.reference].filter(Boolean).join(' ').toLowerCase();if(!text.includes(search))return false;}
    return true;
  });
  filteredVehicles.sort((a,b)=>{
    if(sort==='price')return (Number.isFinite(a.price)?a.price:Infinity)-(Number.isFinite(b.price)?b.price:Infinity);
    if(sort==='year')return (Number.isFinite(b.year)?b.year:-Infinity)-(Number.isFinite(a.year)?a.year:-Infinity);
    if(sort==='deal'){const ad=Number.isFinite(a.market)&&a.market>0&&Number.isFinite(a.price)?(a.price-a.market)/a.market:Infinity;const bd=Number.isFinite(b.market)&&b.market>0&&Number.isFinite(b.price)?(b.price-b.market)/b.market:Infinity;return ad-bd;}
    if(sort==='burden')return modelledBurden(a)-modelledBurden(b);
    return 0;
  });
  currentPage=1; renderVehicles(filteredVehicles);
}
function resetFilters(){
  ['filterAssetType','filterMake','filterModel','filterSearch','filterDealer','filterProvince','filterMaxPrice','filterMaxMileage'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const sort=document.getElementById('filterSort');if(sort)sort.value='best'; vectoriSelectedAssetType=''; document.querySelectorAll('[data-asset-tab]').forEach(btn=>btn.classList.toggle('is-active',(btn.dataset.assetTab||'')==='')); populateFilters(); filteredVehicles=[...vehicles]; currentPage=1; renderVehicles(filteredVehicles);
}

function setCalculatorAsset(v){
  if(!v)return; const type=v.assetType||'automotive'; const calc=document.getElementById('calcVehicle'); if(calc){populateFilters();calc.value=v.id;}
  vectoriSelectedAssetType=type;
  const label=document.getElementById('selectedAssetModuleLabel'); if(label)label.textContent=assetTypeLabel(type);
  const title=document.getElementById('outcomeProfileTitle'); if(title)title.textContent=`${assetTypeLabel(type)} profile`;
  const help=document.getElementById('outcomeProfileHelp'); if(help)help.textContent=type==='automotive'?'Vehicle operating, finance and insurance inputs.':type==='property'?'Property acquisition, holding, finance, insurance and exit inputs.':'Fine jewellery acquisition, protection, holding, finance and resale inputs.';
  document.getElementById('autoFields').hidden=type!=='automotive'; document.getElementById('propertyFields').hidden=type!=='property'; document.getElementById('jewelleryFields').hidden=type!=='fine_jewellery';
  const set=(id,val)=>{const el=document.getElementById(id);if(el&&val!==undefined&&val!==null)el.value=val;};
  set('calcPrice',v.price); set('calcMarket',v.market); set('calcFutureValue',v.futureValue); set('calcTradeIn',0);
  if(type==='automotive'){set('calcConsumption',v.consumption);}
  if(type==='property'){set('calcFutureValue',v.futureValue);set('calcMarket',v.market);set('calcTransferCosts',v.transferCosts||0);set('calcBondRegistration',v.bondRegistration||0);}
  if(type==='fine_jewellery'){set('calcValuation',v.valuation);set('calcFutureValue',v.futureValue);}
}
function loadCalculatorVehicle(){const id=document.getElementById('calcVehicle')?.value;const v=vehicles.find(x=>x.id===id);if(v)setCalculatorAsset(v);}
function analyseVehicle(id){const v=vehicles.find(x=>x.id===id);if(!v)return;setCalculatorAsset(v);document.getElementById('intelligence')?.scrollIntoView({behavior:'smooth',block:'start'});}

function moduleState(){return {asset:true,automotive:true,insurance:document.getElementById('moduleInsurance')?.checked!==false,finance:document.getElementById('moduleFinance')?.checked!==false};}
function buildOutcomeInput(vehicle){
  const type=vehicle?.assetType||vectoriSelectedAssetType||'automotive';
  return {
    assetType:type, modules:moduleState(), price:getNum('calcPrice',vehicle?.price), market:getNum('calcMarket',vehicle?.market), futureValue:getNum('calcFutureValue',null), tradeIn:getNum('calcTradeIn',0), horizon:getNum('calcHorizon',60),
    monthlyKm:getNum('calcKm',1500), fuelPrice:getNum('calcFuel',26.92), consumption:getNum('calcConsumption',vehicle?.consumption), maintenancePerKm:getNum('calcMaintenance',0.8), tyreCost:getNum('calcTyreCost',5000), tyreLife:getNum('calcTyreLife',50000), licenceAnnual:getNum('calcLicence',1800), servicePlanMonthly:getNum('calcServicePlan',0), tollsMonthly:getNum('calcTolls',0), parkingMonthly:getNum('calcParking',0), otherVehicleMonthly:getNum('calcOtherVehicle',0),
    transferCosts:getNum('calcTransferCosts',0), bondRegistration:getNum('calcBondRegistration',0), ratesMonthly:getNum('calcRates',0), leviesMonthly:getNum('calcLevies',0), propertyMaintenanceMonthly:getNum('calcPropertyMaintenance',0), utilitiesMonthly:getNum('calcUtilities',0), propertyInsuranceMonthly:getNum('calcPropertyInsurance',0), rentalIncomeMonthly:getNum('calcRentalIncome',0), otherPropertyMonthly:getNum('calcOtherProperty',0), saleCosts:getNum('calcSaleCosts',0),
    valuation:getNum('calcValuation',null), jewelleryInsuranceMonthly:getNum('calcJewelleryInsurance',0), storageMonthly:getNum('calcStorage',0), valuationCost:getNum('calcValuationCost',0), jewelleryMaintenanceMonthly:getNum('calcJewelleryMaintenance',0), otherJewelleryMonthly:getNum('calcOtherJewellery',0), resaleCosts:getNum('calcResaleCosts',0),
    financeType:document.getElementById('calcFinanceType')?.value||'instalment_sale', rate:getNum('calcInterest',12.5), term:getNum('calcTerm',72), deposit:getNum('calcDeposit',0), balloonPct:getNum('calcBalloonPct',0), gfvAmount:getNum('calcGfvAmount',null), monthlyFee:getNum('calcAdminFee',0), initiationFee:getNum('calcInitiationFee',0), extras:type==='property'?(getNum('calcTransferCosts',0)+getNum('calcBondRegistration',0)):0,
    premiumMonthly:getNum('calcInsurance',0), excess:getNum('calcInsuranceExcess',0), shortfallCoverMonthly:getNum('calcShortfall',0), creditProtectionMonthly:getNum('calcCreditProtection',0), otherInsuranceMonthly:getNum('calcOtherInsurance',0),
    netIncome:getNum('calcIncome',35000), existingDebt:getNum('calcDebt',3000), livingCosts:getNum('calcLiving',18000), otherUpfront:0
  };
}
function calculate(vehicle){
  if(!vehicle)return {errors:['Select an asset before running the outcome.']}; const input=buildOutcomeInput(vehicle); const errors=[];
  if(!Number.isFinite(input.price)||input.price<=0)errors.push(`A valid ${assetTypeLabel(input.assetType).toLowerCase()} price is required.`);
  if(input.assetType==='automotive'&&(!Number.isFinite(input.consumption)||input.consumption<=0))errors.push('Fuel/energy consumption is missing.');
  if(input.modules.finance&&(!Number.isFinite(input.rate)||input.rate<0||!Number.isFinite(input.term)||input.term<=0))errors.push('Finance rate and term are required when Finance is selected.');
  if(input.modules.insurance&&(!Number.isFinite(input.premiumMonthly)||input.premiumMonthly<0))errors.push('Insurance premium is required when Insurance is selected.');
  if(errors.length)return {errors,input,vehicle};
  const outcome=window.VECTORIOutcomeEngine.customerOutcome(input); outcome.vehicle=vehicle; outcome.input=input; outcome.validation=window.VECTORIOutcomeEngine.validateResult(outcome); return {errors:[],...outcome};
}
function renderDecision(result){
  const panel=document.getElementById('decisionPanel');if(!panel)return;if(result.errors?.length){panel.innerHTML=`<div class="warning-list">${result.errors.map(e=>`<div class="warning">${escapeHtml(e)}</div>`).join('')}</div>`;return;}
  const e=result; const missing=e.evidence?.filter(x=>x.status==='MISSING')||[]; const status=missing.length?'INCOMPLETE EVIDENCE':'MODEL COMPLETE FOR SUPPLIED INPUTS';
  const assetMetric=e.assetType==='property'?(e.property?e.property.operatingMonthly:0):e.assetType==='fine_jewellery'?(e.jewellery?e.jewellery.operatingMonthly:0):(e.automotive?e.automotive.operatingMonthly:0);
  panel.innerHTML=`<div class="outcome-status">${status}</div><h3>${escapeHtml(assetTitle(e.vehicle))}</h3><div class="outcome-headline"><span>Monthly real cash exposure</span><strong>${money(e.monthlyCashOutflow)}</strong></div><div class="outcome-metrics"><div><span>Horizon cash outflow</span><strong>${money(e.cashOutflowHorizon)}</strong></div><div><span>Economic cost</span><strong>${Number.isFinite(e.economicCost)?money(e.economicCost):'Insufficient exit value'}</strong></div><div><span>Net equity at horizon</span><strong>${Number.isFinite(e.netEquity)?money(e.netEquity):'Insufficient exit value'}</strong></div><div><span>Cash remaining / month</span><strong>${Number.isFinite(e.cashRemaining)?money(e.cashRemaining):'Insufficient income'}</strong></div><div><span>Asset operating cost</span><strong>${money(assetMetric)}</strong></div><div><span>Evidence completeness</span><strong>${e.evidenceCompleteness}%</strong></div></div><div class="outcome-breakdown"><div><strong>${assetTypeLabel(e.assetType)}</strong><span>${money(assetMetric)} / month</span></div><div><strong>Finance</strong><span>${e.finance?money(e.finance.monthlyPayment||0)+' / month':'Not selected'}</span></div><div><strong>Insurance</strong><span>${e.insurance?money(e.insurance.monthly)+' / month':'Not selected'}</span></div></div><div class="scenario-row"><button class="scenario-btn" onclick="runOutcomeScenario('stress')">Stress view</button><button class="scenario-btn" onclick="runOutcomeScenario('downside')">Downside view</button></div><div class="status-box"><strong>Evidence ledger</strong><br><br>${e.evidence?.length?e.evidence.map(x=>`${evidenceBadge(x.status)} ${escapeHtml(x.label)}`).join(' &nbsp; '):'All required inputs supplied.'}</div><p class="small muted">This is analytical decision support. A lender, insurer, property practitioner or jewellery business remains responsible for its regulated decision, quote, valuation or transaction.</p>`;
}
function runCalculator(){const id=document.getElementById('calcVehicle')?.value;const v=vehicles.find(x=>x.id===id);const out=document.getElementById('calcOutputs');if(!v){if(out)out.innerHTML='<div class="empty-state">Select an asset listing first.</div>';return;}const r=calculate(v);if(r.errors?.length){out.innerHTML=`<div class="warning-list">${r.errors.map(e=>`<div class="warning">${escapeHtml(e)}</div>`).join('')}</div>`;renderDecision(r);return;}out.innerHTML=`<div class="big-output"><span>Real-world monthly cash exposure</span><strong>${money(r.monthlyCashOutflow)}</strong></div><div class="output-card"><span>Horizon cash outflow</span><strong>${money(r.cashOutflowHorizon)}</strong></div><div class="output-card"><span>Economic cost</span><strong>${Number.isFinite(r.economicCost)?money(r.economicCost):'Supply exit value'}</strong></div><div class="output-card"><span>Expected exit value</span><strong>${Number.isFinite(r.assetValue)?money(r.assetValue):'Missing'}</strong></div><div class="output-card"><span>Finance balance</span><strong>${money(r.financeBalanceAtHorizon)}</strong></div><div class="output-card"><span>Net equity</span><strong>${Number.isFinite(r.netEquity)?money(r.netEquity):'Missing'}</strong></div><div class="output-card"><span>Asset operating cost</span><strong>${money(r.assetType==='property'?r.property?.operatingMonthly:r.assetType==='fine_jewellery'?r.jewellery?.operatingMonthly:r.automotive?.operatingMonthly)}</strong></div><div class="output-card"><span>Finance payment</span><strong>${r.finance?money(r.finance.monthlyPayment||0):'Not selected'}</strong></div><div class="output-card"><span>Insurance exposure</span><strong>${r.insurance?money(r.insurance.monthly):'Not selected'}</strong></div><div class="output-card"><span>Contingent insurance excess</span><strong>${r.insurance?money(r.contingentInsuranceExposure):'Not selected'}</strong></div>`;renderDecision(r);}

// Expose the existing lexical AdManager to the window so woven placements can target it.
if(typeof AdManager !== 'undefined') window.AdManager=AdManager;

// Advertising: target verticals and rotate eligible campaigns so a single campaign does not own every woven slot.
if(window.AdManager){
  const originalChoose=window.AdManager.choose.bind(window.AdManager);
  window.AdManager.choose=function(format,vertical='all',slotKey=''){
    const eligible=this.campaigns.filter(c=>c.active&&c.formats.includes(format)&&(!c.verticals||c.verticals.includes('all')||c.verticals.includes(vertical)));
    if(!eligible.length)return originalChoose(format);
    const offset=(Number(slotKey)||0)%eligible.length;
    return eligible.sort((a,b)=>b.priority-a.priority)[offset]||eligible[0];
  };
  const originalRender=this.AdManager.renderAd.bind(this.AdManager);
  this.AdManager.renderAd=function(slot,format,vertical='all'){
    const c=this.choose(format,vertical,slot.dataset.adSlotIndex||'0'); const d=this.dims[format]||this.dims['Medium Rectangle']; slot.style.height=d.h;slot.style.maxWidth=d.mw;slot.classList.add('ad-container');const id=c?c.id:'fallback';slot.innerHTML=`<div class="ad-label">Advertisement${c?.company?' · '+escapeHtml(c.company):''}</div>${c?c.content:`<div class="ad-empty">${escapeHtml(format)}<br>Space available</div>`}`;if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>=0.5){this.trackImpression(id);observer.disconnect();}}),{threshold:[0.5]});observer.observe(slot);}if(c){slot.querySelectorAll('.ad-cta').forEach(btn=>btn.addEventListener('click',()=>this.trackClick(id)));}}
}

// Add vertical metadata to the existing campaign registry without changing legacy campaign objects.
if(window.AdManager){window.AdManager.campaigns.forEach(c=>{if(c.id==='CMP-001'||c.id==='CMP-005')c.verticals=['automotive'];else if(c.id==='CMP-002')c.verticals=['automotive','property','fine_jewellery'];else if(c.id==='CMP-003')c.verticals=['automotive'];else c.verticals=['all'];});}

// Re-run the correct multi-asset initialisation after the legacy DOM handler has completed.
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    if(!vehicles.length)return;
    vectoriSelectedAssetType='';
    populateFilters();
    filteredVehicles=[...vehicles];
    renderVehicles(filteredVehicles);
    const first=vehicles[0]; if(first)setCalculatorAsset(first);
  },0);
});
