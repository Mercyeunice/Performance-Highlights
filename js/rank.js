const sheetURL = 'https://api.sheetbest.com/sheets/36d7b7c7-7c44-412e-baa3-89a9deaede05';
let allData = [];

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

fetch(sheetURL)
  .then(response => response.json())
  .then(data => {
    allData = data;
    filterByMonth(); // initial render
  });

function filterByMonth() {
  const selectedMonth = document.getElementById("monthFilter").value;
  const selectedTeam = document.getElementById("teamFilter").value;

  const tableBody = document.querySelector("#employeeTable tbody");
  const stackContainer = document.getElementById("topperStack");
  tableBody.innerHTML = "";
  stackContainer.innerHTML = "";

  const filtered = allData.filter(emp =>
    (!selectedMonth || emp.Month === selectedMonth) &&
    (!selectedTeam || emp.Team.toLowerCase() === selectedTeam.toLowerCase())
  );

  const topTen = [...filtered].sort((a, b) => parseFloat(b.Score) - parseFloat(a.Score)).slice(0, 10);
  const top5 = topTen.slice(0, 5);

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
      <img src="${employee.PhotoURL || 'https://via.placeholder.com/60'}" alt="${employee.Name}" />
      <div>${employee.Name}</div>
    `;
    return card;
  }

  for (let i = 0; i < 2; i++) {
    top5.forEach(emp => stackContainer.appendChild(createCard(emp)));
  }
}

function filterByTeam() {
  filterByMonth(); // same handler for both filters
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

document.getElementById("searchInput").addEventListener("keyup", function (e) {
  if (e.key === "Enter") searchEmployee();
});
