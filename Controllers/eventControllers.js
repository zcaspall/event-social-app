"use strict";
const eventModels = require("../Models/eventModels");

async function createEvent(req, res){
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        return res.sendStatus(403);
    }
    const hostId = user.userID;
    const {eventName, eventDate, eventDescription} = req.body;
    const eventLocation = JSON.parse(req.body.eventLocation);

    const locationName = eventLocation.properties.formatted;
    const lattitude = eventLocation.properties.lat;
    const longitude = eventLocation.properties.lon;

    await eventModels.addNewEvent(hostId, eventName, eventDate, locationName, lattitude, longitude, eventDescription);
    res.sendStatus(200);
}

function getSearchResultsByKeyword(req, res){
    const events = eventModels.getEventsByKeyword(req.body.keyword);

    res.render("searchResults", {events});
}

module.exports = { 
    createEvent,
    getSearchResultsByKeyword,
}