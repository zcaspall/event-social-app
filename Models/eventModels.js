function createLocation(name, zip, lat, long){
    const sql = `INSTERT INTO Locations
                    (locationName, zip, latitude, longitude)
                 VALUES
                    (@name, @zip, @lat, @long)`;
    
    const stmt = db.prepare(sql);

    try{
        stmt.run({
            "locationName": name,
            "zip": zip,
            "latitutde": lat,
            "longitude": long,
        });
    }
    catch(err){
        console.error(err);
    }
};

function createEvent(eventName, eventDate, eventLocation){
    
}