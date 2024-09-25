const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

const playerCounts = inventory.reduce((counts, item) => {
  counts[item] = (counts[item] || 0) + 1;
  return counts;
}, {});

function updateInventory() {
  const inventoryList = document.getElementById("inventory-list");
  inventoryList.innerHTML = "";

  for (const [player, count] of Object.entries(playerCounts)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${player} x${count}`;
    inventoryList.appendChild(listItem);
  }
}

updateInventory();
