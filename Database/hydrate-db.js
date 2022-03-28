"use strict";

require('dotenv').config()
const fs = require("fs");
const db = require("../Models/db");

function hydrateDB () {
    const {count} = db.prepare('SELECT count(*) as count FROM Events').get();
    
}