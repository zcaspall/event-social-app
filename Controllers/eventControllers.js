"use strict";
const eventModels = require("../Models/eventModels");

async function createEvent(req, res){
    const {name, date, localName, zip, lat, long} = req.body;
    await eventModels.addNewEvent(name, date, localName, zip, lat, long);


}

function getSearchResultsByKeyword(req, res){
    const events = eventModels.getEventsByKeyword(req.body.keyword);

    res.render("searchResults", {events});
}

module.exports = {
    createEvent,
    getSearchResultsByKeyword,
}