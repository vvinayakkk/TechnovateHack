// content.js

function getProductTitle() {
  const titleElement = document.getElementById("productTitle");
  return titleElement ? titleElement.innerText.trim() : null;
}

const productTitle = getProductTitle();
console.log("Product title: ", productTitle);
if (productTitle) {
  chrome.runtime.sendMessage({ action: "findEcoFriendly", title: productTitle });
}
