var express = require('express');
var mongodb = require('mongodb'),
	Server	= mongodb.Server,
	Db		= mongodb.Db;

var os		= require('os');
var http	= require('http');
var url		= require('url');
var path	= require('path');

var app = express();

//Configure
app.configure(function() {
	app.set('port',		54321);
	app.set('msgIn',	'');
	app.set('msgOut',	'');
	
	app.set("view options",	{layout: false});
	app.set('views',		__dirname + '/views');
	app.set('view engine',	'jade');
	
	app.use(express.static(path.join(__dirname, '/public')));
	
	app.use(app.router);
	app.use(express.bodyParser());
});

//Database
var sharkDB = new Db('sharkDB', new Server('127.0.0.1', 27017, {}));
sharkDB.open(function(err, db) {
	if(!err)	{
		console.log('Mongo Loaded Successfully')
		sharkDB.collection('users', {safe:true}, function(err, collection) {
			collection.count(function(err, count) {
				console.log((count-2) + ' users found in database')
			});
		});
	}
	else		{ console.log('MONGO ERROR');	console.log(err) }
});
// wtf


// /
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



// /craps4inno
//Routing
app.get('/craps4inno', function(req, res) {
	console.log(req.path + '\t\tRequest from ' + req.ip)
	
	res.render('craps4inno.jade', {scripts: ['http://code.jquery.com/jquery-1.8.2.min.js', 'craps4inno/javascript/control.js', '']})
});


// /provisioncs
app.get('/provisioncs', function(req, res) {
	console.log(req.path + '\t\tRequest from ' + req.ip)
	
	res.render('provisioncs')
});

//Messages
app.get('/provisioncs/Login', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	//userLogin, userPassword
	msgIn = url.parse(req.url, true).query
	
	//set & send
	sharkDB.collection('users', {safe:true}, function(err, collection) {
		//Check for errors
		if(!err) {
			//no errors...
			//check if user exists
			collection.findOne({userLogin: msgIn.userLogin, userPass: msgIn.userPass}, function(err, item) {
				if(item !=null) {
					//user exists...
					//return successful login
					returnMsg('\n\
					{\n\
						"loginStatus" : 1,\n\
						"userID"      : '+ item.userID +'\n\
					}', res)
				}
				else {
					//user does not exist...
					//return failed login
					returnMsg('\n\
					{\n\
						"loginStatus" : 2,\n\
					}', res)
				}
			});
		}
		else {
			//errors...
			//return server is having problems
			returnMsg('\n\
			{\n\
				"loginStatus" : 0,\n\
			}', res)
		}
	});
});

app.get('/provisioncs/AddUser', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	msgIn = url.parse(req.url, true).query
	
	//set & send
	sharkDB.collection('users', {safe:true}, function(err, collection) {
		if(!err) {
			if(msgIn.userID != 1) { alert('OMG INTRUDERS!!! OPEN FIRE!!! >:O') }
			else {
				//INSERT STUFF HERE 
				collection.insert( {
					"userID"	: msgIn.AuserID,
					"name"		: msgIn.Aname,
					"userLogin"	: msgIn.AuserLogin,
					"userPass"	: msgIn.AuserPass,
					"accountStatus" : msgIn.AaccountStatus,
				}, {safe: true}, function(err, docs) {
					if(!err) {
						console.log('User Added')
						returnMsg('{"status" : true}', res)
					}
					else {
						console.log('failed')
						returnMsg('{"status" : false}', res)
					}
				});
			}
		} else {console.log(err)}
	});
});

app.get('/provisioncs/UpdateUser', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	msgIn = url.parse(req.url, true).query
	
	//set & send
	sharkDB.collection('users',{safe:true}, function(err, collection) {
		console.log(msgIn)
		if(!err) {
			if(msgIn.userID != 1) { alert('ERRORORORRORRR!!!!!!!!!!! :O') }
			else {
				collection.update(
				{ userID : msgIn.EuserID},
				{ $set : {
					"userID"	: msgIn.EuserID,
					"name"		: msgIn.Ename,
					"userLogin"	: msgIn.EuserLogin,
					"userPass"	: msgIn.EuserPass,
					"accountStatus" : msgIn.EaccountStatus,
				}}, true, function(err, doc) {
					if(!err) {
						console.log('User updated')
						returnMsg('{"status" : true}', res)
					}
					else {
						console.log('failed')
						returnMsg('{"status" : false}', res)
					}
				});
			}
		} else {console.log(err)}
	});
});

app.get('/provisioncs/SubmitCode', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	//userID, theCode
	msgIn = url.parse(req.url, true).query
	
	//set
	n = msgIn.theCode.split('')
	
	m = "0"
	if		(msgIn.days == "15") { m = "520596".split('') }
	else if	(msgIn.days == "30") { m = "713564".split('') }
	else if	(msgIn.days == "45") { m = "144901".split('') }
	else if	(msgIn.days == "60") { m = "210868".split('') }
	
	c = 0
	
	result = ""
	for(i=0; i<n.length; i++) {
		c = c + n[i].charCodeAt(0) + m[i].charCodeAt(0)
		result = result + c.toString().substring(c.toString().length-1)
	}
	
	//send
	returnMsg('\n\
	{\n\
		"theAnswer" : "'+result+'"\n\
	}', res)
});

app.get('/provisioncs/GetUsers', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	msgIn = url.parse(req.url, true).query
	
	//set & send
	sharkDB.collection('users', {safe:true}, function(err, collection) {
		if(!err) {
			collection.find().toArray(function(err, docs) {
				returnMsg(jsonificate(docs), res)
			});
		} else {console.log(err)}
	});
});




// /provisionxyz
app.get('/provisionxyz', function(req, res) {
	console.log(req.path + '\t\tRequest from ' + req.ip)
	
	res.render('provisionxyz')
});

//Messages
app.get('/provisionxyz/Login', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	//userLogin, userPassword
	msgIn = url.parse(req.url, true).query
	
	//set & send
	sharkDB.collection('users', {safe:true}, function(err, collection) {
		//Check for errors
		if(!err) {
			//no errors...
			//check if user exists
			collection.findOne({userLogin: msgIn.userLogin, userPass: msgIn.userPass}, function(err, item) {
				if(item !=null) {
					//user exists...
					//return successful login
					returnMsg('\n\
					{\n\
						"loginStatus" : 1,\n\
						"userID"      : '+ item.userID +'\n\
					}', res)
				}
				else {
					//user does not exist...
					//return failed login
					returnMsg('\n\
					{\n\
						"loginStatus" : 2,\n\
					}', res)
				}
			});
		}
		else {
			//errors...
			//return server is having problems
			returnMsg('\n\
			{\n\
				"loginStatus" : 0,\n\
			}', res)
		}
	});
});

app.get('/provisionxyz/AddUser', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	msgIn = url.parse(req.url, true).query
	
	//set & send
	sharkDB.collection('users', {safe:true}, function(err, collection) {
		if(!err) {
			if(msgIn.userID != 1) { alert('OMG INTRUDERS!!! OPEN FIRE!!! >:O') }
			else {
				//INSERT STUFF HERE 
				collection.insert( {
					"userID"	: msgIn.AuserID,
					"name"		: msgIn.Aname,
					"userLogin"	: msgIn.AuserLogin,
					"userPass"	: msgIn.AuserPass,
					"accountStatus" : msgIn.AaccountStatus,
				}, {safe: true}, function(err, docs) {
					if(!err) {
						console.log('User Added')
						returnMsg('{"status" : true}', res)
					}
					else {
						console.log('failed')
						returnMsg('{"status" : false}', res)
					}
				});
			}
		} else {console.log(err)}
	});
});

app.get('/provisionxyz/UpdateUser', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	msgIn = url.parse(req.url, true).query
	
	//set & send
	sharkDB.collection('users',{safe:true}, function(err, collection) {
		console.log(msgIn)
		if(!err) {
			if(msgIn.userID != 1) { alert('ERRORORORRORRR!!!!!!!!!!! :O') }
			else {
				collection.update(
				{ userID : msgIn.EuserID},
				{ $set : {
					"userID"	: msgIn.EuserID,
					"name"		: msgIn.Ename,
					"userLogin"	: msgIn.EuserLogin,
					"userPass"	: msgIn.EuserPass,
					"accountStatus" : msgIn.EaccountStatus,
				}}, true, function(err, doc) {
					if(!err) {
						console.log('User updated')
						returnMsg('{"status" : true}', res)
					}
					else {
						console.log('failed')
						returnMsg('{"status" : false}', res)
					}
				});
			}
		} else {console.log(err)}
	});
});

app.get('/provisionxyz/SubmitCode', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	//userID, theCode
	msgIn = url.parse(req.url, true).query
	
	//set
	n = msgIn.theCode.split('')
	m = "743816".split('')
	c = 0
	
	result = ""
	for(i=0; i<n.length; i++) {
		c = c + n[i].charCodeAt(0) + m[i].charCodeAt(0)
		result = result + c.toString().substring(c.toString().length-1)
	}
	
	//send
	returnMsg('\n\
	{\n\
		"theAnswer" : "'+result+'"\n\
	}', res)
});

app.get('/provisionxyz/GetUsers', function(req, res) {
	console.log(req.path + '\t Request from ' + req.ip)
	
	//get
	msgIn = url.parse(req.url, true).query
	
	//set & send
	sharkDB.collection('users', {safe:true}, function(err, collection) {
		if(!err) {
			collection.find().toArray(function(err, docs) {
				returnMsg(jsonificate(docs), res)
			});
		} else {console.log(err)}
	});
});

//Functions
function jsonificate(mongoC) {
	var result = '{users:['
	for(i=0; i<mongoC.length; i++) {
		result += '{ ';
		result += "\"userLogin\" : \"" + mongoC[i].userLogin + '\",';
		result += "\"userPass\" : \"" + mongoC[i].userPass + '\",';
		result += "\"userID\" : " + mongoC[i].userID + ',';
		result += "\"name\" : \"" + mongoC[i].name + '\",';
		result += "\"accountStatus\" : \"" + mongoC[i].accountStatus + '\",';
		result += ' },\n';
	}
	result += ']}'
	
	return result
}



//Servreitize
http.createServer(app).listen(app.get('port'), function() {
	console.log('Server listening on port ' + app.get('port'))
});





//Gerneral Functions
function returnMsg(jsonOut, res) {
	msgOut = msgIn.Callback + '(' + jsonOut + ')'
	res.header('Content-Type', 'text/javascript')
	res.header('Charset', 'utf-8')
	res.send(msgOut)
}
function printOut() {
	console.log('message sent:')
	console.log(msgOut)
	console.log('\n\n')
}
function printIn() {
	console.log('message received:')
	console.log(msgIn)
	console.log('')
}














