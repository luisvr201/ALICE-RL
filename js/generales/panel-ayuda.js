function setupPopSizeListener(width, height, element) {
}

setupPopSizeListener(750, 600, document.getElementById("help-popup"));
  
function openHelpPopup() {
  document.getElementById("help-popup").classList.remove("hidden");
}

function closeHelpPopup() {
  document.getElementById("help-popup").classList.add("hidden");
}