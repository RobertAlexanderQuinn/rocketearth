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
console.log('');
console.log('============================================================');
console.log(new Date().toISOString() + ' - Starting');

const compression = require('compression');
const express = require('express');
const request = require('request');
const url = require('url');
const util = require('util');
const NodeCache = require('node-cache');

// One hour TTL
const pcache = new PromiseCache({ ttl: 60 * 60 });
const app = express();

const PORT = process.argv[2] || 8080;
const DARK_SKY_API_KEY = process.env['DARK_SKY_API_KEY'];

const FLIGHT_DATA_URL = 'https://launchlibrary.net/1.4/';
const DARK_SKY_URL = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/{lat},{lng},{time}`;

// Wrapper for get and set with promises.
function PromiseCache(opts) {
  this.cache = new NodeCache(opts);

  this.get = function(key) {
    return new Promise((resolve, reject) => {
      this.cache.get(key, (err, data) => {
        return err ? reject(err) : resolve(data);
      });
    });
  };

  this.set = function(key, value) {
    return new Promise((resolve, reject) => {
      this.cache.set(key, value, (err, success) => {
        return err ? reject(err) : resolve(success);
      });
    });
  };
}

/**
 * Adds headers to a response to enable caching and returns cached value
 * if it has been set (manually, that is).
 */
function cacheControl() {
  return function(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=300');

    let key = req.originalUrl || req.url;
    return pcache
      .get(key)
      .then(cached => (cached ? res.json(cached) : next()))
      .catch(e => next());
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

class LaunchCache {
  constructor() {
    this.ncache = new NodeCache();
  }

  async getAsync(key) {
    return new Promise((resolve, reject) => {
      this.ncache.get(key, (err, value) => {
        if (!!err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  async putAsync(key, value) {
    return new Promise((resolve, reject) => {
      this.ncache.set(key, value, 3600, (err, data) => {
        if (!!err) {
          console.warn('cache fail: ' + data);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

function constructData(d) {
  const sites = d[0];

  function toMap(a, el) {
    a[el.id] = el;
    return a;
  }

  return {
    sites: d[0],
    locations: d[1].locations.reduce(toMap, {}),
    agencies: d[2].agencies.reduce(toMap, {}),
    launches: d[3].launches.reduce(toMap, {}),
    missions: d[4].missions.reduce(toMap, {})
  };
}

// helper function to ensure we can chain after failed async/await
const awaiter = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.use(cacheControl());
app.use(compression());
app.use(express.static('public'));

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

app.get('/data', (req, res) => {
  console.log('called data...');
  const nolim = '?limit=9999999';

  // Sorry launchlib!
  const sites = preq({ url: flightURL('pad', nolim), json: true });
  const locations = preq({ url: flightURL('location', nolim), json: true });
  const agencies = preq({ url: flightURL('agency', nolim), json: true });
  const launches = preq({ url: flightURL('launch', nolim), json: true });
  const missions = preq({ url: flightURL('mission', nolim), json: true });

  const getData = Promise.all([
    sites,
    locations,
    agencies,
    launches,
    missions
  ]).catch(e => console.error(e));

  getData.then(constructData).then(d => {
    pcache.set(req.originalUrl || req.url, d);
    res.json(d);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
