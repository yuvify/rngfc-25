let players = [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let isCooldown = false;
const cooldownTime = 1000;
const autorollInterval = 1500;
let autorollId = null;

fetch("players.json")
  .then((response) => response.json())
  .then((data) => {
    players = data;
    console.log("Players data loaded:", players); // Debugging line
  })
  .catch((error) => {
    console.error("Error loading player data:", error);
  });

function rollPlayer() {
  if (players.length === 0) {
    console.error("Player data is not loaded or empty.");
    return null;
  }

  const totalRarity = players.reduce((sum, player) => sum + player.rarity, 0);
  const random = Math.random() * totalRarity;
  let accumulatedRarity = 0;

  for (let player of players) {
    accumulatedRarity += player.rarity;
    if (random <= accumulatedRarity) {
      return player;
    }
  }

  console.error("No player found for the random number.");
  return null;
}

function startCooldown() {
  isCooldown = true;
  const rollButton = document.getElementById("roll-button");
  let timeLeft = cooldownTime / 1000;
  rollButton.textContent = timeLeft.toFixed(1);

  const intervalId = setInterval(() => {
    timeLeft -= 0.1;
    rollButton.textContent = timeLeft.toFixed(1);

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      rollButton.textContent = "Roll";
      isCooldown = false;
    }
  }, 100);
}

function startAutoroll() {
  if (autorollId) return;
  autorollId = setInterval(() => {
    if (!isCooldown) {
      document.getElementById("roll-button").click();
    }
  }, autorollInterval);
}

function stopAutoroll() {
  if (autorollId) {
    clearInterval(autorollId);
    autorollId = null;
  }
}

document.getElementById("roll-button").addEventListener("click", function () {
  if (isCooldown) return;

  const player = rollPlayer();
  if (player) {
    inventory.push(`${player.name} - ${player.TYPE}`);
    localStorage.setItem("inventory", JSON.stringify(inventory));

    document.getElementById(
      "rolled-player"
    ).textContent = `${player.name} - ${player.TYPE}`;
    const imageElement = document.getElementById("rolled-player-image");
    imageElement.src = player.img;
    imageElement.style.display = "block";

    startCooldown();
  }
});

document
  .getElementById("autoroll-button")
  .addEventListener("click", function () {
    if (autorollId) {
      stopAutoroll();
      this.textContent = "Start Autoroll";
    } else {
      startAutoroll();
      this.textContent = "Stop Autoroll";
    }
  });
