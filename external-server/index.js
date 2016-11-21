var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');

app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('views', {noCache: true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.listen('7599', function() {
  console.log('server listening on port 7599');
});

app.get('/', function(req, res, next) {
  var message = {text: 'Your stuff is undisturbed!'}
  res.render('index', {message: message});
});

app.post('/')
