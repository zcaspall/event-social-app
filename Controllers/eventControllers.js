"use strict";
const eventModels = require("../Models/eventModels");

function renderMain (req, res) {
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        return res.sendStatus(403);
    }
    const hostId = user.userID;
    const events = eventModels.getEventsByHost(hostId);

    res.render("mainPage", {events});
}

async function createEvent(req, res, next){
    console.log(req.file);
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

    console.log("test");
    res.redirect(`/`);
}

function getSearchResultsByKeyword(req, res){
    const events = eventModels.getEventsByKeyword(req.body.keyword);

    res.render("searchResults", {events});
}

module.exports = { 
    renderMain,
    createEvent,
    getSearchResultsByKeyword,
}