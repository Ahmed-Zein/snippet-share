var logoutForm = document.getElementById("loginForm");
logoutForm.addEventListener("submit", submitForm);

async function submitForm(e) {
  e.preventDefault();

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  try {
    const response = await axios.post("http://localhost:3000/signin", {
      email: email,
      password: password,
    });
    console.log(response.status);
    if (!response) {
      console.error("error occured with token");
    }
    localStorage.setItem("jwtToken", response.data.token);

    window.location.href = "index.html";
  } catch (e) {
    console.error(e);
  }
}
