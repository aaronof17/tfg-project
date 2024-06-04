const fetch = require('cross-fetch');
if (typeof global.fetch === 'undefined') {
  global.fetch = fetch;
}