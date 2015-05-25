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
    if(token.score < 0.5) {
      $('.author-tokenid-' + token.index).css('background-color', 'rgba(255, 255, 0, ' + ((0.5 - token.score) * 2) + ')');
    }
  });

  var timeouts = {};
  var added = {};
  $('.author-token').mouseenter(function(e) {
    var tokenClass = _.find(e.target.classList, _.ary(_.partialRight(_.startsWith, 'author-tokenid'), 1));
    if (!tokenClass) {
      return;
    }
    var tokenId = tokenClass.split('-')[2];
    var el = $(this);
    var token = results.tokens[tokenId];
    timeouts[tokenId] = setTimeout(function() {
      if (added[tokenId]) {
        return;
      }
      added[tokenId] = true;
      el.tooltipster({
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
        onlyOne: true,
        // autoClose: false
      });
      el.tooltipster('show');
    }, 200);
  });

  $('.author-token').mouseleave(function(e) {
    var tokenClass = _.find(e.target.classList, _.ary(_.partialRight(_.startsWith, 'author-tokenid'), 1));
    if (!tokenClass) {
      return;
    }
    var tokenId = tokenClass.split('-')[2];
    if (timeouts[tokenId]) {
      clearTimeout(timeouts[tokenId]);
    }
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
  chrome.runtime.sendMessage({
    type: 'wikihoaxbuster::getCache',
    title: name
  }, function(rawData) {
    var data;
    try {
      data = JSON.parse(rawData);
    } catch (e) {
      data = {};
    }
    if(data && data.ttl > +new Date()) {
      return applyHtml(data.results, data.authors);
    }
    else {
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

          chrome.runtime.sendMessage({
            type: 'wikihoaxbuster::setCache',
            title: name,
            content: JSON.stringify({
              results: results,
              authors: authors,
              ttl: Date.now() + 1000 * 60 * 60 * 24
            })
          });
          applyHtml(results, authors);
        });
      });
    }
  }
);
}

hoaxBuster();
