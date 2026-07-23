<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>📊 History - time-fix.js FINAL</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif}
body{background:#f3f4f6;padding:12px}
.header{background:#8b5cf6;color:white;padding:12px;border-radius:10px;text-align:center}
.today-box{background:white;color:#4c1d95;padding:10px;border-radius:8px;margin-top:10px;font-weight:bold;font-size:13px;border:2px solid #8b5cf6}
.card{background:white;padding:12px;border-radius:10px;margin-bottom:10px;box-shadow:0 2px 5px #0001}
.btn-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.btn{padding:10px;border:none;border-radius:8px;color:white;font-weight:bold;cursor:pointer}
.green{background:#10b981}.orange{background:#f59e0b}.dark{background:#111827}.purple{background:#8b5cf6}
.data-table{width:100%;border-collapse:collapse;font-size:12px}
.data-table th{background:#8b5cf6;color:white;padding:8px;position:sticky;top:0}
.data-table td{padding:6px;border-bottom:1px solid #eee}
.week-row{background:#fef3c7!important}
.toast{position:fixed;top:15px;right:15px;background:#10b981;color:white;padding:10px;border-radius:8px;display:none;z-index:9999}
.toast.show{display:block}
.history-badge{padding:2px 6px;border-radius:6px;font-size:10px}
</style>
</head>
<body>

<div class="header">
<b>📊 History Data Center - time-fix.js FINAL - S No 1 No 2 No Line Wise</b>
<div class="today-box" id="todayBar">📅 Loading IST Date...</div>
</div>

<div class="card">
<p style="font-size:12px;text-align:center"><b>Total Orders: <span id="count">0</span> - S No 1 No Niche First <span id="count2">0</span> No Upar Present - Time Fix Active</b></p>
</div>

<div class="card">
<div id="ordersView"><table class="data-table"><thead><tr><th>S No</th><th>Date - IST Sahi</th><th>Customer</th><th>Mobile</th><th>Amount</th><th>History</th></tr></thead><tbody id="orderBody"><tr><td colspan="6" style="text-align:center;padding:20px">⏳ Loading Fast...</td></tr></tbody></table></div>
</div>

<div class="toast" id="toast"></div>

<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
<script src="constants.js?v=3"></script>
<script src="config.js?v=8"></script>
<script src="secrets.js?v=8"></script>
<script src="time-fix.js"></script>

<script>
/*
⚠️ OLD CODE BACKUP - history-center.html - SAFE

let allOrders=[];
document.addEventListener('DOMContentLoaded',()=>{
let t=getISTNow();
document.getElementById('todayBar').innerHTML = `Aaj Ki Date: ${t.presentDate} - ${t.presentTime} IST`;
loadOrders();
});
function loadOrders(){
window.rtdb.ref('orders').on('value',snap=>{
let data=snap.val()||{};
let temp=[];
Object.keys(data).forEach(k=>{
let o=data[k];
let dateObj=new Date(o.date || o.createdAt);
temp.push({id:k,orderId:o.ono||k,customerName:o.customer?.n||'',customerPhone:o.customer?.m||'',total:o.total||0,dateObj:dateObj});
});
allOrders=temp.sort((a,b)=>b.dateObj-a.dateObj);
renderOrders(allOrders);
});
}

OLD CODE BACKUP END - Pura save hai - Kuch hataya nahi
*/

let allOrders=[];

function getISTNowSafeHistory(){
  try{
    if(typeof getISTNow === 'function'){
      let t = getISTNow();
      let istDate = t.istDate || new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
      return {
        presentDate: t.presentDate || istDate.toLocaleDateString('en-IN'),
        presentTime: t.presentTime || new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:true}),
        dateTimeIST: t.dateTimeIST || istDate.toLocaleString('en-IN'),
        istDate: istDate
      };
    }
  }catch(e){ console.log("time-fix.js error, fallback IST:", e.message); }
  let now = new Date();
  let istDate = new Date(now.toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
  return {
    presentDate: istDate.toLocaleDateString('en-IN'),
    presentTime: now.toLocaleString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:true}),
    dateTimeIST: istDate.toLocaleString('en-IN'),
    istDate: istDate
  };
}

document.addEventListener('DOMContentLoaded',()=>{
let t=getISTNowSafeHistory();
document.getElementById('todayBar').innerHTML = `📅 Aaj Ki Date: ${t.presentDate} - ${t.istDate.toLocaleDateString('en-IN',{weekday:'long'})} - ${t.presentTime} IST<br>⏰ ${t.dateTimeIST} | Present Upar Past Neeche | S No 1 No 2 No Line Wise | Time Fix Active | Fast Loading`;
setTimeout(()=>loadOrders(),500);
});

function parseWithTimeFixHistory(input){
let istNow = getISTNowSafeHistory().istDate;
istNow.setHours(23,59,59,999);
if(!input) return new Date();
let d;
if(typeof input==='number'){ d = new Date(input); }
else if(typeof input==='string'){
  // 7/9/2026 jaise future ko fix karo
  if(input.includes('/')){
    let p = input.split(',')[0].split('/');
    if(p.length===3){
      let day=parseInt(p[0]); let month=parseInt(p[1])-1; let year=parseInt(p[2]);
      if(day<=31 && month<=11 && year>2000){ d = new Date(year,month,day); } else { d = new Date(input); }
    } else { d = new Date(input); }
  } else { d = new Date(input); }
  if(isNaN(d.getTime())) d = new Date();
}
else if(input.toDate){ d = input.toDate(); }
else { d = new Date(input); }

if(d > istNow){
  // Future hai to Aaj bana do - 7/9/2026 Future Fix
  return new Date();
}
return d;
}

function loadOrders(){
if(!window.rtdb){
  // rtdb constants.js config.js se aayega
  try{
    if(!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
    window.rtdb = firebase.database();
  }catch(e){ return setTimeout(loadOrders,500); }
}
window.rtdb.ref('orders').limitToLast(200).on('value',snap=>{
let data=snap.val()||{};
let temp=[];
Object.keys(data).forEach(k=>{
let o=data[k];
let dateObj=parseWithTimeFixHistory(o.date || o.createdAt || o.timestamp);
temp.push({id:k,orderId:o.ono||k,customerName:o.customer?.n||o.customer?.name||'',customerPhone:(o.customer?.m||o.customer?.mobile||'').toString().replace('+91','').trim(),total:o.total||0,dateObj:dateObj,rawDate:o.date||''});
});
allOrders=temp.sort((a,b)=>b.dateObj-a.dateObj);
renderOrders(allOrders);
});
}

function renderOrders(list){
document.getElementById('count').innerText = list.length;
document.getElementById('count2').innerText = list.length;
let s=list.length;
let globalOldest=[...list].sort((a,b)=>a.dateObj-b.dateObj);
let globalMap={}; globalOldest.forEach((r,i)=>{ globalMap[r.id]=i+1; });

// Mobile History for Present Upar Past Neeche
let mobileHistory={}; list.forEach(o=>{ let m=o.customerPhone; if(!m) return; if(!mobileHistory[m]) mobileHistory[m]=[]; mobileHistory[m].push(o); });

let html='';
let lastWeek='';
list.forEach(o=>{
let d=o.dateObj;
let globalNo=globalMap[o.id]||s;
let history=mobileHistory[o.customerPhone]||[];
let sortedHist=history.slice().sort((a,b)=>a.dateObj-b.dateObj);
let idx=sortedHist.findIndex(h=>h.id===o.id)+1;
let total=history.length;

let weekStart=new Date(d); weekStart.setDate(d.getDate()-d.getDay());
let weekEnd=new Date(weekStart); weekEnd.setDate(weekStart.getDate()+6);
let weekKey=weekStart.toISOString().slice(0,10);

if(weekKey!==lastWeek){
html+=`<tr class="week-row"><td colspan="6" style="text-align:center;padding:8px">
<b>📅 Week: ${weekStart.toLocaleDateString('en-IN')} se ${weekEnd.toLocaleDateString('en-IN')} tak - S No ${globalNo} No Line Wise</b>
</td></tr>`;
lastWeek=weekKey;
}

let isToday=new Date().toDateString()===d.toDateString();
let badge=isToday?`<span style="background:#10b981;color:white;padding:2px 6px;border-radius:8px;font-size:10px">TODAY ${d.toLocaleDateString('en-IN')} Present Upar</span>`:`<span style="background:#e5e7eb;padding:2px 6px;border-radius:6px;font-size:10px">${d.toLocaleDateString('en-IN')} ${idx===total?'Present Upar':'Past Neeche'}</span>`;

let presentBadge = idx===total?`${total} No Present Upar Latest`:idx===1?`${idx} No Past Neeche First`:`${idx} No`;

let dateStr=`${badge}<br>${d.toLocaleDateString('en-IN',{weekday:'long'})}<br><b>S No ${globalNo} No - ${d.toLocaleDateString('en-IN')}</b><br>${d.toLocaleTimeString('en-IN')} IST<br><span style="font-size:9px;color:#999">Raw: ${o.rawDate||''}</span>`;

html+=`<tr><td><b>S No ${globalNo} No</b><br>${presentBadge}</td><td>${dateStr}</td><td>${o.customerName||'-'}</td><td style="color:#3b82f6">${o.customerPhone}</td><td>₹${o.total}</td><td style="font-size:10px">${total} Times<br>${idx===total?'Present Upar':'Past Neeche'}<br>${idx} No of ${total} No</td></tr>`;
});
document.getElementById('orderBody').innerHTML=html || `<tr><td colspan="6" style="text-align:center">No Data</td></tr>`;
}

function showToast(m){let t=document.getElementById('toast');t.innerText=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}
</script>
</body>
</html>