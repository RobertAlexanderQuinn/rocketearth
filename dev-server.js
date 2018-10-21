/**
 * dev-server - serves static resources for developing "earth" locally
 */

'use strict';

/*
  _____            _        _   ______           _   _     
 |  __ \          | |      | | |  ____|         | | | |    
 | |__) |___   ___| | _____| |_| |__   __ _ _ __| |_| |__  
 |  _  // _ \ / __| |/ / _ \ __|  __| / _` | '__| __| '_ \ 
 | | \ \ (_) | (__|   <  __/ |_| |___| (_| | |  | |_| | | |
 |_|  \_\___/ \___|_|\_\___|\__|______\__,_|_|   \__|_| |_|
 
*/
console.log("")
console.log('============================================================');
console.log(new Date().toISOString() + ' - Starting');

const compression = require('compression');
const express = require('express');
const request = require('request');
const url = require('url');
const util = require('util');

// type
const NodeCache = require( "node-cache" );

const app = express();

const PORT = process.argv[2] || 8080;
const DARK_SKY_API_KEY = process.env['DARK_SKY_API_KEY'];

const FLIGHT_DATA_URL = 'https://launchlibrary.net/1.4/';
const DARK_SKY_URL = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/{lat},{lng},{time}`;

/**
 * Adds headers to a response to enable caching.
 */
function cacheControl() {
  return function(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=300');
    return next();
  };
}

/**
 * Simple logging. Add more and make moar better.
 */
function log() {
  return function(req, res, next) {
    console.log(req.url);
    return next();
  };
}

/**
 * Promise wrapper for requests because why not.
 */
function preq(opt) {
  return new Promise((resolve, reject) => {
    request(opt, (err, res, data) => {
      return err ? reject(err) : resolve(data);
    });
  });
}

/**
 * Constructs a URL builder for the specified base path.
 */
function urlBuilder(base) {
  return function() {
    let path = base;
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i] !== undefined) {
        path = url.resolve(path, arguments[i]) + '/';
      }
    }
    return path;
  };
}

// These are functions that construct the paths for requests.
const flightURL = urlBuilder(FLIGHT_DATA_URL);
const weatherURL = urlBuilder(DARK_SKY_URL);

/**
 * Generic error catcher.
 */
function errorCatch(err) {
  console.error(err);
}

app.use(cacheControl());
app.use(compression());
app.use(express.static('public'));


class LaunchCache {
  ncache = new NodeCache();

  constructor() {
  }

  async getAsync(key) {
    return new Promise((resolve, reject) => {
      this.ncache.get(key, (err, value) => {
        if (!!err) {
          reject(err);
        } else {
          resolve(value);
        }
      })
    });
  }

  async putAsync(key, value) {
    return new Promise((resolve, reject) => {
      this.ncache.set(key, value, 3600, (err, data) => {
        if (!!err) {
          console.warn("cache fail: " + data);
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }
}

//var cache = new NodeCache();


// helper function to ensure we can chain after failed async/await
const awaiter = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}

// app.get('/site/:siteId?', (req, res) => {
//   preq({
//     url: flightURL('pad', req.params.siteId, '?limit=999999999'),
//     json: true
//   })
//     .then(data => res.json(data))
//     .catch(errorCatch);
// });

app.get('/site/:siteId?', (req, res) => {  
  preq({
    url: flightURL('pad', req.params.siteId, '?limit=999999999'),
    json: true
  })
    .then(data => res.json(data))
    .catch(errorCatch);
});

app.get('/agency/:agencyId?', (req, res) => {
  preq({ url: flightURL('agency', req.params.agencyId), json: true })
    .then(data => res.json(data))
    .catch(errorCatch);
});

app.get('/launch/:launchId?', (req, res) => {
  preq({ url: flightURL('launch', req.params.launchId), json: true })
    .then(data => res.json(data))
    .catch(errorCatch);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});


