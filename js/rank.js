const sheetURL = 'https://api.sheetbest.com/sheets/36d7b7c7-7c44-412e-baa3-89a9deaede05';
let allData = [];
let currentSortKey = 'Score'; // Default sort by Score

// Load filters from localStorage
window.addEventListener('load', () => {
  document.getElementById("monthFilter").value = localStorage.getItem("monthFilter") || "";
  document.getElementById("teamFilter").value = localStorage.getItem("teamFilter") || "";
});

function openModal(employee) {
  document.getElementById("modalName").textContent = employee.Name;
  document.getElementById("modalEmployeeID").textContent = `EmployeeID: ${employee.EmployeeID}`;
  document.getElementById("modalDept").textContent = `Team: ${employee.Team}`;
  document.getElementById("modalEmail").textContent = `Email: ${employee.Email}`;
  document.getElementById("modalPhone").textContent = `Phone: ${employee.Phone}`;
  document.getElementById("modalPosition").textContent = `Position: ${employee.Position}`;
  document.getElementById("modalPhoto").src = employee.PhotoURL || "https://via.placeholder.com/100";
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function searchEmployee() {
  const searchId = document.getElementById("searchInput").value.trim().toUpperCase();
  if (!searchId) return alert("Please enter Employee ID");
  const found = allData.find(emp => emp.EmployeeID.toUpperCase() === searchId);
  if (found) openModal(found);
  else alert("Employee not found");
}

function setSortKey(key) {
  currentSortKey = key;
  filterByMonth(); // re-render
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
}

function filterByMonth() {
  const selectedMonth = document.getElementById("monthFilter").value;
  const selectedTeam = document.getElementById("teamFilter").value;

  // Save to localStorage
  localStorage.setItem("monthFilter", selectedMonth);
  localStorage.setItem("teamFilter", selectedTeam);

  const tableBody = document.querySelector("#employeeTable tbody");
  const stackContainer = document.getElementById("topperStack");
  tableBody.innerHTML = "";
  stackContainer.innerHTML = "";

  const filtered = allData.filter(emp =>
    (!selectedMonth || emp.Month === selectedMonth) &&
    (!selectedTeam || emp.Team.toLowerCase() === selectedTeam.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    parseFloat(b[currentSortKey]) - parseFloat(a[currentSortKey])
  );

  const topTen = sorted.slice(0, 10);
  const top5 = sorted.slice(0, 5);

  topTen.forEach(employee => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${employee.Name}</td>
      <td>${employee.Stack}</td>
      <td>${employee.Resolution}</td>
      <td>${employee.CSS}</td>
      <td>${employee.DSAT}</td>
      <td>${employee.Team}</td>
    `;
    row.onclick = () => openModal(employee);
    tableBody.appendChild(row);
  });

  function createCard(employee) {
    const card = document.createElement("div");
    card.className = "stack-card";
    card.innerHTML = `
      <div class="stack-title">Topper in ${getTopLabel(employee)}</div>
      <img src="${employee.PhotoURL || 'https://via.placeholder.com/60'}"
           onerror="this.onerror=null;this.src='https://via.placeholder.com/60';"
           alt="${employee.Name}" />
      <div>${employee.Name}</div>
    `;
    return card;
  }

  // Duplicated stack for smooth loop
  for (let i = 0; i < 2; i++) {
    top5.forEach(emp => stackContainer.appendChild(createCard(emp)));
  }
}

function getTopLabel(employee) {
  const scores = {
    Stack: parseFloat(employee.Stack),
    Resolution: parseFloat(employee.Resolution),
    CSS: parseFloat(employee.CSS),
    DSAT: parseFloat(employee.DSAT)
  };
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function filterByTeam() {
  filterByMonth(); // unified
}

// CSV Export
function exportCSV() {
  const rows = [['Name', 'Stack', 'Resolution', 'CSS', 'DSAT', 'Team']];
  document.querySelectorAll('#employeeTable tbody tr').forEach(row => {
    const cols = Array.from(row.children).map(td => td.textContent.trim());
    rows.push(cols);
  });
  const csvContent = rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "employee_data.csv";
  link.click();
}

// PDF Export
function exportPDF() {
  import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(({ jsPDF }) => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(12);
    doc.text("Employee Ranking Data", 10, y);
    y += 10;
    document.querySelectorAll('#employeeTable tbody tr').forEach(row => {
      const cols = Array.from(row.children).map(td => td.textContent.trim()).join(" | ");
      doc.text(cols, 10, y);
      y += 10;
    });
    doc.save("employee_data.pdf");
  });
}

document.getElementById("searchInput").addEventListener("keyup", function (e) {
  if (e.key === "Enter") searchEmployee();
});

fetch(sheetURL)
  .then(response => response.json())
  .then(data => {
    allData = data;
    filterByMonth();
  });
