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
    context.drawImage(img, 0, 0, 19, 19);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9iYWNrZ3JvdW5kL2luZGV4LmpzIiwiYXBwL3NjcmlwdHMvYmFja2dyb3VuZC9zcGlubmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNwaW5uZXIgPSByZXF1aXJlKCcuL3NwaW5uZXInKTtcblxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgY29uc29sZS5sb2coJ3ByZXZpb3VzVmVyc2lvbicsIGRldGFpbHMucHJldmlvdXNWZXJzaW9uKTtcbn0pO1xuXG5jaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50Lm9uUGFnZUNoYW5nZWQucmVtb3ZlUnVsZXModW5kZWZpbmVkLCBmdW5jdGlvbigpIHtcbiAgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLmFkZFJ1bGVzKFt7XG4gICAgY29uZGl0aW9uczogW1xuICAgICAgbmV3IGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQuUGFnZVN0YXRlTWF0Y2hlcih7XG4gICAgICAgIHBhZ2VVcmw6IHsgaG9zdEVxdWFsczogJ2VuLndpa2lwZWRpYS5vcmcnIH0sXG4gICAgICB9KVxuICAgIF0sXG4gICAgYWN0aW9uczogWyBuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5TaG93UGFnZUFjdGlvbigpIF1cbiAgfV0pO1xufSk7XG5cbmNvbnNvbGUubG9nKCdoZWxsbycpO1xuXG5jaHJvbWUucGFnZUFjdGlvbi5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24oKXtcbiAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdCh7XG4gICAgZmlsZTogJ3NjcmlwdHMvcGFnZXNjcmlwdC5qcydcbiAgfSk7XG4gIGNocm9tZS50YWJzLmluc2VydENTUyh7XG4gICAgZmlsZTogJ3N0eWxlcy93aWtpaG9heGJ1c3Rlci5jc3MnXG4gIH0pO1xufSk7XG5cbnZhciBzZXRTcGlubmVyID0gZnVuY3Rpb24gc2V0U3Bpbm5lcihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICBpZihyZXF1ZXN0LnNwaW5uZXIgJiYgIXRoaXMuc3Bpbm5lcnNbc2VuZGVyLnRhYi5pZF0pIHtcbiAgICB0aGlzLnNwaW5uZXJzW3NlbmRlci50YWIuaWRdID0gbmV3IFNwaW5uZXIoc2VuZGVyLnRhYi5pZCk7XG4gICAgdGhpcy5zcGlubmVyc1tzZW5kZXIudGFiLmlkXS5zdGFydCgpO1xuICB9XG4gIGVsc2UgaWYoIXJlcXVlc3Quc3Bpbm5lcnMgJiYgdGhpcy5zcGlubmVyc1tzZW5kZXIudGFiLmlkXSkge1xuICAgIHRoaXMuc3Bpbm5lcnNbc2VuZGVyLnRhYi5pZF0uc3RvcCgpO1xuICAgIGRlbGV0ZSB0aGlzLnNwaW5uZXJzW3NlbmRlci50YWIuaWRdO1xuICB9XG4gIHNlbmRSZXNwb25zZSgpO1xufS5iaW5kKHtzcGlubmVyczogW119KTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIG1lc3NhZ2VIYW5kbGVyKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gIHZhciBoYW5kbGVycyA9IHtcbiAgICAnd2lraWhvYXhidXN0ZXI6OnNldFNwaW5uZXInOiBzZXRTcGlubmVyLFxuICB9O1xuICBpZihyZXF1ZXN0LnR5cGUgJiYgaGFuZGxlcnNbcmVxdWVzdC50eXBlXSkge1xuICAgIC8vIHJldHVybiB0byBjaHJvbWUgd2hpbGUgZXhwbGljaXRseSBjYXN0aW5nIHRvIGJvb2xlYW5cbiAgICByZXR1cm4gISFoYW5kbGVyc1tyZXF1ZXN0LnR5cGVdKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNwaW5uZXIgPSBmdW5jdGlvbiBTcGlubmVyKHRhYklkKSB7XG4gIHRoaXMudGFiSWQgPSB0YWJJZDtcbiAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG59O1xuXG5TcGlubmVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmKHNlbGYuaW50ZXJ2YWwpIHtcbiAgICBjbGVhckludGVydmFsKHNlbGYuaW50ZXJ2YWwpO1xuICB9XG5cbiAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICB2YXIgbGluZXMgPSA4MDtcbiAgdmFyIGNXID0gMTk7XG4gIHZhciBjSCA9IDE5O1xuICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gIGltZy5zcmMgPSAnaW1hZ2VzL2ljb24tMTkucG5nJztcblxuICB2YXIgZHJhd1NwaW5uZXIgPSBmdW5jdGlvbiBkcmF3U3Bpbm5lcigpIHtcbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB2YXIgcm90YXRpb24gPSBwYXJzZUludCgoKG5ldyBEYXRlKCkgLSBkYXRlKSAvIDE4MDApICogbGluZXMpIC8gbGluZXM7XG4gICAgY29udGV4dC5zYXZlKCk7XG4gICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY1csIGNIKTtcbiAgICBjb250ZXh0LmRyYXdJbWFnZShpbWcsIDAsIDAsIDE5LCAxOSk7XG4gICAgY29udGV4dC50cmFuc2xhdGUoY1cgLyAyLCBjSCAvIDIpO1xuICAgIGNvbnRleHQucm90YXRlKE1hdGguUEkgKiAyICogcm90YXRpb24pO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGxpbmVzOyBpKyspIHtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0LnJvdGF0ZShNYXRoLlBJICogMiAvIGxpbmVzKTtcbiAgICAgIGNvbnRleHQubW92ZVRvKGNXIC8gNiwgMCk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhjVyAvIDIsIDApO1xuICAgICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE1MCwgMTUwLCAxNTAsICcgKyBpIC8gbGluZXMgKyAnKSc7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgICByZXR1cm4gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgMTksIDE5KTtcbiAgfTtcblxuICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5pbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGNocm9tZS5wYWdlQWN0aW9uLnNldEljb24oe2ltYWdlRGF0YTogZHJhd1NwaW5uZXIoKSwgdGFiSWQ6IHNlbGYudGFiSWR9KTtcbiAgICB9LCAxMDAwIC8gMjApO1xuICB9O1xufTtcblxuU3Bpbm5lci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uIHN0b3AoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYodGhpcy5pbnRlcnZhbCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gIH1cbiAgY2hyb21lLnBhZ2VBY3Rpb24uc2V0SWNvbih7cGF0aDogJ2ltYWdlcy9pY29uLTE5LnBuZycsIHRhYklkOiBzZWxmLnRhYklkfSk7XG4gIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcGlubmVyO1xuIl19
