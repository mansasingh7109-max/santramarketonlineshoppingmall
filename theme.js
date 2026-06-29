// ==================== OLD CODE BACKUP - 26/06/2026 ====================
/*
// PURANA CODE - ISME ALERT THA JO HAR PAGE PE POPUP DE RAHA THA
alert("Config test: " + firebaseConfig.projectId);

// YA KOI AUR ALERT/CONSOLE TESTING CODE THA
console.log("Theme loaded");
alert("Dark mode on");
*/
// ==================== OLD CODE BACKUP END ====================

// ✅ NEW CORRECTED CODE - 26/06/2026

// STEP 1: THEME TOGGLE FUNCTION
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  
  if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'light');
    localStorage.setItem('santra_theme', 'light');
    console.log('✅ Theme changed to: Light'); // ✅ CORRECTION 1: alert ki jagah console.log
  } else {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('santra_theme', 'dark');
    console.log('✅ Theme changed to: Dark'); // ✅ CORRECTION 1: alert ki jagah console.log
  }
}

// STEP 2: LOAD SAVED THEME ON PAGE LOAD
function loadTheme() {
  const savedTheme = localStorage.getItem('santra_theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  console.log('✅ Theme loaded:', savedTheme);
}

// STEP 3: INIT THEME - PAGE LOAD PE CHALE
document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  
  // Theme button pe click event
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
});

// ✅ CORRECTION 2: FIREBASE CONFIG CHECK - ALERT HATA KE CONSOLE.LOG
// Agar Firebase config check karna hai to ye use kar
function checkFirebaseConfig() {
  if (typeof firebaseConfig !== 'undefined') {
    console.log('✅ Firebase Config Found:', firebaseConfig.projectId);
  } else {
    console.log('❌ Firebase Config Not Found');
  }
}

// Auto check on load - sirf console me dikhega, popup nahi
// checkFirebaseConfig(); // Agar chahiye to uncomment kar dena

// ✅ CORRECTION 3: SAFE FUNCTION - KOI BHI ALERT NAHI
function showMessage(msg) {
  // alert(msg); ❌ YE HATA DIYA
  console.log('Message:', msg); // ✅ AB SIRF CONSOLE ME DIKHEGA
}