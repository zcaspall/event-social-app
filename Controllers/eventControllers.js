"use strict";
const eventModels = require("../Models/eventModels");
function renderMain (req, res) {
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        return res.sendStatus(403);
    }
    const hostId = user.userID;
    const hostedEvents = eventModels.getEventsByHost(hostId);
    const attendedEvents = eventModels.getEventsAttendedByUser(hostId);

    res.render("mainPage", {hostedEvents, attendedEvents});
}

<<<<<<< HEAD
async function createEvent(req, res, next){
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

    res.redirect(`/:${hostId}`);

    await eventModels.addNewEvent(hostId, eventName, eventDate, locationName, lattitude, longitude, eventDescription, filename, path);
}

function renderEventPage(req, res) {
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        return res.sendStatus(403);
    }
    console.log("test")
    const events = eventModels.getAllEvents();

=======
function renderMain (req, res) {
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        return res.sendStatus(403);
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
        return res.sendStatus(403);
    }

    const hostId = user.userID;
    const {eventName, eventDate, eventDescription} = req.body;
    const eventLocation = JSON.parse(req.body.eventLocationData);

    const locationName = eventLocation.properties.formatted;
    const lattitude = eventLocation.properties.lat;
    const longitude = eventLocation.properties.lon;

    res.redirect(`/:${hostId}`);

    await eventModels.addNewEvent(hostId, eventName, eventDate, locationName, lattitude, longitude, eventDescription, filename, path);
}

function renderEventPage(req, res) {
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        return res.sendStatus(403);
    }
    console.log("test")
    const events = eventModels.getAllEvents();

>>>>>>> 261d0ad86a250a1593211f0e9a587dc79fc9c681
    res.render("eventsPage", {events});
}

function getSearchResultsByKeyword(req, res){
    const events = eventModels.getEventsByKeyword(req.body.keyword);

    res.render("searchResults", {events});
}
module.exports = { 
    renderMain,
    createEvent,
    renderEventPage,
};