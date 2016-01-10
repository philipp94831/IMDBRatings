var jsdom = require("jsdom");
var request = require('request');

module.exports.getAndParse = function(url, callback, error) {
  request(url, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      jsdom.env(
        body,
        ["http://code.jquery.com/jquery.js"],
        callback
      );
    } else {
      error();
    }
  })
}