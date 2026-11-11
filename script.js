let DAYS = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس"];
let data = JSON.parse(localStorage.getItem('shaarawy_v2')) || {
  "أولى سابع": {
    "الأحد": ["عربي","رياضيات","علوم","انجليزي","دراسات","دين","رياضة"],
    "الاثنين": ["رياضيات","عربي","انجليزي","علوم","عربي","حاسب","نشاط"],
    "الثلاثاء": ["علوم","دراسات","عربي","رياضيات","انجليزي","رسم","موسيقى"],
    "الأربعاء": ["انجليزي","عربي","رياضيات","علوم","دراسات","دين","رياضة"],
    "الخميس": ["عربي","رياضيات","انجليزي","علوم","نشاط","حاسب","دراسات"]
  },
  "أولى ثاني": {
    "الأحد": ["","","","","","",""],
    "الاثنين": ["","","","","","",""],
    "الثلاثاء": ["","","","","","",""],
    "الأربعاء": ["","","","","","",""],
    "الخميس": ["","","","","","",""]
  }
};
let pass = localStorage.getItem('shaarawy_pass2') || "Shaarawy@2026";
let isAdmin = false;
let currentClass = Object.keys(data)[0];

const select = document.getElementById('classSelect');
const tbody = document.getElementById('tableBody');

function save(){ localStorage.setItem('shaarawy_v2', JSON.stringify(data)); }
function renderSelect(){
  select.innerHTML = "";
  Object.keys(data).forEach(c=>{
    let o=document.createElement('option'); o.value=c; o.textContent=c; select.appendChild(o);
  });
  select.value = currentClass;
  document.getElementById('classTitle').innerText = "جدول فصل: " + currentClass;
}
function renderTable(){
  tbody.innerHTML="";
  DAYS.forEach(day=>{
    let tr=document.createElement('tr');
    let tdDay=document.createElement('td'); tdDay.innerHTML="<b>"+day+"</b>"; tdDay.style.background="#e3f2fd"; tr.appendChild(tdDay);
    for(let i=0;i<7;i++){
      if(i===4){
        let b=document.createElement('td'); b.className="break"; b.textContent="فسحة"; tr.appendChild(b);
      }
      let td=document.createElement('td');
      td.contentEditable = isAdmin;
      td.innerText = data[currentClass][day][i] || "";
      td.addEventListener('blur',()=>{
        data[currentClass][day][i]=td.innerText; save();
      });
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
}
function render(){ renderSelect(); renderTable(); }
select.onchange=()=>{ currentClass=select.value; render(); };

document.getElementById('adminBtn').onclick=()=>document.getElementById('loginModal').classList.remove('hidden');
document.getElementById('closeModal').onclick=()=>document.getElementById('loginModal').classList.add('hidden');
document.getElementById('loginSubmit').onclick=()=>{
  if(document.getElementById('passwordInput').value===pass){
    isAdmin=true; document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    document.getElementById('adminBtn').classList.add('hidden');
    document.getElementById('passwordInput').value=""; render();
  } else document.getElementById('loginError').innerText="الباسورد غلط!";
};
document.getElementById('logoutBtn').onclick=()=>{ isAdmin=false; document.getElementById('adminPanel').classList.add('hidden'); document.getElementById('logoutBtn').classList.add('hidden'); document.getElementById('adminBtn').classList.remove('hidden'); render(); };
document.getElementById('addClassBtn').onclick=()=>{
  let n=document.getElementById('newClassName').value.trim();
  if(!n) return alert('اكتب اسم الفصل');
  if(data[n]) return alert('الفصل ده موجود');
  data[n]={}; DAYS.forEach(d=>data[n][d]=["","","","","","",""]);
  currentClass=n; document.getElementById('newClassName').value=""; save(); render();
};
document.getElementById('deleteClassBtn').onclick=()=>{
  if(confirm('تحذف فصل '+currentClass+' ؟')){ delete data[currentClass]; let keys=Object.keys(data); if(!keys.length){ alert('لازم فصل واحد على الأقل'); return; } currentClass=keys[0]; save(); render(); }
};
document.getElementById('changePassBtn').onclick=()=>{
  let np=document.getElementById('newPassword').value.trim();
  if(np.length<4) return alert('الباسورد لازم 4 حروف على الأقل');
  pass=np; localStorage.setItem('shaarawy_pass2',np); alert('تم! الباسورد الجديد: '+np); document.getElementById('newPassword').value="";
};
render();