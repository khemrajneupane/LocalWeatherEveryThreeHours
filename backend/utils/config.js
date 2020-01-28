require("dotenv").config();

let PORT = process.env.PORT;
let APPID = process.env.APPID;
let MAP_ENDPOINT = process.env.MONGODB_URI;
let TARGET_CITY = process.env.TARGET_CITY;

module.exports = {
  MAP_ENDPOINT,
  PORT,
  APPID,
  TARGET_CITY
};
