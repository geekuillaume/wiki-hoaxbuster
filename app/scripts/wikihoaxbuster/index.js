'use strict';

var _ = require('lodash');

var whoColor = require('./whocolor.js');
var getUsersInfos = require('./get-users-info.js');


function hoaxBuster() {
  whoColor.get(function(err, results) {
    getUsersInfos(_.chain(results.authors).filter('anon', false).map('name').value(), function(err, authors) {
      console.log('got:', authors);
    });
  });
}

hoaxBuster();
