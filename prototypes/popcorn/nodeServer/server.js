
var port		= 54321

var msgIn		= ''
var msgOut		= ''

var express		= require('express')
var url			= require('url')
var http		= require('http')
var os			= require('os')


var app = express()

app.configure(function() {
  app.set("view options", {layout: false});
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
});



app.get('/', function(req, res) {
	console.log(req.path + '\t\tRequest from ' + req.ip)
	
	//get
	msgIn = url.parse(req.url, true).query
	
	//set
	msgOut = '<h1><font color=teal> Coming Soon </font></h1>'
	
	//send
	res.header('Content-Type', 'text/html')
	res.header('charset', 'utf-8')
	res.send(msgOut)
});

app.get('/craps4inno', function(req, res) {
	console.log(req.path + '\t\tRequest from ' + req.ip)
	
	res.render('craps4inno.jade', {scripts: ['http://code.jquery.com/jquery-1.8.2.min.js', 'craps4inno/javascript/control.js', '']})
});



app.listen(port)
console.log('Server running on port ' + port + '\n')