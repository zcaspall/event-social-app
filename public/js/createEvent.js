"use strict";
require("dotenv").config();

const form = document.getElementById("createEventForm");

form.addEventListener("submit", submitCreateEventForm);

const locationContainer = document.getElementById("locationContainer");

function autocompleteAddress() {
    const inputContainer = document.createElement("div");
    inputContainer.setAttribute("class", "input-container");
    locationContainer.appendChild(inputContainer);

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Enter an address...");
    inputContainer.appendChild(input);

    // Probably will move to validator later
    const MIN_ADDRESS_LENGTH = 3;
    const DEBOUNCE_DELAY = 300;

    let currentItems;

    input.addEventListener("input", (e) => {
        const currentValue = this.value;

        // Cancel previous timeout
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }

        if (currentPromiseReject) {
            currentPromiseReject({
                canceled: true
            });
        }

        currentTimeout = setTimeout(() => {
                currentTimeout = null;

            const promise = new Promise((resolve, reject) => {
                currentPromiseReject = reject;
                
                const apiKey = process.env.GEO_API;
                const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&format=json&limit=5&apiKey=${apiKey}`;

                fetch(url)
                    .then(response => {
                        currentPromiseReject = null;

                        if (response.ok) {
                            return response.json().then(data => resolve(data));
                        } else {
                            return response.json().then(data => reject(data));
                        }
                });
            });

            promise.then((data) => {
                currentItems = data.results;

                const autocompleteResultsContainer = document.createElement("div");
                autocompleteItemsElement.setAttribute("class", "autocompleteResults");
                inputContainer.appendChild(autocompleteResultsContainer);

                data.results.forEach((result, index) => {
                    const itemElement = document.createElement("div");

                    itemElement.innerHTML = result.formatted;
                    autocompleteItemsElement.appendChild(itemElement);
                });
            }, (err) => {
                if (!err.canceled) {
                    console.log(err);
                }
            });
        }, DEBOUNCE_DELAY);      
    });
}

function getInputs () {
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;
    const eventLocation = document.getElementById("eventLocation").value;
    const eventDescription = document.getElementById("eventDescription").value;

    return {
        eventName,
        eventDate,
        eventLocation,
        eventDescription
    };
}