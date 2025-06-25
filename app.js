let data = { budget: [], chores: [], chores_types: [] };

async function onAuthenticated() {
  data = await getFile();
  render();
}

document.getElementById('budgetForm').addEventListener('submit', async e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('budgetAmount').value);
  const type = document.getElementById('budgetType').value;
  const comment = document.getElementById('budgetComment').value.trim();
  const timestamp = new Date().toISOString();
  data.budget.push({ timestamp_utc: timestamp, who: currentUser, type, amount, comment });
  await saveFile(data);
  render();
  e.target.reset();
});

document.getElementById('choreForm').addEventListener('submit', async e => {
  e.preventDefault();
  let type = document.getElementById('choreType').value;
  const newType = document.getElementById('newChoreType').value.trim();
  if (newType) {
    if (!data.chores_types.includes(newType)) {
      data.chores_types.push(newType);
    }
    type = newType;
  }
  const timestamp = new Date().toISOString();
  data.chores.push({ timestamp_utc: timestamp, who: currentUser, type });
  await saveFile(data);
  render();
  e.target.reset();
});

function render() {
  const budgetList = document.getElementById('budgetList');
  budgetList.innerHTML = '';
  data.budget.slice().reverse().forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.timestamp_utc} – ${entry.who}: ${entry.type} ${entry.amount} (${entry.comment || ''})`;
    budgetList.appendChild(li);
  });

  const choreList = document.getElementById('choreList');
  choreList.innerHTML = '';
  data.chores.slice().reverse().forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.timestamp_utc} – ${entry.who}: ${entry.type}`;
    choreList.appendChild(li);
  });

  const choreType = document.getElementById('choreType');
  choreType.innerHTML = '';
  data.chores_types.forEach(type => {
    const opt = document.createElement('option');
    opt.value = type;
    opt.textContent = type;
    choreType.appendChild(opt);
  });
}

initAuth();
