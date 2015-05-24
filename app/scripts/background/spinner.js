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
      context.strokeStyle = 'rgba(255, 255, 255, ' + i / lines + ')';
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
