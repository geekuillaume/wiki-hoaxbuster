'use strict';

var $ = require('wlt-zepto');

var wikiColorURL = 'https://api.wikicolor.net/whocolor/index.php';

function getWhocolorInfo(callback) {
  $.ajax({
    url: wikiColorURL,
    data: {title: $("h1#firstHeading").text()},
    dataType: 'json',
    success: function(data) {callback(null, data);},
    error: function(err) {callback(err);}
  });
}

console.log('coucou');

getWhocolorInfo(function(err, data) {
  if (err) {
    return console.error('There is an error:', err);
  }
  console.log('Got:', data);
});
