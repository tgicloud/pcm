


var express = require('express');
var mongodb = require('mongodb'),
  Server = mongodb.Server,
  Db = mongodb.Db;

var os = require('os');
var http = require('http');
var url = require('url');
var path = require('path');

var app = express();


//stuff
var numberOfUsers


//Configure
app.configure(function () {
  app.set('port', 12345);
  app.set('msgIn', '');
  app.set('msgOut', '');

  app.set("view options", {layout: false});
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.static(path.join(__dirname, 'public')));

  app.use(app.router);
  app.use(express.bodyParser());
});


//Database
var sharkDB = new Db('sharkDB', new Server('127.0.0.1', 27017, {}));
sharkDB.open(function (err, db) {
  if (!err) {
    console.log('Mongo Loaded Successfully')
    sharkDB.collection('users', {safe: true}, function (err, collection) {
      if (!err) {
        collection.count(function (err, count) {
          numberOfUsers = count - 2
          console.log((count - 2) + ' users found in database')
        });
      } else {
        console.log("sharkDB.collection('users') error");
        console.log(err)
      }
    });
  } else {
    console.log('MONGO ERROR');
    console.log(err)
  }
});


//Routing
app.get('/test', function (req, res) {
  var ua = req.header('user-agent');
  if (/mobile/i.test(ua)) {
    console.log('mobile')
  }
  else {
    console.log('NOT mobile')
  }
});

app.get('/', function (req, res) {
  console.log(req.path + '\t Request from ' + req.ip)

  //get
  //msgIn = url.parse(req.url, true).query

  //set
  //

  //send
  res.render('index')
});

app.get('/Main', function (req, res) {
  console.log(req.path + '\t Request from ' + req.ip)

  //get message
  msgIn = url.parse(req.url, true).query

  //send user to appropriate page
  if (typeof msgIn.userID == 'undefined' || msgIn.userID <= -1)	//User did not login, redirect
  {
    res.redirect('/')
  }
  else if (msgIn.userID == 0)										//TEST USER(do same as 2+)
  {
    res.render('userPage')
  }
  else if (msgIn.userID == 1)										//Admin, render adminPage
  {
    res.render('adminPage')
  }
  else	//2+													//User, render userPage
  {
    res.render('userPage')
  }
});

//Messages
app.get('/Login', function (req, res) {
  console.log(req.path + '\t Request from ' + req.ip)

  //get
  //userLogin, userPassword
  msgIn = url.parse(req.url, true).query

  //set & send
  sharkDB.collection('users', {safe: true}, function (err, collection) {
    //Check for errors
    if (!err) {
      //no errors...
      //check if user exists
      collection.findOne({userLogin: msgIn.userLogin, userPass: msgIn.userPass}, function (err, item) {
        if (item != null) {
          //user exists...
          //return successful login
          returnMsg('\n\
					{\n\
						"loginStatus" : 1,\n\
						"userID"      : ' + item.userID + '\n\
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

app.get('/AddUser', function (req, res) {
  console.log(req.path + '\t Request from ' + req.ip)

  //get
  msgIn = url.parse(req.url, true).query

  //set & send
  sharkDB.collection('users', {safe: true}, function (err, collection) {
    if (!err) {
      if (msgIn.userID != 1) {
        alert('OMG INTRUDERS!!! OPEN FIRE!!! >:O')
      }
      else {
        //INSERT STUFF HERE
        collection.insert({
          "userID": msgIn.AuserID,
          "name": msgIn.Aname,
          "userLogin": msgIn.AuserLogin,
          "userPass": msgIn.AuserPass,
          "accountStatus": msgIn.AaccountStatus,
        }, {safe: true}, function (err, docs) {
          if (!err) {
            console.log('User Added')
            returnMsg('{"status" : true}', res)
          }
          else {
            console.log('failed')
            returnMsg('{"status" : false}', res)
          }
        });
      }
    } else {
      console.log(err)
    }
  });
});

app.get('/UpdateUser', function (req, res) {
  console.log(req.path + '\t Request from ' + req.ip)

  //get
  msgIn = url.parse(req.url, true).query

  //set & send
  sharkDB.collection('users', {safe: true}, function (err, collection) {
    console.log(msgIn)
    if (!err) {
      if (msgIn.userID != 1) {
        alert('ERRORORORRORRR!!!!!!!!!!! :O')
      }
      else {
        collection.update(
          { userID: msgIn.EuserID},
          { $set: {
            "userID": msgIn.EuserID,
            "name": msgIn.Ename,
            "userLogin": msgIn.EuserLogin,
            "userPass": msgIn.EuserPass,
            "accountStatus": msgIn.EaccountStatus,
          }}, true, function (err, doc) {
            if (!err) {
              console.log('User updated')
              returnMsg('{"status" : true}', res)
            }
            else {
              console.log('failed')
              returnMsg('{"status" : false}', res)
            }
          });
      }
    } else {
      console.log(err)
    }
  });
});

app.get('/SubmitCode', function (req, res) {
  console.log(req.path + '\t Request from ' + req.ip)

  //get
  //userID, theCode
  msgIn = url.parse(req.url, true).query

  //set
  n = msgIn.theCode.split('')
  m = "743816".split('')
  c = 0

  result = ""
  for (i = 0; i < n.length; i++) {
    c = c + n[i].charCodeAt(0) + m[i].charCodeAt(0)
    result = result + c.toString().substring(c.toString().length - 1)
  }

  //send
  returnMsg('\n\
	{\n\
		"theAnswer" : "' + result + '"\n\
	}', res)
});

app.get('/GetUsers', function (req, res) {
  console.log(req.path + '\t Request from ' + req.ip)

  //get
  msgIn = url.parse(req.url, true).query

  //set & send
  sharkDB.collection('users', {safe: true}, function (err, collection) {
    if (!err) {
      collection.find().toArray(function (err, docs) {
        returnMsg(jsonificate(docs), res)
      });
    } else {
      console.log(err)
    }
  });
});


//Serveritize
http.createServer(app).listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'))
});


//SOME STUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUFFFFFFFFFFFFFFFFFFFFFFFFF
function returnMsg(jsonOut, res) {
  msgOut = msgIn.Callback + '(' + jsonOut + ')'
  res.header('Content-Type', 'text/javascript')
  res.header('Charset', 'utf-8')
  res.send(msgOut)
}
function jsonificate(mongoC) {
  var result = '{users:['
  for (i = 0; i < mongoC.length; i++) {
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


