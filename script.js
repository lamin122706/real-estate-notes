const notesContainer = document.getElementById('notes');
const saveButton = document.querySelector('button');
const textarea = document.querySelector('textarea');
const searchBox = document.querySelector('input[type="search"]');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function renderNotes(filter = '') {
  notesContainer.innerHTML = '';
  notes
    .filter(note => note.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach((note, index) => {
      const noteDiv = document.createElement('div');
      noteDiv.className = "note-card";
      noteDiv.innerHTML = `
        <p>${note.text}</p>
        <div>
          <button onclick="editNote(${index})">✏ Edit</button>
          <button onclick="deleteNote(${index})">🗑 Delete</button>
        </div>
      `;
      notesContainer.appendChild(noteDiv);
    });
}

saveButton.addEventListener('click', () => {
  const text = textarea.value.trim();
  if (text) {
    notes.push({ text });
    localStorage.setItem('notes', JSON.stringify(notes));
    textarea.value = '';
    renderNotes();
  }
});

function editNote(index) {
  const newText = prompt("✏ Edit note:", notes[index].text);
  if (newText !== null) {
    notes[index].text = newText;
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
  }
}

function deleteNote(index) {
  if (confirm("🗑 Delete this note?")) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
  }
}

searchBox.addEventListener('input', (e) => {
  renderNotes(e.target.value);
});

renderNotes();
