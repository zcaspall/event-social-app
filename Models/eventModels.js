"use strict";
const db = require("./db");
const crypto = require ("crypto");

// the users create the events
function addNewEvent(hostId, eventName, eventDate, locationName, lat, long, eventDescription, imageId, imagePath){
    const uuid = crypto.randomUUID();
    const eventSql = `INSERT INTO Events
                    (eventId, hostId, eventName, eventDate, locationName, latitude, longitude, eventDescription)
                VALUES
                    (@eventId, @hostId, @eventName, @eventDate, @locationName, @latitude, @longitude, @eventDescription)`;
    const eventStmt = db.prepare(eventSql);

    const imageSql = `INSERT INTO EventImages
                    (parentEventId, imageId, imagePath)
                VALUES
                    (@eventId, @imageId, @imagePath)`;

    const imageStmt = db.prepare(imageSql);

    try{
        eventStmt.run({
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

    try {
        imageStmt.run({
            "eventId": uuid,
            "imageId": imageId,
            "imagePath": imagePath,
        });
    } catch(err) {
        console.log(err);
    }
};

function getAllEvents() {
    const sql = `SELECT * FROM Events JOIN EventImages ON eventId=parentEventId`;

    const stmt = db.prepare(sql);

    return stmt.all();
}

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
    const sql = `SELECT * FROM Events JOIN EventImages ON eventId=parentEventId WHERE hostId=@hostId`;

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

function getEventById(eventId) {
    const sql = `SELECT * FROM Events JOIN EventImages ON eventId=parentEventId WHERE eventId=@eventId`;

    const stmt = db.prepare(sql);

    return stmt.get({eventId});
};

function joinEvent(userID, eventID){
    const sql = `INSERT INTO UsersGoingTo
                 (userID, eventID)         
                 VALUES
                 (@userID, @eventID)`;
    const stmt = db.prepare(sql);

    stmt.run({"userId": userID,
              "eventId": eventID});
}

module.exports = {
    addNewEvent,
    getAllEvents,
    getEventsByHost,
    getEventsAttendedByUser,
    getEventById,
    joinEvent,
};