"use strict";
const eventModels = require("../Models/eventModels");

async function createEvent(req, res){
    const {eventName, eventDate, locationName, zipcode, latitude, longitude} = req.body;

    if(!req.body.eventName || !req.body.eventDate || !req.body.locationName || !req.body.zipcode || !req.body.latitude || !req.body.longitude){
       return res.sendStatus(400)
    }

    await eventModels.addNewEvent(eventName, eventDate, locationName, zipcode, latitude, longitude);
    res.sendStatus(200);
}

function getByKeyword(req, res){
    searchWord = req.body.keyword;
    if(!eventModels.getEventsByKeyword(searchWord)){
        res.sendStatus(400);
    }
    res.sendStatus(200);
}

// function getByLocation(req, res){

// }

module.exports = { 
    createEvent,
    getByKeyword
    //getByLocation
}