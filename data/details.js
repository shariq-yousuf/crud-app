const params = new URLSearchParams(location.search);
const id = params.get("id");

const tBody = document.querySelector("tbody");
const age = document.querySelector("#age");
const major = document.querySelector("#major");
const nameEl = document.querySelector("#student-name");

const url = "http://localhost:4000/api/v1/students";

console.log(id);

const displayData = async () => {
  const response = await fetch(`${url}/${id}`);
  const data = await response.json();
  const studentData = data.data.student;
  console.table(studentData);

  nameEl.textContent = studentData.name;
  age.textContent = studentData.age;
  major.textContent = studentData.major;

  for (course of studentData.courses) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${course.courseName}</td>
      <td>${course.grade}</td>
    `;
    tBody.appendChild(tr);
  }
};

displayData();
