
// script.js
const kits = [];
function openDashboard(role) {
    // Logic to open the respective dashboard based on the role
    if (role === 'dataIncharge') {
        // Show Data Incharge dashboard
        showDataInchargeDashboard();
    } else if (role === 'lineLeader') {
        // Show Line Leader dashboard
        showLineLeaderDashboard();
    } else if (role === 'manager') {
        // Show Manager dashboard
        showManagerDashboard();
    }
}
function showDataInchargeDashboard() {
    // Logic to display Data Incharge dashboard
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
        <h2 class="text-xl mb-4">Data Incharge Dashboard</h2>
        <button class="bg-green-500 text-white p-2 rounded" onclick="addNewKit()">+ Add New Kit</button>
        <div id="kit-detail-view"></div>
    `;
}
function addNewKit() {
    // Logic to add a new kit
    const kitID = prompt("Enter Kit ID:");
    const modelName = prompt("Enter Model Name:");
    const totalQuantity = parseInt(prompt("Enter Total Quantity:"), 10);
    const issuedLine = prompt("Enter Issued Line (Line 1 / Line 2 / Line 3):");
    const issueDate = new Date().toLocaleString();
    const newKit = {
        kitID,
        modelName,
        totalQuantity,
        remainingQty: totalQuantity,
        issuedLine,
        issueDate,
        status: 'OPEN'
    };
    kits.push(newKit);
    updateKitList();
}
function updateKitList() {
    const kitList = document.getElementById('kit-list');
    kitList.innerHTML = kits.map(kit => `
        <li>${kit.kitID} | ${kit.modelName} | ${kit.remainingQty} | ${kit.status}</li>