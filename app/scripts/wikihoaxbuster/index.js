'use strict';

var $ = require('wlt-zepto');
var _ = require('lodash');

var whoColor = require('./whocolor.js');
var getUsersInfos = require('./get-users-info.js');


function hoaxBuster() {
  chrome.runtime.sendMessage({
    type: 'wikihoaxbuster::setSpinner',
    spinner: true
  });
  whoColor.get(function(err, results) {
    $('#mw-content-text').html(results.html);
    getUsersInfos(_.chain(results.authors).filter('anon', false).map('name').value(), function(err, authors) {
      console.log('got:', authors);
    });
    chrome.runtime.sendMessage({
      type: 'wikihoaxbuster::setSpinner',
      spinner: false
    });
  });
}

hoaxBuster();
