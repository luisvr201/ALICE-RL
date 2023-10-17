let API_KEY = "";

  document.addEventListener("DOMContentLoaded", function () {
    const apiKeyModal = document.getElementById("api-key-modal");
    const submitApiKeyButton = document.getElementById("submit-api-key");

    function showApiKeyModal() {
      apiKeyModal.style.display = "block";
    }

      function hideApiKeyModal() {
      document.getElementById("api-key-input").value = "";
      apiKeyModal.style.display = "none";
    }

    submitApiKeyButton.addEventListener("click", () => {
      const apiKeyInput = document.getElementById("api-key-input");
      API_KEY = apiKeyInput.value.trim();  //Aqui se almacena la clave que se ingresa "API_KEY"
      const apiKey = API_KEY;
      if (apiKey) {
        hideApiKeyModal();
      } else {
        showCustomAlert("Por favor ingrese una clave válida.");
      }
    });

    // Muestra el cuadro de diálogo modal al cargar la página.
    showApiKeyModal();
  });