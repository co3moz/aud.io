//noinspection JSUnresolvedVariable
navigator.getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia);
//noinspection JSUnresolvedVariable
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var socket = io();
var down = 0;
var up = 0;
var upDown = document.getElementById('updown');

socket.on('data', function (data) {
  var blob = new Blob([data], {'type': 'audio/ogg; codecs=opus'});
  var audio = document.createElement("audio");
  audio.src = URL.createObjectURL(blob);
  audio.play();
  down += data.byteLength;
});


setInterval(function () {
  upDown.innerHTML = 'up: <b>' + up * 2 + ' byte/sn</b><br>down: <b>' + down * 2 + ' byte/sn</b>';
  down = up = 0;
}, 500);


navigator.getUserMedia({audio: true}, function (stream) {
  setInterval(function () {
    var mediaRecorder = new MediaRecorder(stream);
    var chunks = [];
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    setTimeout(function () {
      mediaRecorder.stop();
      var blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'});
      var fileReader = new FileReader();
      fileReader.onload = function () {
        socket.emit('data', this.result);
        up += this.result.byteLength;
      };
      fileReader.readAsArrayBuffer(blob);
    }, 500);
    mediaRecorder.start();
  }, 500);
}, function (err) {
  console.log(err);
});