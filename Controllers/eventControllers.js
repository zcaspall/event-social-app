"use strict";
const eventModels = require("../Models/eventModels");

function renderMain (req, res) {
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        return res.sendStatus(403);
    }
    const hostId = user.userID;
    const events = eventModels.getEventsByHost(hostId);

    console.log(events);

    res.render("mainPage", {events});
}

async function createEvent(req, res, next){
    console.log(req.file);

    const { path, filename } = req.file;
    const { user, isLoggedIn } = req.session;

    if (!isLoggedIn) {
        return res.sendStatus(403);
    }

    const hostId = user.userID;
    const {eventName, eventDate, eventDescription} = req.body;
    const eventLocation = JSON.parse(req.body.eventLocationData);

    const locationName = eventLocation.properties.formatted;
    const lattitude = eventLocation.properties.lat;
    const longitude = eventLocation.properties.lon;

    res.redirect(`/`);

    await eventModels.addNewEvent(hostId, eventName, eventDate, locationName, lattitude, longitude, eventDescription, filename, path);
}

function getSearchResultsByKeyword(req, res){
    const events = eventModels.getEventsByKeyword(req.body.keyword);

    res.render("searchResults", {events});
}

module.exports = { 
    renderMain,
    createEvent,
    getSearchResultsByKeyword,
};