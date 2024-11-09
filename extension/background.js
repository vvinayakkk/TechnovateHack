let ecoProductUrl = "";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "findEcoFriendly") {
    const productTitle = request.title;
    const apiUrl = `http://192.168.137.37:8000/api/top-productsone/?query=${encodeURIComponent(productTitle + " Eco Friendly Green Reusuable Sustainable")}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.product) {
          ecoProductUrl = data.product.product_url;

          chrome.notifications.create("ecoFriendlyNotification", {
            type: "basic",
            iconUrl: "icons/icon.png",
            title: "Eco-Friendly Alternative Found!",
            message: "Click here to view the eco-friendly version of this product.",
            isClickable: true,
          });
        } else {
          console.error("No eco-friendly product found", data);
        }
      })
      .catch((error) => console.error("Error fetching eco-friendly product:", error));
  }
});

chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === "ecoFriendlyNotification" && ecoProductUrl) {
    chrome.tabs.create({ url: ecoProductUrl });
  }
});
