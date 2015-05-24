'use strict';

var $ = require('jquery');

var wikiColorURL = 'https://api.wikicolor.net/whocolor/index.php';

exports.get = function(callback) {
  $.ajax({
    url: wikiColorURL,
    data: {title: $('h1#firstHeading').text()},
    dataType: 'json',
    success: function(data) {callback(null, data);},
    error: function(err) {callback(err);}
  });
};
