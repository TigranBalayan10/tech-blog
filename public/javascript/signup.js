async function signupFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector("#floatingInput").value.trim();
  const monthly_income = document.querySelector("#floatingIncome").value.trim();
  const password = document.querySelector("#floatingPassword").value.trim();
  const passwordValidation = document.querySelector("#floatingPassword");
  const passwordEl = document.querySelector("#pass-el");
  if (username && monthly_income && password.length >= 4) {
    const response = await fetch("api/users/signup", {
      method: "post",
      body: JSON.stringify({
        username,
        password,
        monthly_income,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.replace("/dashboard/");
    } else {
      console.log(response.statusText);
    }
  } else {
    passwordValidation.setAttribute("class", "form-control is-invalid");
    passwordValidation.setAttribute(
      "aria-describedby",
      "validationServer03Feedback"
    );
    passwordValidation.setAttribute("required", "true");
    const invalidPasswordEl = document.createElement("div");
    invalidPasswordEl.setAttribute("id", "validationServer03Feedback");
    invalidPasswordEl.setAttribute("class", "invalid-feedback");
    invalidPasswordEl.innerHTML = "Password must be at least 4 characters long";
    passwordEl.appendChild(invalidPasswordEl);
  }
}

async function removeInvalidText (event) {
  event.preventDefault();
  document.getElementById("validationServer03Feedback").remove();
  document.querySelector("#floatingPassword").setAttribute("class", "form-control");
}

document
  .querySelector("#signup-form")
  .addEventListener("click", signupFormHandler);

document
  .getElementById("floatingPassword")
  .addEventListener("focus", removeInvalidText, true);
