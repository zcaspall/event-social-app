"use strict";

const addressInput = document.getElementById("eventLocation");

addressInput.addEventListener("input", (e) => {
  const currentValue = e.target.value;

  if (currentValue.length < 3) {
    return;
  }
  
  const getAddress = async () => {
    const apiKey = "cb16e3e2337a4d83bc0898697bb55f4f";
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&apiKey=${apiKey}`;
    const response = await fetch(url);
    if (response.ok) {
      try {
        const data = await response.json();
        
        if (document.getElementById("autocomplete-container")) {
          closeDropDownList();
        }
        const autoCompleteContainer = document.createElement("ul");
        autoCompleteContainer.setAttribute("id", "autocomplete-container");
        document.getElementById("location-container").appendChild(autoCompleteContainer);
        
        const addressDataContainer = document.getElementById("eventLocationData");
        const results = data.features;

        data.features.forEach((feature, index) => {
          const address = document.createElement("li");
          address.innerText = feature.properties.formatted;
          address.classList.add("address");
          autoCompleteContainer.appendChild(address);

          address.addEventListener("click", (e) => {
            addressInput.value = results[index].properties.formatted;
            addressDataContainer.value = JSON.stringify(results[index]);

            closeDropDownList();
          });
        });
        
      } catch (err) {
        console.error("failed to parse json response");
      }
    }

  };
  
  setTimeout(getAddress(), 1000);

});

function closeDropDownList() {
  if (document.getElementById("autocomplete-container")) {
    document.getElementById("autocomplete-container").remove();
  }
}