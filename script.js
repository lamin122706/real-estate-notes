// Lightweight CRUD + Search using localStorage
const LS_KEY = "klm_props_v1";

function uid() {
  // simple id generator
  return Date.now() + Math.floor(Math.random()*999);
}

function readStorage(){
  try{
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  }catch(e){
    return [];
  }
}
function writeStorage(arr){
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

/* DOM */
const listEl = document.getElementById("list");
const searchEl = document.getElementById("search");
const btnNew = document.getElementById("btnNew");
const modal = document.getElementById("modal");
const form = document.getElementById("form");
const msg = document.getElementById("msg");

const inputs = {
  id: document.getElementById("id"),
  title: document.getElementById("title"),
  price: document.getElementById("price"),
  location: document.getElementById("location"),
  bedrooms: document.getElementById("bedrooms"),
  bathrooms: document.getElementById("bathrooms"),
  area: document.getElementById("area"),
  description: document.getElementById("description"),
};
const formTitle = document.getElementById("formTitle");
const btnCancel = document.getElementById("btnCancel");

let items = readStorage();
let q = "";

/* render list based on items and q */
function render(){
  const filter = q.trim().toLowerCase();
  const data = items.filter(it => {
    if(!filter) return true;
    return (it.title||"").toLowerCase().includes(filter)
        || (it.location||"").toLowerCase().includes(filter)
        || (it.description||"").toLowerCase().includes(filter);
  });
  listEl.innerHTML = "";
  if(data.length===0){
    listEl.innerHTML = `<div class="card small">No listing တွေ မရှိသေးပါ။ အသစ်ထည့်ပါ။</div>`;
    return;
  }
  for(const it of data){
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <div class="meta">
        <div class="title">${escapeHtml(it.title)}</div>
        <div class="small">ID #${it.id}</div>
      </div>
      <div class="price">${Number(it.price).toLocaleString()} Ks</div>
      <div class="small">📍 ${escapeHtml(it.location)}</div>
      <div class="small">🛏 ${it.bedrooms || 0} • 🛁 ${it.bathrooms || 0} • 📐 ${it.area || 0} sqft</div>
      ${it.description ? `<p class="small">${escapeHtml(it.description)}</p>` : ""}
      <div class="actions">
        <button class="btn" data-action="edit" data-id="${it.id}">ပြင်ရန်</button>
        <button class="btn danger" data-action="delete" data-id="${it.id}">ဖျက်ရန်</button>
      </div>
    `;
    listEl.appendChild(el);
  }
}

/* helpers */
function escapeHtml(s){ return String(s||"").replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function showMessage(text, ms=2000){
  msg.textContent = text;
  msg.classList.remove("hidden");
  setTimeout(()=> msg.classList.add("hidden"), ms);
}

/* open/close modal */
function openModal(editItem){
  modal.classList.remove("hidden");
  if(editItem){
    formTitle.textContent = "Listing ပြင်ဆင်ခြင်း";
    inputs.id.value = editItem.id;
    inputs.title.value = editItem.title || "";
    inputs.price.value = editItem.price || "";
    inputs.location.value = editItem.location || "";
    inputs.bedrooms.value = editItem.bedrooms || "";
    inputs.bathrooms.value = editItem.bathrooms || "";
    inputs.area.value = editItem.area || "";
    inputs.description.value = editItem.description || "";
  }else{
    formTitle.textContent = "Listing အသစ်ထည့်ခြင်း";
    form.reset();
    inputs.id.value = "";
  }
  inputs.title.focus();
}
function closeModal(){
  modal.classList.add("hidden");
}

/* events */
btnNew.addEventListener("click", ()=> openModal(null));
btnCancel.addEventListener("click", (e)=>{ e.preventDefault(); closeModal(); });

form.addEventListener("submit", (ev)=>{
  ev.preventDefault();
  const idVal = inputs.id.value;
  const payload = {
    id: idVal ? Number(idVal) : uid(),
    title: inputs.title.value.trim(),
    price: Number(inputs.price.value) || 0,
    location: inputs.location.value.trim(),
    bedrooms: Number(inputs.bedrooms.value) || 0,
    bathrooms: Number(inputs.bathrooms.value) || 0,
    area: Number(inputs.area.value) || 0,
    description: inputs.description.value.trim(),
    created_at: new Date().toISOString()
  };
  if(!payload.title || !payload.location){ return alert("ခေါင်းစဉ်နဲ့ တည်နေရာ လိုအပ်သည်"); }

  if(idVal){
    // update
    items = items.map(it => it.id === payload.id ? payload : it);
    showMessage("Listing ပြင်ပြီးပါပြီ");
  }else{
    // create add to top
    items.unshift(payload);
    showMessage("Listing အသစ်ထည့်ပြီးပါပြီ");
  }
  writeStorage(items);
  closeModal();
  render();
});

/* delegate edit/delete */
listEl.addEventListener("click",(e)=>{
  const btn = e.target.closest("button");
  if(!btn) return;
  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  if(action === "edit"){
    const it = items.find(x=>x.id===id);
    if(it) openModal(it);
  }else if(action === "delete"){
    if(!confirm("ဖျက်မလား? ပြန်ရယူမရပါဘူး")) return;
    items = items.filter(x=>x.id!==id);
    writeStorage(items);
    render();
    showMessage("Listing ဖျက်ပြီးပါပြီ");
  }
});

/* search (debounce) */
let t;
searchEl.addEventListener("input",(e)=>{
  clearTimeout(t);
  q = e.target.value;
  t = setTimeout(()=> render(), 300);
});

/* init: if empty, seed some samples */
if(items.length===0){
  items = [
    { id: uid(), title:"Downtown Condo", description:"Close to mall and transit", price:95000000, location:"Yangon — Downtown", bedrooms:2, bathrooms:2, area:850, created_at: new Date().toISOString() },
    { id: uid(), title:"Family House", description:"Quiet street, parking included", price:180000000, location:"Mandalay — Chanayethazan", bedrooms:4, bathrooms:3, area:2200, created_at: new Date().toISOString() },
    { id: uid(), title:"New Apartment", description:"Great for investment", price:120000000, location:"Naypyidaw — Zabuthiri", bedrooms:3, bathrooms:2, area:1200, created_at: new Date().toISOString() },
  ];
  writeStorage(items);
}

render();
