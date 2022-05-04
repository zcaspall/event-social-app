"use strict";
const eventModels = require("../Models/eventModels");

function renderMain (req, res) {
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        res.redirect("/login");
    }
    const hostId = user.userID;
    const hostedEvents = eventModels.getEventsByHost(hostId);
    const attendedEvents = eventModels.getEventsAttendedByUser(hostId);

    res.render("mainPage", {hostedEvents, attendedEvents});
}

async function createEvent(req, res, next){
    const { path, filename } = req.file;
    const { user, isLoggedIn } = req.session;

    if (!isLoggedIn) {
        res.redirect("/login");
    }
    const hostId = user.userID;
    const {eventName, eventDate, eventDescription} = req.body;
    const eventLocation = JSON.parse(req.body.eventLocationData);
    const locationName = eventLocation.properties.formatted;
    const lattitude = eventLocation.properties.lat;
    const longitude = eventLocation.properties.lon;

    res.redirect("/");

    await eventModels.addNewEvent(hostId, eventName, eventDate, locationName, lattitude, longitude, eventDescription, filename, path);
}

function renderEventPage(req, res) {
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        res.redirect("/login");
    }
    const events = eventModels.getAllEvents();
    res.render("eventsPage", {events});
}

function getSearchResultsByKeyword(req, res){
    const events = eventModels.getEventsByKeyword(req.body.keyword);

    res.render("searchResults", {events});
}

function uploadEventPics(req, res){
    eventImages.array("eventImages");
    console.log(req.files);
    console.log(req.body);
    res.sendStatus(200);
}

module.exports = { 
    renderMain,
    createEvent,
    getSearchResultsByKeyword,
    uploadEventPics,
    renderEventPage,
};
