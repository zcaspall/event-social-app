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
            "userName": userName,
            "userPasswordHash": hash,
            "userEmail": userEmail,
            "userPhone": userPhone,
        });
    }
    catch(err){
        console.error(err);
    }
};

module.exports.createUser = createUser;