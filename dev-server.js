/**
 * dev-server - serves static resources for developing "earth" locally
 */

'use strict';

console.log('============================================================');
console.log(new Date().toISOString() + ' - Starting');

const compression = require('compression');
const express = require('express');
const util = require('util');

const PORT = process.argv[2] || 8080;
const app = express();

/**
 * Adds headers to a response to enable caching.
 */
function cacheControl() {
  return function(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=300');
    return next();
  };
}

app.use(cacheControl());
app.use(compression());
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
