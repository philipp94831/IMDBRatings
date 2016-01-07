var jsdom = require("jsdom");
var baseUrl = "http://www.imdb.com/";

module.exports.get_index = function(req, res, next) {
  res.render('index', { title: 'Express' });
}

module.exports.get = function(req, res, next) {
  res.render('test', { title: 'Express', id: req.params.id });
}

module.exports.search = function(req, res, next) {
  var query = req.query.q;
  console.log("query: " + query);
  jsdom.env(
    baseUrl + "find?q=" + query,
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      var url = window.$('#main > div > div:nth-child(3) > table > tbody > tr:nth-child(1) > td.result_text > a').attr('href');
      var regex = /title\/(.+)\//
      var result = url.match(regex);
      var id = result[1];
      console.log("ID: "+  id);
      res.send(id);
    }
  );
}