let currentUser = null;
let database = [];

// Load database every 5s
setInterval(() => {
  fetch('Database/LoginDatabase.json')
    .then(res => res.json())
    .then(data => {
      database = data;
      if (currentUser) {
        currentUser = database.find(u => u.username === currentUser.username);
        updateProfilePopup();
      }
    });
}, 5000);

// Modal handlers
function showModal(contentHTML) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close" onclick="this.parentElement.parentElement.remove()">×</span>
      ${contentHTML}
    </div>`;
  document.getElementById('modal-container').appendChild(modal);
}

function showLoginForm() {
  showModal(`
    <h2>Login</h2>
    <input type="text" id="loginUser" placeholder="Username or Email">
    <input type="password" id="loginPass" placeholder="Password">
    <button onclick="handleLogin()">Login</button>
    <p style="text-align:center;margin-top:10px;">
      <a href="#" onclick="showRegisterForm()">Register</a> • 
      <a href="#" onclick="showResetForm()">Forgot Password?</a>
    </p>
  `);
}

function showRegisterForm() {
  showModal(`
    <h2>Register</h2>
    <input type="text" id="regUser" placeholder="Username">
    <input type="email" id="regEmail" placeholder="Email">
    <input type="password" id="regPass" placeholder="Password">
    <input type="password" id="regPass2" placeholder="Confirm Password">
    <button onclick="handleRegister()">Register</button>
  `);
}

function showResetForm() {
  showModal(`
    <h2>Reset Password</h2>
    <input type="password" id="curPass" placeholder="Current Password">
    <input type="password" id="newPass" placeholder="New Password">
    <input type="password" id="newPass2" placeholder="Confirm New Password">
    <button onclick="handleResetPassword()">Change Password</button>
  `);
}

function showProfilePopup() {
  const xpInfo = getLevelInfo(currentUser.xp || 0);
  const percent = Math.min(100, (currentUser.xp / xpInfo.next) * 100).toFixed(1);
  const cashbackRate = getCashbackRate(xpInfo.level);
  const cashback = ((currentUser.totalBets || 0) * cashbackRate).toFixed(2);
  const canRedeem = cashback >= 5;

  showModal(`
    <h2>👤 ${currentUser.username}</h2>
    <div class="profile-info">
      <p class="profile-balance">💰 Balance: €${(currentUser.balance || 0).toFixed(2)}</p>
      <p>⭐ Level ${xpInfo.level}</p>
      <div class="progress-bar"><div class="progress" style="width:${percent}%"></div></div>
      <p>XP: ${currentUser.xp}/${xpInfo.next}</p>
      <p class="cashback-display">
        🎁 Cashback: ${cashbackRate * 100}% • €${cashback} ${canRedeem ? '<span class="cashback-eligible">(Eligible)</span>' : '(Min €5 required)'}
      </p>
      <button onclick="showResetForm()">Change Password</button>
    </div>
  `);
}

function handleLogin() {
  const user = document.getElementById("loginUser").value.trim().toLowerCase();
  const pass = document.getElementById("loginPass").value;

  const found = database.find(u =>
    (u.username.toLowerCase() === user || u.email.toLowerCase() === user) &&
    u.password === pass
  );

  if (found) {
    currentUser = found;
    document.getElementById("nav-buttons").innerHTML = `
      <button onclick="showProfilePopup()">👤 ${currentUser.username}</button>
    `;
    closeModal();
  } else {
    alert("Invalid credentials.");
  }
}

function handleRegister() {
  const username = document.getElementById("regUser").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPass").value;
  const pass2 = document.getElementById("regPass2").value;

  if (!username || !email || !pass || !pass2) return alert("All fields required.");
  if (pass !== pass2) return alert("Passwords do not match.");
  if (pass.length < 6 || !/[A-Z]/.test(pass) || !/\d/.test(pass))
    return alert("Password must have 6+ chars, 1 uppercase letter, and 1 number.");
  if (database.find(u => u.username === username)) return alert("Username already exists.");

  const newUser = {
    username,
    email,
    password: pass,
    balance: 0,
    xp: 0,
    totalBets: 0,
    isAdmin: false
  };
  database.push(newUser);
  currentUser = newUser;
  document.getElementById("nav-buttons").innerHTML = `
    <button onclick="showProfilePopup()">👤 ${currentUser.username}</button>
  `;
  closeModal();
}

function handleResetPassword() {
  const current = document.getElementById("curPass").value;
  const newP = document.getElementById("newPass").value;
  const newP2 = document.getElementById("newPass2").value;

  if (!currentUser || current !== currentUser.password)
    return alert("Wrong current password.");
  if (newP !== newP2) return alert("Passwords do not match.");
  if (newP.length < 6 || !/[A-Z]/.test(newP) || !/\d/.test(newP))
    return alert("Password must have 6+ chars, 1 uppercase letter, and 1 number.");

  currentUser.password = newP;
  closeModal();
  alert("Password changed.");
}

// Close any open modal
function closeModal() {
  document.getElementById("modal-container").innerHTML = "";
}

// Level XP math
function getLevelInfo(xp) {
  let level = 1;
  let next = 2500;
  while (xp >= next && level < 100) {
    level++;
    if (level <= 19) next += next * 0.25;
    else if (level <= 49) next += next * 0.10;
    else next += next * 0.05;
  }
  return { level, next: Math.round(next) };
}

// Cashback %
function getCashbackRate(level) {
  if (level >= 100) return 0.007;
  if (level >= 50) return 0.005;
  if (level >= 40) return 0.0045;
  if (level >= 30) return 0.004;
  if (level >= 20) return 0.0035;
  if (level >= 15) return 0.003;
  if (level >= 10) return 0.0025;
  return 0;
}

// Update profile popup if it's open
function updateProfilePopup() {
  const modal = document.querySelector(".modal-content");
  if (modal && currentUser) {
    modal.parentElement.remove();
    showProfilePopup();
  }
}