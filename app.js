const form = document.querySelector("form");
const nameInput = document.querySelector("#name-input");
const majorInput = document.querySelector("#major-input");
const submitBtn = document.querySelector(".submit-btn");
const tBody = document.querySelector("tbody");

let isEditing = false;
let currentEditionId;

const url = "http://localhost:4000/api/v1/students";

async function displayData() {
  try {
    const reponse = await fetch(url);
    const apiData = await reponse.json();

    const studentsData = apiData.data.students;
    console.table(studentsData);

    studentsData.forEach((item) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.major}</td>
        <td>
            <button type="button" class="delete-btn" data-id="${item.id}">Delete</button>
            <button type="button" class="edit-btn" data-id="${item.id}">Edit</button>
        </td>
    `;

      tBody.appendChild(tr);
    });

    addEventListenerToAllButtons();
  } catch (err) {
    console.error("Get error:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.textContent = "Submit";

  try {
    if (isEditing) {
      const reponse = await fetch(`${url}/${currentEditionId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: nameInput.value,
          major: majorInput.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await reponse.json();
      console.log("Patch data:", data);

      tBody.innerHTML = "";
      displayData();

      isEditing = false;
    } else {
      const reponse = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: nameInput.value,
          major: majorInput.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await reponse.json();
      console.log("Post data:", data);

      const tr = document.createElement("tr");
      const { name, major, id } = data.data.newStudent;
      tr.innerHTML = `
        <td>${name}</td>
        <td>${major}</td>
        <td>
            <button type="button" class="delete-btn" data-id="${id}">Delete</button>
            <button type="button" class="edit-btn" data-id="${id}">Edit</button>
        </td>
      `;
      tBody.appendChild(tr);
      addEventListenerToAllButtons();
    }

    nameInput.value = "";
    majorInput.value = "";
  } catch (err) {
    console.error("Post error", err);
  }
});

function addEventListenerToAllButtons() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteStudent);
  });

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", editStudentData);
  });
}

const deleteStudent = (e) => {
  const id = e.target.dataset.id;
  const tr = e.target.closest("tr");

  try {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error("Delete error:", err);
  }

  tr.remove();
};

const editStudentData = async (e) => {
  isEditing = true;
  const id = e.target.dataset.id;
  const response = await fetch(`${url}/${id}`);
  const data = await response.json();
  console.log("Get one student data for edition", data);

  const { name, major } = data.data.student;
  nameInput.value = name;
  majorInput.value = major;
  submitBtn.textContent = "Save";

  currentEditionId = id;
};

displayData();
