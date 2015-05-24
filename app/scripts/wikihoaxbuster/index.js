'use strict';

var _ = require('lodash');
var $ = require('jquery');
window.jQuery = $;
require('tooltipster');

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

      $('#mw-content-text').html(results.html);

      _.each(tokens, function(token) {
        debugger;
        $('.author-tokenid-' + token.index).tooltipster({
          content: _.template(
            [
              '<div class="wikihoaxbuster-tooltip"><span>Score:</span> <%= token.score %></div>',
              '<div class="wikihoaxbuster-tooltip"><span>Author:</span> <%= author.name %></div>',
              '<div class="wikihoaxbuster-tooltip"><span>Comment:</span> <%= revision.comment %></div>',
              '<div class="wikihoaxbuster-tooltip"><span>Date:</span> <%= revision.timestamp %></div>',
              '<div class="wikihoaxbuster-tooltip"><a href="https://en.wikipedia.org/w/index.php?diff=<%= token.revid %>">View edit</a></div>'
            ].join('\n'))({
              token: token,
              author: authors[token.authorid] || results.authors[token.authorid] || {name: 'Unknown'},
              revision: results.revisions[token.revid]
            }),
            contentAsHTML: true,
            interactive: true,
            // autoClose: false
        });
      });

      chrome.runtime.sendMessage({
        type: 'wikihoaxbuster::setSpinner',
        spinner: false
      });
    });
  });
}

hoaxBuster();
