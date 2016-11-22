var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']); // Replace '../' with 'accel-mma84' in your own code
var http = require('http');
var server = http.createServer();
// Initialize the accelerometer.
var count = 0
var current = null;
var previous;
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
            console.log('STOP THIEF!');
            var request = http.request({
              hostname: '192.168.5.14',
              port: 7599,
              path: '/snatched',
              method: 'POST',
            
            });
               request.write("HOW DARE YOU");
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
