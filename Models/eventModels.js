"use strict";
const db = require("./db");

// the users create the events
function addNewEvent(eventName, eventDate, locationName, lat, long,){
    const uuid = crypto.randomUUID();

    const sql = `INSERT INTO Events
                    (eventID, eventName, eventDate, locationName, zipcode, latitude, longitude)
                VALUES
                    (@uuid, @eventName, @eventDate, @locationName, @zip, @lat, @long)`;
    const stmt = db.prepare(sql);

    try{
        stmt.run({
            "eventID": uuid,
            "eventName": eventName,
            "eventDate": eventDate,
            "locationName": locationName,
            "zip": zip,
            "latitude": lat,
            "longitude": long,
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

module.exports = {
    addNewEvent,
    getEventsByKeyword,
    getEventsByLocation,
};