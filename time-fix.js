// time-fix.js - FINAL - IST Time Fix - Separate File - 1 Line Use
// Is file ko kisi bhi HTML me <script src="time-fix.js"></script> se add karo
// Phir order place, customer login, present action - Sab jagah sahi time save hoga

function getISTNow() {
  let now = new Date();
  let istDateKey = now.toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).split('/').reverse().join('-'); // 2026-07-17
  let presentDate = now.toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'}); // 17/7/2026
  let presentTime = now.toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:true}); // 07:27 pm
  let presentYear = now.getFullYear();
  let dateTimeIST = now.toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}); // 17/7/2026, 7:27:53 pm
  let timestamp = Date.now(); // Real timestamp - Sabse important
  
  return {
    date: timestamp, // REAL timestamp - Isi se real time niklega - Present 12:13 am bug fix
    createdAt: timestamp,
    timestamp: timestamp,
    istDateKey: istDateKey,
    presentDate: presentDate,
    presentTime: presentTime,
    presentYear: presentYear,
    dateTimeIST: dateTimeIST,
    fullIST: dateTimeIST
  };
}

// Order ke liye ready data - 1 line me use
function getOrderTimeData() {
  return getISTNow();
}

// Customer login time - Jab customer login kare
function getCustomerLoginTime() {
  let t = getISTNow();
  return {
    loginTime: t.date,
    loginDate: t.presentDate,
    loginTimeStr: t.presentTime,
    loginDateTimeIST: t.dateTimeIST,
    istDateKey: t.istDateKey
  };
}

// Present action time - Jab customer present ho ya koi action kare
function getPresentActionTime() {
  let t = getISTNow();
  return {
    actionTime: t.date,
    actionDate: t.presentDate,
    actionTimeStr: t.presentTime,
    actionDateTimeIST: t.dateTimeIST,
    istDateKey: t.istDateKey,
    presentDate: t.presentDate,
    presentTime: t.presentTime
  };
}

// Firebase Server Timestamp ke saath
function getFirebaseTimeData() {
  let t = getISTNow();
  // Firebase ka ServerValue.TIMESTAMP alag se add karna hoga
  return t;
}

console.log('✅ time-fix.js Loaded - getISTNow() ready - IST Time Fix Active');



