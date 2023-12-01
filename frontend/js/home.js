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
      console.log(item);
      const row = document.createElement("tr");

      // Create a link (<a>) element
      const titleLink = document.createElement("a");
      titleLink.href = "http://localhost:3000/api/share/?id=" + item._id; // Replace "#" with the actual link you want
      titleLink.textContent = item.title;

      // Create a table cell (<td>) and append the link to it
      const titleCell = document.createElement("td");
      titleCell.appendChild(titleLink);

      // Append the cell to the row
      row.appendChild(titleCell);

      // Create and append other cells as needed
      const createdAtCell = document.createElement("td");
      createdAtCell.textContent = item.createdAt.split("T")[0];
      row.appendChild(createdAtCell);

      // Append the row to the table body
      tbody.appendChild(row);
    }
  } catch (e) {
    console.error(e);
    window.location.href = "login.html";
  }
};

loadSnippets();
