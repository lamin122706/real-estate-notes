const openBtn = document.getElementById("openFormBtn");
const closeBtn = document.getElementById("closeFormBtn");
const modal = document.getElementById("formModal");
const form = document.getElementById("propertyForm");
const list = document.getElementById("propertyList");

// open/close modal
openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

// save property
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  const property = { title, price, location, description };

  // save to localStorage
  let properties = JSON.parse(localStorage.getItem("properties")) || [];
  properties.push(property);
  localStorage.setItem("properties", JSON.stringify(properties));

  form.reset();
  modal.style.display = "none";
  renderProperties();
});

// render property list
function renderProperties() {
  list.innerHTML = "";
  const properties = JSON.parse(localStorage.getItem("properties")) || [];
  properties.forEach((p, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.title}</strong> - ${p.price} Ks <br>📍 ${p.location} <br>${p.description}`;
    list.appendChild(li);
  });
}

// load on start
renderProperties();
