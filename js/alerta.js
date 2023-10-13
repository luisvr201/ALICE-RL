  function showCustomAlert(message) {
    const customAlert = document.getElementById("custom-alert");
    const customAlertMessage = document.getElementById("custom-alert-message");
    customAlertMessage.textContent = message;
    customAlert.classList.remove("hidden");
  }

  function closeCustomAlert() {
    const customAlert = document.getElementById("custom-alert");
    customAlert.classList.add("hidden");
  }