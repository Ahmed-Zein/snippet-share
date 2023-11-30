
const snippetForm = document.getElementById("snippetForm");
snippetForm.addEventListener("submit", submitForm);

async function submitForm(event) {
  const token = localStorage.getItem("jwtToken");
  console.log(token);
  if (!token) {
    console.log("unAuthorized request no token found");
    window.location.href = "login.html";
  }
  event.preventDefault();
  const formData = new FormData(snippetForm);

  const data = {};
  formData.forEach(function (value, key) {
    data[key] = value;
  });

  try {
    const response = await axios.post(
      "http://localhost:3000/api/create",
      {
        ...data,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log(response.status);
    // window.location.href = "index.html";
  } catch (e) {
    console.error(e);
  }
}
