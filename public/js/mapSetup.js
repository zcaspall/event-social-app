"use strict"

  let map;
  let infoWindow;

  // Initializing map and panning to current location code is
  // mostly taken from the documentation. Was planning on adding
  // custom markers but I could not get it to work in time.
  // https://developers.google.com/maps/documentation/javascript

  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 35.8423, lng: -90.7043 },
      zoom: 12,
    });
    infoWindow = new google.maps.InfoWindow();
  
    const locationButton = document.createElement("button");
  
    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = { lat: position.coords.latitude, lng: position.coords.longitude,};

            infoWindow.setPosition(pos);
            infoWindow.setContent("You have been located, lock your doors");
            infoWindow.open(map);
            map.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    });

    const infowindow2 = new google.maps.InfoWindow({
      content: "I could not figure out how to do this right. Feel free to point and laugh",
    });

    const marker = new google.maps.Marker({
      position: {lat: 35.771110, lng: -90.722360},
      map,
      title: "poo poo palace :(",

    });

    marker.addListener("click", ()=> {
      infowindow2.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });

  }
  
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }
  
  window.initMap = initMap;