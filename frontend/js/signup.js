var loginForm = document.getElementById("singupForm");
loginForm.addEventListener("submit", submitForm);

async function submitForm(e) {
  e.preventDefault();

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var name = document.getElementById("name").value;

  try {
    const response = await axios.post("http://localhost:3000/signup", {
      name: name,
      email: email,
      password: password,
    });
    console.log(response.status);
    if (!response) {
      console.error("error occured with token");
    }
    localStorage.setItem("jwtToken", response.data.token);
    console.log("hi");
    window.location.href = "index.html";
    console.log("hiw");
  } catch (e) {
    console.error(e);
  }
}
