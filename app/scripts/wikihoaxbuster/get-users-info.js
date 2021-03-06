'use strict';

var $ = require('jquery');
var _ = require('lodash');
var async = require('async');

module.exports = function getUsersInfo(usernames, cb) {
  var users = {};

  async.eachLimit(_.chunk(usernames, 50), 5, function(usernames, cb) {
    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php',
      data: {
        action: 'query',
        list: 'users',
        format: 'json',
        usprop: 'editcount|registration',
        ususers: usernames.join('|')
      },
      cache: true,
      dataType: 'json',
      success: function(data) {
        data.query.users.forEach(function(user) {
          if(user.userid) {
            users[user.userid] = user;
          }
        });

        return cb(null);
      },
      error: function(err) {
        return cb(err);
      }
    });
  }, function(err) {
    if(err) {
      return cb(err);
    }

    return cb(null, users);
  });
};
