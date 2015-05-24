'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'en.wikipedia.org' },
      })
    ],
    actions: [ new chrome.declarativeContent.ShowPageAction() ]
  }]);
});

console.log('hello');

chrome.pageAction.onClicked.addListener(function(){
  chrome.tabs.executeScript({
    file: 'scripts/pagescript.js'
  });
});
