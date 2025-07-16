const scriptURL = "https://script.google.com/macros/s/AKfycbxsQHYnioANwNZB8b5K-o-noju46gvicfZXh-jO-VLiwihURX6pP6cyyCsJuIJ7ieQx/exec";

// UI Switching
document.getElementById("show-signup").onclick = () => {
  document.getElementById("signin-box").classList.replace("show", "hide");
  document.getElementById("signup-box").classList.replace("hide", "show");
};

document.getElementById("show-signin").onclick = () => {
  document.getElementById("signup-box").classList.replace("show", "hide");
  document.getElementById("signin-box").classList.replace("hide", "show");
};

// Popup message
function showPopup(message, type = "success") {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.className = `popup ${type}`;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}

// Sign Up
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    action: "register",
    name: document.getElementById("signup-name").value,
    email: document.getElementById("signup-email").value,
    password: document.getElementById("signup-password").value,
    phone: document.getElementById("signup-phone").value,
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        showPopup("Signup successful!", "success");
        setTimeout(() => window.location.href = "top.html", 2000);
      } else {
        showPopup("Signup failed.", "error");
      }
    });
});

// Sign In
// Sign In
document.getElementById("signin-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    action: "login",
    email: document.getElementById("signin-email").value,
    password: document.getElementById("signin-password").value,
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        localStorage.setItem('loggedInUser', data.email); // ✅ save email!
        showPopup("Login successful!", "success");
        setTimeout(() => window.location.href = "top.html", 2000);
      } else {
        showPopup("Invalid credentials.", "error");
      }
    });
});


// Toggle Password Visibility
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const targetInput = document.getElementById(icon.dataset.target);
    const isPassword = targetInput.getAttribute("type") === "password";
    targetInput.setAttribute("type", isPassword ? "text" : "password");
    icon.textContent = isPassword ? "🙈" : "👁️";
  });
});
