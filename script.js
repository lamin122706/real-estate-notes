document.addEventListener("DOMContentLoaded", () => {
  const notesList = document.getElementById("notesList");
  const noteInput = document.getElementById("noteInput");
  const saveBtn = document.getElementById("saveBtn");
  const searchBox = document.getElementById("searchBox");

  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  function renderNotes(filter = "") {
    notesList.innerHTML = "";
    notes
      .filter(note => note.toLowerCase().includes(filter.toLowerCase()))
      .forEach((note, index) => {
        const li = document.createElement("li");
        li.textContent = note;
        li.addEventListener("click", () => deleteNote(index));
        notesList.appendChild(li);
      });
  }

  function addNote() {
    if (noteInput.value.trim() === "") return;
    notes.push(noteInput.value.trim());
    localStorage.setItem("notes", JSON.stringify(notes));
    noteInput.value = "";
    renderNotes();
  }

  function deleteNote(index) {
    if (confirm("Delete this note?")) {
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
    }
  }

  saveBtn.addEventListener("click", addNote);
  searchBox.addEventListener("input", (e) => renderNotes(e.target.value));

  renderNotes();
});
