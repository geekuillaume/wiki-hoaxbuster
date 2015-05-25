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

var setCache = function(request, sender, sendResponse) {
  var data = {};
  data[request.title] = request.content;
  chrome.storage.local.set(data, function() {
  });
};

var getCache = function(request, sender, sendResponse) {
  chrome.storage.local.get(request.title, function(content) {
    sendResponse(content[request.title]);
  });
  return true;
}

chrome.runtime.onMessage.addListener(function messageHandler(request, sender, sendResponse) {
  var handlers = {
    'wikihoaxbuster::setSpinner': setSpinner,
    'wikihoaxbuster::setCache': setCache,
    'wikihoaxbuster::getCache': getCache
  };
  if(request.type && handlers[request.type]) {
    // return to chrome while explicitly casting to boolean
    return !!handlers[request.type](request, sender, sendResponse);
  }
  return false;
});
