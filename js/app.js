let navExpandItem = document.querySelectorAll(".expend-items");
function expand(tab) {
  var expendItems = tab.nextElementSibling;
  expendItems.classList.toggle("active");

  tab.classList.toggle("active");

  navExpandItem.forEach((e) => {
    if (e !== expendItems) {
      e.classList.remove("active");
      e.previousElementSibling.classList.remove("active");
    }
  });
}
let body = document.querySelector("body");
function nav() {
  body.classList.toggle("full");
}
let actionItemWraper = document.querySelector(".action-item-wraper");
function acItem() {
  actionItemWraper.classList.toggle("active");
}
let themeSwitch = document.querySelector(".theme");
function themeS() {
  themeSwitch.classList.toggle("active");
}
// Conversion rules
const rates = {
  Organic: 5,
  Metal: 15,
  Ewaste: 40
};

const typeSelect = document.getElementById("wasteType");
const amountInput = document.getElementById("amount");
const creditPreview = document.getElementById("creditPreview");
const addBtn = document.getElementById("addBtn");
const table = document.getElementById("wasteTable");

// Load existing records from localStorage
let records = JSON.parse(localStorage.getItem("wasteRecords")) || [];

// Generate random TX ID
function generateTxId() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `#WC${randomNum}`;
}

// Live credit preview
amountInput.addEventListener("input", updateCredit);
typeSelect.addEventListener("change", updateCredit);

function updateCredit() {
  const type = typeSelect.value;
  const amount = parseFloat(amountInput.value) || 0;
  const credits = amount * (rates[type] || 0);
  creditPreview.textContent = credits + "WC";
}

// Add row
addBtn.addEventListener("click", () => {
  const type = typeSelect.value;
  const amount = parseFloat(amountInput.value);

  if (!amount || amount <= 0) {
    alert("Enter valid amount!");
    return;
  }

  const credits = amount * (rates[type] || 0);

  // Get date & time
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Save new record
  const newRecord = {
    txid: generateTxId(),
    type,
    amount,
    credits,
    date: dateStr,
    time: timeStr,
    status: "Pending",
    fromTo: "User A → Collector B" // ✅ you can make this dynamic later
  };
  records.push(newRecord);

  // Store in localStorage
  localStorage.setItem("wasteRecords", JSON.stringify(records));

  // Re-render
  renderTable();

  // Reset input
  amountInput.value = "";
  updateCredit();
});

function updateStatusCards() {
  let totalWaste = 0;
  let totalCredits = 0;
  let pendingCount = 0;
  let completedCount = 0;

  records.forEach(r => {
    if (r.status === "Done") {   // ✅ only count completed
      totalWaste += parseFloat(r.amount) || 0;
      totalCredits += parseFloat(r.credits) || 0;
      completedCount++;
    }
    if (r.status === "Pending") pendingCount++;
  });

  const totalRequests = records.length || 1; // prevent /0
  const pendingPercent = ((pendingCount / totalRequests) * 100).toFixed(0);
  const completedPercent = ((completedCount / totalRequests) * 100).toFixed(0);

  // Update DOM
  document.getElementById("totalWaste").textContent = totalWaste + "KG";
  document.getElementById("totalCredits").textContent = totalCredits + "WC";
  document.getElementById("pendingCount").textContent = pendingCount;
  document.getElementById("completedCount").textContent = completedCount;
  document.getElementById("pendingPercent").textContent = pendingPercent + "%";
  document.getElementById("completedPercent").textContent = completedPercent + "%";
}

// Call whenever data changes
function renderTable() {
  table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

  records.forEach((r, index) => {
    const row = table.insertRow(-1);
    row.classList.add("interview");
    row.innerHTML = `
      <td class="txid">${r.txid}</td>
      <td class="company"><div class="details-typo"><h4>${r.type}</h4></div></td>
      <td class="date-time"><div class="details-typo"><h4>${r.date}</h4><p>${r.time}</p></div></td>
      <td class="fromto">${r.fromTo}</td>
      <td class="status"><div class="tag ${r.status.toLowerCase()}">${r.status}</div></td>
      <td class="contact"><p>${r.amount}KG</p></td>
      <td class="action"><h4>${r.credits}WC</h4></td>
      <td class="actions">
        ${r.status === "Pending"
        ? `<button class="completeBtn" data-index="${index}">Complete</button>`
        : `<span style="color:green; font-weight:bold;">✔</span>`}
      </td>
    `;
  });

  // attach event listeners for new buttons
  document.querySelectorAll(".completeBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-index");
      records[idx].status = "Done"; // update status
      localStorage.setItem("wasteRecords", JSON.stringify(records)); // save
      renderTable(); // re-render
    });
  });

  // update cards whenever table is rendered
  updateStatusCards();
}

// Initial render
renderTable();
