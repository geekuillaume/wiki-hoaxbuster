'use strict';

var _ = require('lodash');
var moment = require('moment');
var $ = require('jquery');
window.jQuery = $;
require('tooltipster');

var whoColor = require('./whocolor.js');
var getUsersInfos = require('./get-users-info.js');
var tokenScore = require('./tokenScore.js');

function applyHtml(results, authors) {
  $('#mw-content-text').html(results.html);

  _.each(results.tokens, function(token) {
    $('.author-tokenid-' + token.index).tooltipster({
      content: _.template(
        [
          '<div class="wikihoaxbuster-tooltip"><span>Score:</span> ${token.score}</div>',
          '<div class="wikihoaxbuster-tooltip"><span>Author:</span> <a href="https://en.wikipedia.org/wiki/User:${author.name}">${author.name}</a></div>',
          '<% if(revision.comment) {%><div class="wikihoaxbuster-tooltip"><span>Comment:</span> ${revision.comment}</div><%}%>',
          '<div class="wikihoaxbuster-tooltip"><span>Date:</span> ${momentFromNow}</div>',
          '<div class="wikihoaxbuster-tooltip"><a href="https://en.wikipedia.org/w/index.php?diff=${token.revid}">View edit</a></div>'
        ].join('\n'))({
          token: token,
          author: authors[token.authorid] || results.authors[token.authorid] || {name: 'Unknown'},
          revision: results.revisions[token.revid],
          momentFromNow: moment(results.revisions[token.revid].timestamp).fromNow()
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
}

function hoaxBuster() {
  chrome.runtime.sendMessage({
    type: 'wikihoaxbuster::setSpinner',
    spinner: true
  });

  var name = 'wiki-hoaxbuster-' + $('h1#firstHeading').text();
  if(localStorage && localStorage.getItem) {
    var data = localStorage.getItem(name);
    if(data) {
      try {
        data = JSON.parse(data);
      }
      catch(e) {
        data = null;
        localStorage.removeItem(name);
      }

      if(data && data.ttl < +new Date()) {
        localStorage.removeItem(name);
      }
      else if(data) {
        return applyHtml(data.results, data.authors);
      }
    }
  }

  whoColor.get(function(err, results) {
    if(err) {
      chrome.runtime.sendMessage({
        type: 'wikihoaxbuster::setSpinner',
        spinner: false
      });

      return console.warn(err);
    }

    getUsersInfos(_.chain(results.authors).filter('anon', false).map('name').value(), function(err, authors) {
      if(err) {
        chrome.runtime.sendMessage({
          type: 'wikihoaxbuster::setSpinner',
          spinner: false
        });

        return console.warn(err);
      }

      tokenScore.compute(results.tokens, {
        revisions: results.revisions,
        authors: authors
      });

      if(localStorage && localStorage.setItem) {
        localStorage.setItem(name, JSON.stringify({
          results: results,
          authors: authors,
          ttl: Date.now() + 1000 * 60 * 60 * 24
        }));
      }

      applyHtml(results, authors);
    });
  });
}

hoaxBuster();
