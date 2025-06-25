const data = {
  budget: [],
  chores: [],
  chores_types: ["помыта посуда", "пылесос", "стирка"]
};

function saveData() {
  localStorage.setItem("home_data", JSON.stringify(data));
  render();
}

function loadData() {
  const saved = localStorage.getItem("home_data");
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(data, parsed);
  }
}

function render() {
  const budgetList = document.getElementById("budgetList");
  budgetList.innerHTML = "";
  data.budget.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.timestamp_utc} – ${entry.who}: ${entry.type} ${entry.amount}₸ (${entry.comment || ""})`;
    li.style.borderLeftColor = entry.type === "income" ? "green" : "red";
    budgetList.appendChild(li);
  });

  const choreList = document.getElementById("choreList");
  choreList.innerHTML = "";
  data.chores.forEach(chore => {
    const li = document.createElement("li");
    li.textContent = `${chore.timestamp_utc} – ${chore.who}: ${chore.type}`;
    li.style.borderLeftColor = "#888";
    choreList.appendChild(li);
  });

  const choreTypeSelect = document.getElementById("choreType");
  choreTypeSelect.innerHTML = "";
  data.chores_types.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    choreTypeSelect.appendChild(opt);
  });
}

document.getElementById("budgetForm").addEventListener("submit", e => {
  e.preventDefault();
  const ts = new Date(document.getElementById("budgetTime").value).toISOString();
  const who = document.getElementById("budgetWho").value.trim();
  const type = document.getElementById("budgetType").value;
  const amount = parseFloat(document.getElementById("budgetAmount").value);
  const comment = document.getElementById("budgetComment").value.trim();
  data.budget.push({ timestamp_utc: ts, who, type, amount, comment });
  saveData();
  e.target.reset();
});

document.getElementById("choreForm").addEventListener("submit", e => {
  e.preventDefault();
  const ts = new Date(document.getElementById("choreTime").value).toISOString();
  const who = document.getElementById("choreWho").value.trim();
  let type = document.getElementById("choreType").value;
  const newType = document.getElementById("newChoreType").value.trim();
  if (newType) {
    if (!data.chores_types.includes(newType)) {
      data.chores_types.push(newType);
    }
    type = newType;
  }
  data.chores.push({ timestamp_utc: ts, who, type });
  saveData();
  e.target.reset();
});

loadData();
render();
