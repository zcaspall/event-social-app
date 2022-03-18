"use strict";
const db = require("./db");
const crypto = require("crypto");
const argon2 = require("argon2");

async function createUser(userName, userPassword, userEmail, userPhone){
    const uuid = crypto.randomUUID();
    const hash = await argon2.hash(userPassword);

    const sql = `
        INSERT INTO users
            (userId, userName, userPasswordHash, userEmail, userPhone)
        VALUES
            (@userID, @userName, @userPasswordHash, @userEmail, @userPhone)
    `;

    const stmt = db.prepare(sql);

    try{
        stmt.run({
            "userID": uuid,
            "userName": userName.toLowerCase(),
            "userPasswordHash": hash,
            "userEmail": userEmail.toLowerCase(),
            "userPhone": userPhone,
        });
    }
    catch(err){
        console.error(err);
    }
};

function getUserByUsername (userName) {
    const sql = `SELECT * FROM Users WHERE userName = @userName`;

    const stmt = db.prepare(sql);
    const record = stmt.get({
        "userName": userName.toLowerCase()
    });

    return record;
}

function deleteUserByUsername (userName) {
    const sql = `DELETE FROM Users WHERE userName = @userName`;

    const stmt = db.prepare(sql);
    stmt.run({
        "userName": userName
    });
}

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

module.exports.createUser = createUser;
module.exports.getUserByUsername = getUserByUsername;
module.exports.deleteUserByUsername = deleteUserByUsername;
module.exports.createLocation = createLocation;
