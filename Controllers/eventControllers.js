"use strict";
const eventModels = require("../Models/eventModels");

function renderMain (req, res) {
    const { user, isLoggedIn } = req.session;
    if (!user || !isLoggedIn) {
        return res.redirect("/login");
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
        return res.redirect("/login");
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
        return res.redirect("/login");
    }
    const events = eventModels.getAllEvents();
    res.render("eventsPage", {events});
}

function renderEvent(req, res) {
    const { user, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        return res.redirect("/login");
    }

    const event = eventModels.getEventById(req.params.eventId);
    res.render("event", {event});
}

module.exports = { 
    renderMain,
    createEvent,
    renderEventPage,
    renderEvent
};