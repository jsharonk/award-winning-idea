var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var player = require('play-sound')(opts = {});

app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('views', {noCache: true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var message = {text: 'Your stuff is undisturbed!'};

app.listen('7599', function() {
  console.log('server listening on port 7599');
});

app.get('/', function(req, res, next) {

  res.render('index', {message: message});
});

app.post('/', function(req, res, next) {
  res.send(req.body.response);
});

// app.get('/ohno', function(req, res, next) {
//   res.render('index', {message: message});
// });

app.post('/snatched', function(req, res, next) {
  console.log('Someone took your food!!');
  var audio = player.play('Alarm.mp3', function(err) {
    if (err) console.log('Sound alert error!');
  });
  setTimeout(function() {
    audio.kill();
  }, 5000);

  //message = {text: 'Someone is messing with your stuff!!!'}
  //res.redirect('/ohno');
});
