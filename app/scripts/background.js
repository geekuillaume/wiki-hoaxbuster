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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9iYWNrZ3JvdW5kL2luZGV4LmpzIiwiYXBwL3NjcmlwdHMvYmFja2dyb3VuZC9zcGlubmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBTcGlubmVyID0gcmVxdWlyZSgnLi9zcGlubmVyJyk7XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChkZXRhaWxzKSB7XG4gIGNvbnNvbGUubG9nKCdwcmV2aW91c1ZlcnNpb24nLCBkZXRhaWxzLnByZXZpb3VzVmVyc2lvbik7XG59KTtcblxuY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLnJlbW92ZVJ1bGVzKHVuZGVmaW5lZCwgZnVuY3Rpb24oKSB7XG4gIGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQub25QYWdlQ2hhbmdlZC5hZGRSdWxlcyhbe1xuICAgIGNvbmRpdGlvbnM6IFtcbiAgICAgIG5ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlBhZ2VTdGF0ZU1hdGNoZXIoe1xuICAgICAgICBwYWdlVXJsOiB7IGhvc3RFcXVhbHM6ICdlbi53aWtpcGVkaWEub3JnJyB9LFxuICAgICAgfSlcbiAgICBdLFxuICAgIGFjdGlvbnM6IFsgbmV3IGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQuU2hvd1BhZ2VBY3Rpb24oKSBdXG4gIH1dKTtcbn0pO1xuXG5jaHJvbWUucGFnZUFjdGlvbi5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24oKXtcbiAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdCh7XG4gICAgZmlsZTogJ3NjcmlwdHMvcGFnZXNjcmlwdC5qcydcbiAgfSk7XG4gIGNocm9tZS50YWJzLmluc2VydENTUyh7XG4gICAgZmlsZTogJ3N0eWxlcy93aWtpaG9heGJ1c3Rlci5jc3MnXG4gIH0pO1xufSk7XG5cbnZhciBzZXRTcGlubmVyID0gZnVuY3Rpb24gc2V0U3Bpbm5lcihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICBpZihyZXF1ZXN0LnNwaW5uZXIgJiYgIXRoaXMuc3Bpbm5lcnNbc2VuZGVyLnRhYi5pZF0pIHtcbiAgICB0aGlzLnNwaW5uZXJzW3NlbmRlci50YWIuaWRdID0gbmV3IFNwaW5uZXIoc2VuZGVyLnRhYi5pZCk7XG4gICAgdGhpcy5zcGlubmVyc1tzZW5kZXIudGFiLmlkXS5zdGFydCgpO1xuICB9XG4gIGVsc2UgaWYoIXJlcXVlc3Quc3Bpbm5lcnMgJiYgdGhpcy5zcGlubmVyc1tzZW5kZXIudGFiLmlkXSkge1xuICAgIHRoaXMuc3Bpbm5lcnNbc2VuZGVyLnRhYi5pZF0uc3RvcCgpO1xuICAgIGRlbGV0ZSB0aGlzLnNwaW5uZXJzW3NlbmRlci50YWIuaWRdO1xuICB9XG4gIHNlbmRSZXNwb25zZSgpO1xufS5iaW5kKHtzcGlubmVyczogW119KTtcblxudmFyIHNldENhY2hlID0gZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgdmFyIGRhdGEgPSB7fTtcbiAgZGF0YVtyZXF1ZXN0LnRpdGxlXSA9IHJlcXVlc3QuY29udGVudDtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGRhdGEsIGZ1bmN0aW9uKCkge1xuICB9KTtcbn07XG5cbnZhciBnZXRDYWNoZSA9IGZ1bmN0aW9uKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChyZXF1ZXN0LnRpdGxlLCBmdW5jdGlvbihjb250ZW50KSB7XG4gICAgc2VuZFJlc3BvbnNlKGNvbnRlbnRbcmVxdWVzdC50aXRsZV0pO1xuICB9KTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiBtZXNzYWdlSGFuZGxlcihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICB2YXIgaGFuZGxlcnMgPSB7XG4gICAgJ3dpa2lob2F4YnVzdGVyOjpzZXRTcGlubmVyJzogc2V0U3Bpbm5lcixcbiAgICAnd2lraWhvYXhidXN0ZXI6OnNldENhY2hlJzogc2V0Q2FjaGUsXG4gICAgJ3dpa2lob2F4YnVzdGVyOjpnZXRDYWNoZSc6IGdldENhY2hlXG4gIH07XG4gIGlmKHJlcXVlc3QudHlwZSAmJiBoYW5kbGVyc1tyZXF1ZXN0LnR5cGVdKSB7XG4gICAgLy8gcmV0dXJuIHRvIGNocm9tZSB3aGlsZSBleHBsaWNpdGx5IGNhc3RpbmcgdG8gYm9vbGVhblxuICAgIHJldHVybiAhIWhhbmRsZXJzW3JlcXVlc3QudHlwZV0ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU3Bpbm5lciA9IGZ1bmN0aW9uIFNwaW5uZXIodGFiSWQpIHtcbiAgdGhpcy50YWJJZCA9IHRhYklkO1xuICB0aGlzLmludGVydmFsID0gbnVsbDtcbn07XG5cblNwaW5uZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gc3RhcnQoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYoc2VsZi5pbnRlcnZhbCkge1xuICAgIGNsZWFySW50ZXJ2YWwoc2VsZi5pbnRlcnZhbCk7XG4gIH1cblxuICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gIHZhciBsaW5lcyA9IDgwO1xuICB2YXIgY1cgPSAxOTtcbiAgdmFyIGNIID0gMTk7XG4gIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgaW1nLnNyYyA9ICdpbWFnZXMvaWNvbi0xOS5wbmcnO1xuXG4gIHZhciBkcmF3U3Bpbm5lciA9IGZ1bmN0aW9uIGRyYXdTcGlubmVyKCkge1xuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHZhciByb3RhdGlvbiA9IHBhcnNlSW50KCgobmV3IERhdGUoKSAtIGRhdGUpIC8gMTgwMCkgKiBsaW5lcykgLyBsaW5lcztcbiAgICBjb250ZXh0LnNhdmUoKTtcbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjVywgY0gpO1xuICAgIGNvbnRleHQudHJhbnNsYXRlKGNXIC8gMiwgY0ggLyAyKTtcbiAgICBjb250ZXh0LnJvdGF0ZShNYXRoLlBJICogMiAqIHJvdGF0aW9uKTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBsaW5lczsgaSsrKSB7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5yb3RhdGUoTWF0aC5QSSAqIDIgLyBsaW5lcyk7XG4gICAgICBjb250ZXh0Lm1vdmVUbyhjVyAvIDYsIDApO1xuICAgICAgY29udGV4dC5saW5lVG8oY1cgLyAyLCAwKTtcbiAgICAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSgxNTAsIDE1MCwgMTUwLCAnICsgaSAvIGxpbmVzICsgJyknO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG4gICAgY29udGV4dC5yZXN0b3JlKCk7XG4gICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCAxOSwgMTkpO1xuICAgIHJldHVybiBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCAxOSwgMTkpO1xuICB9O1xuXG4gIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmludGVydmFsID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgY2hyb21lLnBhZ2VBY3Rpb24uc2V0SWNvbih7aW1hZ2VEYXRhOiBkcmF3U3Bpbm5lcigpLCB0YWJJZDogc2VsZi50YWJJZH0pO1xuICAgIH0sIDEwMDAgLyAyMCk7XG4gIH07XG59O1xuXG5TcGlubmVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZih0aGlzLmludGVydmFsKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgfVxuICBjaHJvbWUucGFnZUFjdGlvbi5zZXRJY29uKHtwYXRoOiAnaW1hZ2VzL2ljb24tMTkucG5nJywgdGFiSWQ6IHNlbGYudGFiSWR9KTtcbiAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwaW5uZXI7XG4iXX0=
