"use strict";
const db = require("./db");
const crypto = require ("crypto");

// the users create the events
function addNewEvent(hostId, eventName, eventDate, locationName, lat, long, eventDescription){
    // console.log(hostId);
    // console.log(eventName);
    // console.log(eventDate);
    // console.log(locationName);
    // console.log(lat);
    // console.log(long);
    // console.log(eventDescription);
    const uuid = crypto.randomUUID();
    const sql = `INSERT INTO Events
                    (eventId, hostId, eventName, eventDate, locationName, latitude, longitude, eventDescription)
                VALUES
                    (@eventId, @hostId, @eventName, @eventDate, @locationName, @latitude, @longitude, @eventDescription)`;
    const stmt = db.prepare(sql);

    try{
        stmt.run({
            "eventId": uuid,
            "hostId": hostId,
            "eventName": eventName,
            "eventDate": eventDate,
            "locationName": locationName,
            "latitude": lat,
            "longitude": long,
            "eventDescription": eventDescription,
        });
    }
    catch(err){
        console.log(err);
    }
};

function getEventsByKeyword(keyword) {
    // Searches for event that contains keyword
    const sql = `
        SELECT * FROM Events
        WHERE eventName LIKE '%' + @keyword '%'
    `;
    
    const stmt = db.prepare(sql);

    const events = stmt.all({keyword});
    // will return events or undefined if none found
    return events;
};

function getEventsByLocation(coordinates, radius, inMiles=true) {
    // Finds events within a radius of the provided location
    // this uses the lat and lng coordinates and the spherical law of cosines
    // to calculate the coordinates within the given radius formula found here http://www.movable-type.co.uk/scripts/latlong.html
    const sql = `
        SELECT * FROM Events
        WHERE (
            acos(sin(latitude * 0.0175) * sin(@givenLatitude * 0.0175)
                + cos(latitude * 0.0175) * cos(@givenLatitude * 0.0175)
                * cos((@givenLongitude * 0.0175) - (longitude * 0.0175))
            ) * @unitCoefficient <= @radius
        )
    `;

    // Converts to km if user doesn't want miles
    const unitCoefficient = (inMiles ? 3959 : 6371);
    
    const stmt = db.prepare(sql);

    return stmt.all({
        "givenLatitude": coordinates[0],
        "givenLongitude": coordinates[1],
        unitCoefficient,
        radius,
    });
};

function getEventsByHost(hostId) {
    const sql = `SELECT * FROM Events WHERE hostId = @hostId`;

    const stmt = db.prepare(sql);

    return stmt.all({hostId});
};

function getEventsAttendedByUser(userId) {
    const sql = `SELECT * FROM Events 
                WHERE eventId IN (
                    SELECT eventId FROM UsersGoingTo 
                    WHERE userId = @userId
                )`;
    
    const stmt = db.prepare(sql);

    return stmt.all({userId});
};

module.exports = {
    addNewEvent,
    getEventsByKeyword,
    getEventsByLocation,
    getEventsByHost,
    getEventsAttendedByUser,
};