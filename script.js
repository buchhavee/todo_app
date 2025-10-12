"use strict";

// Hent data fra localStorage
// Henter eksisterende todos fra browserens localStorage.
const toDoArr = JSON.parse(localStorage.getItem("localstorage") || "[]");

// Vælg DOM-elementer
// Henviser til de nødvendige HTML-elementer, så de kan bruges i koden.
const submit = document.querySelector("#submit");
const todoNameInput = document.querySelector("#todo-name-input");
const todoContainer = document.querySelector(".todo-list");
const doneContainer = document.querySelector(".done-list");
const clearBtn = document.getElementById("clear");

// Event listeners til at oprette ny todo
// Gør det muligt at tilføje en todo med klik eller Enter.
submit.addEventListener("click", submitTodo);
todoNameInput.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") {
    submitTodo();
  }
});

// Tilføj ny todo
// Funktion der opretter et todo-objekt og tilføjer det til listen.
function submitTodo(evt) {
  const todo = {
    name: todoNameInput.value, // Navnet på todoen
    id: self.crypto.randomUUID(), // Unik id
    done: false, // Status: ikke færdig
    createdAt: new Date().toLocaleString(), // Oprettelsesdato
    doneAt: null, // Afslutningsdato (hvis færdig)
  };

  // Tilføjer todoen forrest i arrayet, så den vises øverst
  toDoArr.unshift(todo);

  writeTodos();
}

// Initiel rendering af todos
// Viser todos ved load af siden
writeTodos();

// Funktion til at vise og opdatere todos
function writeTodos() {
  // Gemmer alle todos i localStorage
  localStorage.setItem("localstorage", JSON.stringify(toDoArr));

  // Rydder listerne i DOM
  todoContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  // Opdaterer tællere for aktive og færdige todos
  const todoCount = toDoArr.filter((todo) => !todo.done).length;
  const doneCount = toDoArr.filter((todo) => todo.done).length;
  document.getElementById("todo-count").textContent = `(${todoCount})`;
  document.getElementById("done-count").textContent = `(${doneCount})`;

  // Gennemgår alle todos og tilføjer dem til den rigtige liste
  toDoArr.forEach((todo) => {
    let isChecked;
    if (todo.done === true) {
      isChecked = "checked";
    } else {
      isChecked = "";
    }

    // Opretter et listeelement for todoen
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    li.className = "todo-item";
    li.innerHTML = `
  <div>
    <h3>${todo.name}</h3>
    <div class="todo-date"> <small>${todo.createdAt ? todo.createdAt : ""}</small></div>
    ${todo.doneAt ? `<div class="done-date"><small>Udført: ${todo.doneAt}</small></div>` : ""}
  </div>
  <div class="todo-controls">
    <input type="checkbox" ${isChecked}>
    <button class="delete-btn" title="Slet">🗑️</button>
  </div>
`;

    // Checkbox: marker som færdig/ikke færdig
    // Når brugeren klikker på checkboxen, opdateres done-status og evt. afslutningsdato
    const checkbox = li.querySelector("input");
    checkbox.addEventListener("click", (evt) => {
      evt.preventDefault();
      const correspondingDataObj = toDoArr.find((todo) => todo.id === li.dataset.id);
      correspondingDataObj.done = !correspondingDataObj.done;

      // Tilføj/fjern afslutningsdato
      if (correspondingDataObj.done) {
        correspondingDataObj.doneAt = new Date().toLocaleString();
      } else {
        correspondingDataObj.doneAt = null;
      }

      writeTodos();
    });

    // Slet-knap: fjern todo
    // Når brugeren klikker på slet, fjernes todoen fra arrayet og listen opdateres
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (evt) => {
      const idSlet = toDoArr.findIndex((todo) => todo.id === li.dataset.id);
      if (idSlet !== -1) {
        toDoArr.splice(idSlet, 1);
        writeTodos();
      }
    });

    // Tilføjer todoen til den rigtige liste (aktiv eller færdig)
    if (todo.done) {
      doneContainer.appendChild(li);
    } else {
      todoContainer.appendChild(li);
    }
  });

  // Clear-knap: ryd alle todos
  // Når brugeren klikker på clear, slettes alle todos og localStorage tømmes
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.clear();
      toDoArr.length = 0;
      writeTodos();
    });
  }
}
