const noteInput = document.getElementById("noteInput");
const categorySelect = document.getElementById("categorySelect");
const saveBtn = document.getElementById("saveBtn");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchInput");
const exportBtn = document.getElementById("exportBtn");
const toggleDark = document.getElementById("toggleDark");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
renderNotes();

saveBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  const category = categorySelect.value;
  if (text === "") return alert("Please enter a note!");

  const note = {
    id: Date.now(),
    text,
    category,
    date: new Date().toLocaleString(),
    pinned: false
  };
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  noteInput.value = "";
  categorySelect.value = "";
  renderNotes();
});

function renderNotes() {
  notesList.innerHTML = "";
  let filtered = notes.filter(n =>
    n.text.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  filtered.sort((a, b) => b.pinned - a.pinned); // pinned first

  filtered.forEach(note => {
    const div = document.createElement("div");
    div.className = "note" + (note.pinned ? " pinned" : "");
    div.innerHTML = `
      <strong>${note.category || "📝 Note"}</strong><br>
      ${note.text.replace(/\n/g, "<br>")}<br>
      <small>${note.date}</small>
      <div class="actions">
        <button onclick="togglePin(${note.id})">${note.pinned ? "Unpin" : "📌 Pin"}</button>
        <button onclick="editNote(${note.id})">✏ Edit</button>
        <button onclick="deleteNote(${note.id})">🗑 Delete</button>
      </div>
    `;
    notesList.appendChild(div);
  });
}

function togglePin(id) {
  notes = notes.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n));
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

function editNote(id) {
  const note = notes.find(n => n.id === id);
  const newText = prompt("Edit note:", note.text);
  if (newText !== null) {
    note.text = newText;
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
  }
}

function deleteNote(id) {
  if (confirm("Delete this note?")) {
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
  }
}

searchInput.addEventListener("input", renderNotes);

exportBtn.addEventListener("click", () => {
  const csvContent = "data:text/csv;charset=utf-8," +
    notes.map(n => `"${n.category}","${n.text}","${n.date}"`).join("\n");
  const a = document.createElement("a");
  a.setAttribute("href", encodeURI(csvContent));
  a.setAttribute("download", "notes.csv");
  a.click();
});

toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
