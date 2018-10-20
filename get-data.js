const request = require('request');

const DARK_SKY_API_KEY = process.env['DARK_SKY_API_KEY'];

const FLIGHT_DATA_URL = 'https://launchlibrary.net/1.4/launch/next/1';
const WEATHER_DATA_URL =
  'https://api.darksky.net/forecast/{DARK_SKY_API_KEY}/{lat},{lng},{time}';

preq({ url: FLIGHT_DATA_URL, json: true }).then(data => console.log(data));
