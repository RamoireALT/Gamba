// script.js

// Elements
const openAuthBtn = document.getElementById("open-auth-popup");
const authPopup = document.getElementById("auth-popup");
const popupOverlay = authPopup.querySelector(".popup-overlay");
const closePopupBtn = document.getElementById("close-popup");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const tabLabel = document.getElementById("tab-label");

// Profile elements
const profileDisplay = document.getElementById("profile-display");
const profileName = document.getElementById("profileName");
const profileBalance = document.getElementById("profileBalance");
const profileLevel = document.getElementById("profileLevel");
const profileXP = document.getElementById("profileXP");
const profileCashback = document.getElementById("profileCashback");
const redeemCashbackBtn = document.getElementById("redeemCashbackBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Fake current user state
let currentUser = null;

// Functions

function openAuthPopup() {
  authPopup.classList.remove("hidden");
}

function closeAuthPopup() {
  authPopup.classList.add("hidden");
}

function switchTab(tabName) {
  tabButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  tabContents.forEach(content => {
    content.classList.toggle("active", content.id === tabName);
  });
  tabLabel.textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);
}

function updateAuthButton() {
  if (!currentUser) {
    // Show login button
    openAuthBtn.style.display = "inline-flex";
    profileDisplay.style.display = "none";

    openAuthBtn.textContent = "Login";
    openAuthBtn.onclick = openAuthPopup;
  } else {
    // Show profile display
    openAuthBtn.style.display = "none";
    profileDisplay.style.display = "flex";

    profileName.textContent = currentUser.username;
    profileBalance.textContent = `€${currentUser.balance.toFixed(2)}`;
    profileLevel.textContent = currentUser.level;
    profileXP.textContent = currentUser.xp;
    profileCashback.textContent = `€${currentUser.cashback.toFixed(2)}`;

    redeemCashbackBtn.style.display = currentUser.level >= 10 ? "inline-block" : "none";
  }
}

function logout() {
  currentUser = null;
  updateAuthButton();
}

// Event Listeners

openAuthBtn.addEventListener("click", openAuthPopup);
closePopupBtn.addEventListener("click", closeAuthPopup);
popupOverlay.addEventListener("click", closeAuthPopup);

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

// Login form (dummy)
document.getElementById("login-form").addEventListener("submit", e => {
  e.preventDefault();
  // Fake login
  currentUser = {
    username: "WanderUser",
    balance: 25.75,
    level: 12,
    xp: 3150,
    cashback: 0.45,
  };
  closeAuthPopup();
  updateAuthButton();
});

// Register form (dummy)
document.getElementById("register-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("Register form submitted (dummy)");
});

// Reset form (dummy)
document.getElementById("reset-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("Reset password submitted (dummy)");
});

// Redeem cashback button
redeemCashbackBtn.addEventListener("click", () => {
  alert("Cashback redeemed! (dummy)");
  // Example reset cashback to zero
  if (currentUser) {
    currentUser.cashback = 0;
    updateAuthButton();
  }
});

// Logout button
logoutBtn.addEventListener("click", () => {
  logout();
});

// Initialize page
updateAuthButton();
switchTab("login");
