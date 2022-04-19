"use strict";

const addressInput = document.getElementById("eventLocation");

addressInput.addEventListener("input", (e) => {
  const currentValue = e.target.value;
  
  // closeDropDownList();
  
  const getAddress = async () => {
    const apiKey = "cb16e3e2337a4d83bc0898697bb55f4f";
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&apiKey=${apiKey}`;
    const response = await fetch(url);
    if (response.ok) {
      try {
        const data = await response.json();
        
        const autoCompleteContainer = document.getElementById("autocomplete-container");

        
      } catch (err) {
        console.error("failed to parse json response");
      }
    }
  };

  getAddress();
});

const form = document.getElementById("createEventForm");

form.addEventListener("submit", submitCreateEventForm);

async function submitCreateEventForm (event) {
  event.preventDefault();
  
  const body = getInputs();

  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      try {
        const data = await response.json();
        console.log(data);
      } catch (e) {
        console.error("Failed to parse json response");
      }
    } else {
      if (response.status === 400) {
        const data = await response.json();
        console.log(data);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function getInputs () {
  const eventName = document.getElementById("eventName").value;
  const eventDate = document.getElementById("eventDate").value;
  const eventImages = document.getElementById("eventImages").value;
  const eventLocation = document.getElementById("eventLocation");
  const eventDescription = document.getElementById("eventDescription").value;
  return {
    eventName,
    eventDate,
    eventImages,
    eventLocation,
    eventDescription
  };
}
  