async function loginFormHandler(event) {
  event.preventDefault();

  const login = document.querySelector("#floatingInput").value.trim();
  const password = document.querySelector("#floatingPassword").value.trim();
  const userEl = document.querySelector("#user-el");
  const loginEl = document.querySelector("#floatingInput");
  const invalidUserPass = document.createElement("div");
  if (login && password) {

    const response = await fetch("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        username: login,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      loginEl.setAttribute("class", "form-control is-invalid");
      loginEl.setAttribute("aria-describedby", "validationServer04Feedback");
      loginEl.setAttribute("required", "true");
      invalidUserPass.setAttribute("id", "validationServer04Feedback");
      invalidUserPass.setAttribute("class", "invalid-feedback");
      invalidUserPass.innerHTML = "Invalid Username or Password!";
      userEl.appendChild(invalidUserPass);
    }
  }
}

async function removeInvalidText (event) {
  event.preventDefault();
  document.getElementById("validationServer04Feedback").remove();
  document.querySelector("#floatingInput").setAttribute("class", "form-control");
}


document.querySelector("#login").addEventListener("click", loginFormHandler);
document.getElementById("user-el").addEventListener("focus", removeInvalidText, true);
document.getElementById("floatingPassword").addEventListener("focus", removeInvalidText, true);
