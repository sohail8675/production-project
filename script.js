// ===== DOM BINDINGS =====
const loginScreen = document.getElementById("login-screen");
const appContainer = document.getElementById("app-container");

const lineLeaderView = document.getElementById("line-leader-view");
const dataInchargeView = document.getElementById("data-incharge-view");
const managerView = document.getElementById("manager-view");

const kitList = document.getElementById("kit-list");
const addKitBtn = document.getElementById("add-kit-btn");
const kitModal = document.getElementById("kit-modal");

const lineSelect = document.getElementById("line-select");
const kitSelect = document.getElementById("kit-select");
const inputUsed = document.getElementById("input-used");
const output = document.getElementById("output");
const rejection = document.getElementById("rejection");
const semifg = document.getElementById("semifg");
const llMsg = document.getElementById("ll-msg");

const dataTable = document.getElementById("data-table");
const managerTable = document.getElementById("manager-table");

const kitId = document.getElementById("kit-id");
const kitModel = document.getElementById("kit-model");
const kitQty = document.getElementById("kit-qty");

const filterDate = document.getElementById("filter-date");
const filterLine = document.getElementById("filter-line");

// ===== STORAGE INIT =====
if (!localStorage.kits) localStorage.kits = JSON.stringify([]);
if (!localStorage.reports) localStorage.reports = JSON.stringify([]);

let role = null;

// ===== LOGIN =====
function login(r) {
  role = r;
  loginScreen.classList.add("hidden");
  appContainer.classList.remove("hidden");

  hideAll();

  if (r === "line-leader") {
    lineLeaderView.classList.remove("hidden");
    loadKitDropdown();
  }

  if (r === "data-incharge") {
    dataInchargeView.classList.remove("hidden");
    addKitBtn.classList.remove("hidden");
    renderData();
  }

  if (r === "manager") {
    managerView.classList.remove("hidden");
    renderManager();
  }

  renderKits();
}

function hideAll() {
  lineLeaderView.classList.add("hidden");
  dataInchargeView.classList.add("hidden");
  managerView.classList.add("hidden");
}

// ===== KIT LOGIC =====
function renderKits() {
  const kits = JSON.parse(localStorage.kits);
  kitList.innerHTML = "";
  kits.forEach(k => {
    kitList.innerHTML += `<div>${k.id} (${k.total - k.used})</div>`;
  });
}

function openModal() {
  kitModal.classList.remove("hidden");
}

function createKit() {
  if (!kitId.value || !kitQty.value) {
    alert("Enter Kit details");
    return;
  }
  const kits = JSON.parse(localStorage.kits);
  kits.push({ id: kitId.value, model: kitModel.value, total: +kitQty.value, used: 0 });
  localStorage.kits = JSON.stringify(kits);

  kitModal.classList.add("hidden");
  kitId.value = kitModel.value = kitQty.value = "";
  renderKits();
  loadKitDropdown();
}

function loadKitDropdown() {
  const kits = JSON.parse(localStorage.kits);
  kitSelect.innerHTML = `<option value="">Select Kit</option>`;
  kits.forEach(k => {
    kitSelect.innerHTML += `<option value="${k.id}">${k.id}</option>`;
  });
}

// ===== LINE LEADER REPORT =====
function submitReport() {
  llMsg.textContent = "";

  if (!lineSelect.value || !kitSelect.value) {
    llMsg.textContent = "Select Line & Kit";
    llMsg.style.color = "red";
    return;
  }

  const inUsed = +inputUsed.value;
  const out = +output.value;
  const rej = +rejection.value;
  const semi = +semifg.value;

  if (out + rej + semi !== inUsed) {
    llMsg.textContent = "Mismatch data!";
    llMsg.style.color = "red";
    return;
  }

  const reports = JSON.parse(localStorage.reports);
  reports.push({
    date: new Date().toISOString(),
    line: lineSelect.value,
    kit: kitSelect.value,
    out
  });
  localStorage.reports = JSON.stringify(reports);

  const kits = JSON.parse(localStorage.kits);
  kits.find(k => k.id === kitSelect.value).used += inUsed;
  localStorage.kits = JSON.stringify(kits);

  llMsg.textContent = "Submitted Successfully";
  llMsg.style.color = "green";
}

// ===== DATA INCHARGE =====
function renderData() {
  const r = JSON.parse(localStorage.reports);
  dataTable.innerHTML =
    `<table><tr><th>Line</th><th>Kit</th><th>Output</th></tr>` +
    r.map(x => `<tr><td>${x.line}</td><td>${x.kit}</td><td>${x.out}</td></tr>`).join("") +
    `</table>`;
}

// ===== MANAGER =====
function renderManager() {
  const r = JSON.parse(localStorage.reports);
  const d = filterDate.value;
  const l = filterLine.value;

  const f = r.filter(x =>
    (!d || x.date.startsWith(d)) &&
    (!l || x.line === l)
  );

  managerTable.innerHTML =
    `<table><tr><th>Date</th><th>Line</th><th>Kit</th><th>Output</th></tr>` +
    f.map(x =>
      `<tr><td>${x.date.split("T")[0]}</td><td>${x.line}</td><td>${x.kit}</td><td>${x.out}</td></tr>`
    ).join("") +
    `</table>`;
}

function exportExcel() {
  const r = JSON.parse(localStorage.reports);
  let csv = "Date,Line,Kit,Output\n";
  r.forEach(x => {
    csv += `${x.date.split("T")[0]},${x.line},${x.kit},${x.out}\n`;
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "production_report.csv";
  a.click();
}
