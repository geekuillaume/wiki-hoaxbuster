(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./spinner":2}],2:[function(require,module,exports){
'use strict';

var Spinner = function Spinner(tabId) {
  this.tabId = tabId;
  this.interval = null;
};

Spinner.prototype.start = function start() {
  var self = this;
  if(self.interval) {
    clearInterval(self.interval);
  }

  var date = new Date();
  var lines = 80;
  var cW = 19;
  var cH = 19;
  var img = new Image();
  img.src = 'images/icon-19.png';

  var drawSpinner = function drawSpinner() {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var rotation = parseInt(((new Date() - date) / 1800) * lines) / lines;
    context.save();
    context.clearRect(0, 0, cW, cH);
    context.translate(cW / 2, cH / 2);
    context.rotate(Math.PI * 2 * rotation);
    for (var i = 1; i <= lines; i++) {
      context.beginPath();
      context.rotate(Math.PI * 2 / lines);
      context.moveTo(cW / 6, 0);
      context.lineTo(cW / 2, 0);
      context.lineWidth = 1;
      context.strokeStyle = 'rgba(150, 150, 150, ' + i / lines + ')';
      context.stroke();
    }
    context.restore();
    context.drawImage(img, 0, 0, 19, 19);
    return context.getImageData(0, 0, 19, 19);
  };

  img.onload = function() {
    self.interval = window.setInterval(function() {
      chrome.pageAction.setIcon({imageData: drawSpinner(), tabId: self.tabId});
    }, 1000 / 20);
  };
};

Spinner.prototype.stop = function stop() {
  var self = this;
  if(this.interval) {
    clearInterval(this.interval);
  }
  chrome.pageAction.setIcon({path: 'images/icon-19.png', tabId: self.tabId});
  this.interval = null;
};

module.exports = Spinner;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9iYWNrZ3JvdW5kL2luZGV4LmpzIiwiYXBwL3NjcmlwdHMvYmFja2dyb3VuZC9zcGlubmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU3Bpbm5lciA9IHJlcXVpcmUoJy4vc3Bpbm5lcicpO1xuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoZGV0YWlscykge1xuICBjb25zb2xlLmxvZygncHJldmlvdXNWZXJzaW9uJywgZGV0YWlscy5wcmV2aW91c1ZlcnNpb24pO1xufSk7XG5cbmNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQub25QYWdlQ2hhbmdlZC5yZW1vdmVSdWxlcyh1bmRlZmluZWQsIGZ1bmN0aW9uKCkge1xuICBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50Lm9uUGFnZUNoYW5nZWQuYWRkUnVsZXMoW3tcbiAgICBjb25kaXRpb25zOiBbXG4gICAgICBuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5QYWdlU3RhdGVNYXRjaGVyKHtcbiAgICAgICAgcGFnZVVybDogeyBob3N0RXF1YWxzOiAnZW4ud2lraXBlZGlhLm9yZycgfSxcbiAgICAgIH0pXG4gICAgXSxcbiAgICBhY3Rpb25zOiBbIG5ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlNob3dQYWdlQWN0aW9uKCkgXVxuICB9XSk7XG59KTtcblxuY2hyb21lLnBhZ2VBY3Rpb24ub25DbGlja2VkLmFkZExpc3RlbmVyKGZ1bmN0aW9uKCl7XG4gIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQoe1xuICAgIGZpbGU6ICdzY3JpcHRzL3BhZ2VzY3JpcHQuanMnXG4gIH0pO1xuICBjaHJvbWUudGFicy5pbnNlcnRDU1Moe1xuICAgIGZpbGU6ICdzdHlsZXMvd2lraWhvYXhidXN0ZXIuY3NzJ1xuICB9KTtcbn0pO1xuXG52YXIgc2V0U3Bpbm5lciA9IGZ1bmN0aW9uIHNldFNwaW5uZXIocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgaWYocmVxdWVzdC5zcGlubmVyICYmICF0aGlzLnNwaW5uZXJzW3NlbmRlci50YWIuaWRdKSB7XG4gICAgdGhpcy5zcGlubmVyc1tzZW5kZXIudGFiLmlkXSA9IG5ldyBTcGlubmVyKHNlbmRlci50YWIuaWQpO1xuICAgIHRoaXMuc3Bpbm5lcnNbc2VuZGVyLnRhYi5pZF0uc3RhcnQoKTtcbiAgfVxuICBlbHNlIGlmKCFyZXF1ZXN0LnNwaW5uZXJzICYmIHRoaXMuc3Bpbm5lcnNbc2VuZGVyLnRhYi5pZF0pIHtcbiAgICB0aGlzLnNwaW5uZXJzW3NlbmRlci50YWIuaWRdLnN0b3AoKTtcbiAgICBkZWxldGUgdGhpcy5zcGlubmVyc1tzZW5kZXIudGFiLmlkXTtcbiAgfVxuICBzZW5kUmVzcG9uc2UoKTtcbn0uYmluZCh7c3Bpbm5lcnM6IFtdfSk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiBtZXNzYWdlSGFuZGxlcihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICB2YXIgaGFuZGxlcnMgPSB7XG4gICAgJ3dpa2lob2F4YnVzdGVyOjpzZXRTcGlubmVyJzogc2V0U3Bpbm5lcixcbiAgfTtcbiAgaWYocmVxdWVzdC50eXBlICYmIGhhbmRsZXJzW3JlcXVlc3QudHlwZV0pIHtcbiAgICAvLyByZXR1cm4gdG8gY2hyb21lIHdoaWxlIGV4cGxpY2l0bHkgY2FzdGluZyB0byBib29sZWFuXG4gICAgcmV0dXJuICEhaGFuZGxlcnNbcmVxdWVzdC50eXBlXShyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTcGlubmVyID0gZnVuY3Rpb24gU3Bpbm5lcih0YWJJZCkge1xuICB0aGlzLnRhYklkID0gdGFiSWQ7XG4gIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xufTtcblxuU3Bpbm5lci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiBzdGFydCgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZihzZWxmLmludGVydmFsKSB7XG4gICAgY2xlYXJJbnRlcnZhbChzZWxmLmludGVydmFsKTtcbiAgfVxuXG4gIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgdmFyIGxpbmVzID0gODA7XG4gIHZhciBjVyA9IDE5O1xuICB2YXIgY0ggPSAxOTtcbiAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICBpbWcuc3JjID0gJ2ltYWdlcy9pY29uLTE5LnBuZyc7XG5cbiAgdmFyIGRyYXdTcGlubmVyID0gZnVuY3Rpb24gZHJhd1NwaW5uZXIoKSB7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdmFyIHJvdGF0aW9uID0gcGFyc2VJbnQoKChuZXcgRGF0ZSgpIC0gZGF0ZSkgLyAxODAwKSAqIGxpbmVzKSAvIGxpbmVzO1xuICAgIGNvbnRleHQuc2F2ZSgpO1xuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNXLCBjSCk7XG4gICAgY29udGV4dC50cmFuc2xhdGUoY1cgLyAyLCBjSCAvIDIpO1xuICAgIGNvbnRleHQucm90YXRlKE1hdGguUEkgKiAyICogcm90YXRpb24pO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGxpbmVzOyBpKyspIHtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0LnJvdGF0ZShNYXRoLlBJICogMiAvIGxpbmVzKTtcbiAgICAgIGNvbnRleHQubW92ZVRvKGNXIC8gNiwgMCk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhjVyAvIDIsIDApO1xuICAgICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE1MCwgMTUwLCAxNTAsICcgKyBpIC8gbGluZXMgKyAnKSc7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgICBjb250ZXh0LmRyYXdJbWFnZShpbWcsIDAsIDAsIDE5LCAxOSk7XG4gICAgcmV0dXJuIGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIDE5LCAxOSk7XG4gIH07XG5cbiAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICBjaHJvbWUucGFnZUFjdGlvbi5zZXRJY29uKHtpbWFnZURhdGE6IGRyYXdTcGlubmVyKCksIHRhYklkOiBzZWxmLnRhYklkfSk7XG4gICAgfSwgMTAwMCAvIDIwKTtcbiAgfTtcbn07XG5cblNwaW5uZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiBzdG9wKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICB9XG4gIGNocm9tZS5wYWdlQWN0aW9uLnNldEljb24oe3BhdGg6ICdpbWFnZXMvaWNvbi0xOS5wbmcnLCB0YWJJZDogc2VsZi50YWJJZH0pO1xuICB0aGlzLmludGVydmFsID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3Bpbm5lcjtcbiJdfQ==
