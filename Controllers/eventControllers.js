"use strict";
const eventModels = require("../Models/eventModels");

async function createEvent(req, res){
    const {name, date, localName, zip, lat, long} = req.body;
    await eventModels.addNewEvent(name, date, localName, zip, lat, long);


}

function getByKeyword(req, res){
    
}

function getByLocation(req, res){
    
}

module.exports = {
    createEvent,
    getByKeyword,
    getByLocation
}