document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const form = e.target;
    const data = {
      name: form.name.value,
      mobile: form.mobile.value,
      email: form.email.value,
      query: form.query.value
    };
  
    fetch("https://sheet.best/api/sheets/YOUR-SHEET-ID", { // replace with your SheetBest API URL
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (res.ok) {
        form.reset();
        showPopup();
      } else {
        alert("Something went wrong. Try again.");
      }
    })
    .catch(() => alert("Network error. Please try again later."));
  });
  
  function showPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "block";
    setTimeout(() => popup.style.display = "none", 3000);
  }
  