var path = require('path');
var av = require('tessel-av');
//var mp3 = path.join(__dirname, 'yoda-mudhole.mp3');
//var sound = new av.Speaker(mp3);
var speaker = new av.Speaker();
//sound.play();
speaker.say(`Stop thief.  That's mine!`);
// sound.on('ended', function(seconds) {
//   sound.play();
// });
speaker.on('ended', function(seconds) {
  speaker.say(`Stop thief.  That's mine!`);
});
