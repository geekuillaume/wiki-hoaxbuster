'use strict';

var Spinner = require('./spinner');

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
  chrome.tabs.insertCSS({
    file: 'styles/wikihoaxbuster.css'
  });
});

var setSpinner = function setSpinner(request, sender, sendResponse) {
  if(request.spinner && !this.spinners[sender.tab.id]) {
    this.spinners[sender.tab.id] = new Spinner(sender.tab.id);
    this.spinners[sender.tab.id].start();
  }
  else if(!request.spinners && this.spinners[sender.tab.id]) {
    this.spinners[sender.tab.id].stop();
    delete this.spinners[sender.tab.id];
  }
  sendResponse();
}.bind({spinners: []});

chrome.runtime.onMessage.addListener(function messageHandler(request, sender, sendResponse) {
  var handlers = {
    'wikihoaxbuster::setSpinner': setSpinner,
  };
  if(request.type && handlers[request.type]) {
    // return to chrome while explicitly casting to boolean
    return !!handlers[request.type](request, sender, sendResponse);
  }
  return false;
});
