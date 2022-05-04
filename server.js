"use strict";
require("dotenv").config();

const app = require("./app");

//global.projectRoot = require('path').resolve(__dirname);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});