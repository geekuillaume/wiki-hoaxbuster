'use strict';

var $ = require('wlt-zepto');
var _ = require('lodash');

var whoColor = require('./whocolor.js');
var getUsersInfos = require('./get-users-info.js');
var tokenScore = require('./tokenScore.js');

function hoaxBuster() {
  chrome.runtime.sendMessage({
    type: 'wikihoaxbuster::setSpinner',
    spinner: true
  });
  whoColor.get(function(err, results) {
    getUsersInfos(_.chain(results.authors).filter('anon', false).map('name').value(), function(err, authors) {
      console.log('got:', authors, results);

      var tokens = tokenScore.compute(results.tokens, {
        revisions: results.revisions,
        authors: authors
      });

      console.log(tokens);

      $('#mw-content-text').html(results.html);
      chrome.runtime.sendMessage({
        type: 'wikihoaxbuster::setSpinner',
        spinner: false
      });
    });
  });
}

hoaxBuster();
