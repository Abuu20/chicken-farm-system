// ⚡ IMPORTANT: Replace this with your Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHQC2H1LCCPwUzIkRGaV23BlUY133oY5oFg9DwsqEACLX8bE7FYqOj76ShuZ21M0pe/exec";

document.getElementById("dataForm").addEventListener("submit", function(e) {
  e.preventDefault(); // stop page reload

  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "append", ...data }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(json => {
    document.getElementById("response").innerText =
      "✅ Success: " + JSON.stringify(json);
    this.reset(); // clear form after success
  })
  .catch(err => {
    document.getElementById("response").innerText =
      "❌ Error: " + err.message;
  });
});
