"use strict";
const eventModels = require("../Models/eventModels");
const multer = require("multer");

 const eventImages = multer({ dest: "eventImages/"});
 
async function createEvent(req, res){
    const {eventName, eventDate, locationName, zipcode, latitude, longitude} = req.body;

    if(!req.body.eventName || !req.body.eventDate || !req.body.locationName || !req.body.zipcode || !req.body.latitude || !req.body.longitude){
       return res.sendStatus(400)
    }

    await eventModels.addNewEvent(eventName, eventDate, locationName, zipcode, latitude, longitude);
    res.sendStatus(200);
}

function getSearchResultsByKeyword(req, res){
    const events = eventModels.getEventsByKeyword(req.body.keyword);

    res.render("searchResults", {events});
}


// Event Photos

//const eventUpload = multer({storage: fileStorage});

function uploadEventPics(req, res){
    eventImages.array("eventImages");
    console.log(req.files);
    console.log(req.body);
    res.sendStatus(200);
}

module.exports = { 
    createEvent,
    getSearchResultsByKeyword,
    uploadEventPics,
}