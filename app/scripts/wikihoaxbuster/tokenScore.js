'use strict';

var _ = require('lodash');

function getRevisionAgeScore(token, infos, revisions) {

  var age = revisions.indexOf(token.revid);

  if (age === 0)
    return 0;
  if (age < 5)
    return 0.3;
  if (age < 15)
    return 0.7;
  return 1;
}

var dataNow = new Date();
function monthOld(d1) {
    var months;
    d1 = new Date(d1);
    months = (dataNow.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += dataNow.getMonth();
    return months <= 0 ? 0 : months;
}

function authorScore(token, infos) {
  var author = infos.authors[token.authorid];

  if (!author)
    return 0;

  return 0.2 + _.min([1, author.editCount / 10000]) * 0.6 + _.min([1, monthOld(author.registration) / 24]) * 0.2;
}

exports.compute = function(tokens, infos) {
  var revisions = _.keys(infos.revisions).sort(function(a, b) {
    return a < b;
  });
  for (var i = 0; i < tokens.length; i++) {
    tokens[i].ageScore = getRevisionAgeScore(tokens[i], infos, revisions);
    tokens[i].authorScore = authorScore(tokens[i], infos);
    tokens[i].score = _.min([1, _.max([tokens[i].ageScore, tokens[i].authorScore])]);
  }
  return tokens;
};
