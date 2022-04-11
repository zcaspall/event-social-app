"use strict";
const argon2 = require("argon2");
const crypto = require ("crypto");
const db = require("./db");


async function createUser(userName, userPassword, userEmail, userPhone){
    const uuid = crypto.randomUUID();
    const hash = await argon2.hash(userPassword);

    const sql = `
        INSERT INTO users
            (userID, userName, userPasswordHash, userEmail, userPhone)
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
        "userName": userName.toLowerCase()
    });
}

module.exports = {
    createUser,
    getUserByUsername,
    deleteUserByUsername
}
