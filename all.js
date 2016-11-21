//accel

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']); // Replace '../' with 'accel-mma84' in your own code
var http = require('http');
var server = http.createServer();
// Initialize the accelerometer.
var count = 0
var current = null;
var previous;
var caught = false;
accel.on('ready', function () {
    // Stream accelerometer data
  accel.on('data', function (xyz) {
    count++;
    if (count === 5) {
      previous = current;
      current = xyz;
      if (previous !== null) {
        if ((Math.abs(previous[0] - current[0]) >= .02)
          || (Math.abs(previous[1] - current[1]) >= .02)
          || (Math.abs(previous[2] - current[2]) >= .02)) {
            if (!caught) {
            console.log('STOP THIEF!');

            var request = http.request({

              hostname: '192.168.5.14',
              port: 7599,
              path: '/snatched',
              method: 'POST'

            }, function(res) {
              res.on('data', function(chunk) {
                console.log('body', chunk.toString());
                promptActivate(chunk.toString());
              });
            });

               request.write("HOW DARE YOU");


               servoActivate();
              //  speakerActivate();

               caught = true;
          }
        }
      }
      console.log('x:', xyz[0].toFixed(2), 'y:', xyz[1].toFixed(2), 'z:', xyz[2].toFixed(2));
      count = 0;
    }
  });

});

accel.on('error', function(err){
  console.log('Error:', err);
});

// var tessel = require('tessel');
// var accel = require('accel-mma84').use(tessel.port['A']); // Replace '../' with 'accel-mma84' in your own code
// var http = require('http');
// var server = http.createServer();
// // Initialize the accelerometer.
// var count = 0
// var current = null;
// var previous;
// accel.on('ready', function () {
//     // Stream accelerometer data
//   accel.on('data', function (xyz) {
//     count++;
//     if (count === 5) {
//       previous = current;
//       current = xyz;
//       if (previous !== null) {
//         if ((Math.abs(previous[0] - current[0]) >= .02)
//           || (Math.abs(previous[1] - current[1]) >= .02)
//           || (Math.abs(previous[2] - current[2]) >= .02)) {
//             console.log('STOP THIEF!');
//             var request = http.request({
//               hostname: '192.168.5.14',
//               port: 7599,
//               path: '/snatched',
//               method: 'POST',
//               // headers: {
//               //   'content-type':
//               //   'con'
//               // }
//             });
//
//                request.write("HOW DARE YOU");
//           }
//       }
//       console.log('x:', xyz[0].toFixed(2), 'y:', xyz[1].toFixed(2), 'z:', xyz[2].toFixed(2));
//       count = 0;
//     }
//   });
//
// });
//
// accel.on('error', function(err){
//   console.log('Error:', err);
// });

//sound

var path = require('path');
var av = require('tessel-av');
//var mp3 = path.join(__dirname, 'yoda-mudhole.mp3');
//var sound = new av.Speaker(mp3);
var speaker = new av.Speaker();
//sound.play();
var speakerActivate = function() {
  speaker.say(`Stop thief.  That's mine!`);
  // sound.on('ended', function(seconds) {
  //   sound.play();
  // });
  speaker.on('ended', function(seconds) {
    speaker.say(`Stop thief.  That's mine!`);
  });
};

var promptActivate = function(prompt) {
  speaker.say(prompt);
  // sound.on('ended', function(seconds) {
  //   sound.play();
  // });
  speaker.on('ended', function(seconds) {
    speaker.say(prompt);
  });
};



//servo

var tessel = require('tessel');
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['B']);

var servo1 = 1; // We have a servo plugged in at position 1

var servoActivate = function() {

  var servo = servolib.use(tessel.port['B']);

  var servo1 = 1; // We have a servo plugged in at position 1
  servo.on('ready', function () {
    var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

    //  Set the minimum and maximum duty cycle for servo 1.
    //  If the servo doesn't move to its full extent or stalls out
    //  and gets hot, try tuning these values (0.05 and 0.12).
    //  Moving them towards each other = less movement range
    //  Moving them apart = more range, more likely to stall and burn out
    servo.configure(servo1, 0.05, 0.12, function () {
      setInterval(function () {
        console.log('Position (in range 0-1):', position);
        //  Set servo #1 to position pos.
        servo.move(servo1, position);

        // Increment by 10% (~18 deg for a normal servo)
        position += 0.1;
        if (position > 1) {
          position = 0; // Reset servo position
        }
      }, 500); // Every 500 milliseconds
    });
  });

};
