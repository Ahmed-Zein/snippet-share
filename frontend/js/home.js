var logoutForm = document.getElementById("logoutForm");
logoutForm.addEventListener("submit", submitForm);

function submitForm(event) {
  event.preventDefault();

  localStorage.clear();
  window.location.href = "login.html";
}

const checkTokenExist = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.log("unAuthorized request no token found");
    window.location.href = "login.html";
  }
  return token;
};

const loadSnippets = async () => {
  const options = {
    method: "GET",
    url: "http://localhost:3000/api",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  };
  try {
    const data = (await axios.request(options)).data.snippets;
    const tbody = document
      .getElementById("snippetTable")
      .getElementsByTagName("tbody")[0];

    for (const item of data) {
      const row = document.createElement("tr");

      const titleCell = document.createElement("td");
      titleCell.textContent = item.title;
      row.appendChild(titleCell);

      const createdAtCell = document.createElement("td");
      createdAtCell.textContent = item.createdAt.split("T")[0];
      row.appendChild(createdAtCell);

      tbody.appendChild(row);
    }
  } catch (e) {
    console.error(e);
    window.location.href = "login.html";
  }
};

loadSnippets();
