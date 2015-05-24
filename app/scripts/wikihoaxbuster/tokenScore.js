'use strict';

var _ = require('lodash');

function getRevisionAgeScore(token, infos) {

  var age = _.keys(infos.revisions).sort(function(a, b) {
    return a < b;
  }).indexOf(token.revid);

  if (age === 0)
    return 0;
  if (age < 5)
    return 0.3;
  if (age < 15)
    return 0.7;
  return 1;
}

function monthOld(d1) {
    var months;
    var d2 = new Date();
    d1 = new Date(d1);
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

function authorScore(token, infos) {
  var author = infos.authors[token.authorid];

  if (!author)
    return 0;

  return 0.2 + _.min([0.4, author.editCount / 10000]) + _.min([0.4, monthOld(author.registration) / 24]);
}

exports.compute = function(tokens, infos) {
  return _.each(tokens, function(token) {
    token.ageScore = getRevisionAgeScore(token, infos);
    token.authorScore = authorScore(token, infos);
    token.score = (token.ageScore + token.authorScore) / 2;
  });
};
