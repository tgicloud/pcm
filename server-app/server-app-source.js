/**
 * pcm
 * server-app-source
 */

// Initialize connect
var connect = require('connect');
var app = connect();
app.use(connect.static('client-app'));
app.use(connect.directory('client-app', {icons: true}));

var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (k in interfaces) {
  for (k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family == 'IPv4' && !address.internal) {
      addresses.push(address.address)
    }
  }
}

// Start up HTTP server (http)
var version = "0.1";
var ServerName = "PCM";
var IP = addresses[0];
var Port = 8080;
var http = require('http').createServer(app);
var server = http.listen(Port, function () {
  console.log(ServerName + '\nVersion ' + version + '\nAddress: http://' + IP + ':' + Port);
});

// Start up Socket Server (io)
var Connections = []; // Array of connections
var io = require('socket.io').listen(server);

console.log('T.getVersion(' + T.getVersion() + ')');


// try to create a mongoStore
var mongo = require('mongodb');
var hostStore = new MemoryStore({name: 'PCM Store'});
var mongoStore = new MongoStore({name: 'PCM Store'});
mongoStore.onConnect('http://localhost', function (store, err) {
  if (err) {
    console.warn('mongoStore unavailable (' + err + ')');
  } else {
    console.log('mongoStore connected');
    hostStore = mongoStore; // use mongoDB for hostStore

    // See if app has been installed
    hostStore.getList(new List(new SysApp()), [], function (list, error) {
      if (typeof error != 'undefined') {
        console.log('Error getting SysApp...\n', JSON.stringify(error));
        return;
      }
      if (list._items.length < 1)
        initializeDataStore();
      else {
        list.firstItem();
        getSysApp(list.get('id'));
      }
    });
  }
  console.log(hostStore.name + ' ' + hostStore.storeType);
});

// Initialize Data Store
function initializeDataStore() {
  console.log('Initializing DataStore');
  sysApp.set('appID', 'pcm');
  sysApp.set('storeInitDate', new Date());
  hostStore.putModel(sysApp, function (model, error) {
    if (typeof error != 'undefined') {
      console.log('Error Initializing DataStore...\n', JSON.stringify(error));
      return;
    }
    getSysApp(model.get('id'));
  });

  // default login
  var login = new Login();
  login.set('name','crown');
  login.set('password','Keepout!');
  hostStore.putModel(login, function (model, error) {
    if (typeof error != 'undefined') {
      console.log('Error creating default account...\n', JSON.stringify(error));
      return;
    }
  });

}

// Load SysApp object
var sysApp = new SysApp();
function getSysApp(id) {
  console.log('getting sysApp ' + id);
  sysApp.set('id', id)
  hostStore.getModel(sysApp, function (model, error) {
    if (typeof error != 'undefined') {
      console.log('Error getting sysApp...\n', JSON.stringify(error));
      return;
    }
    if (sysApp.get('appID') == 'pcm')
      console.log('INIT: ok...............');
    else
      console.log('INIT: fail.............');
  });
}

//io.set('log level', 1);
io.set('log', false);
io.on('connection', function (socket) {
  console.log('socket.io connection: ' + socket.id);
  socket.on('ackmessage', T.hostMessageProcess);
  socket.on('message', function (obj) {
    console.log('message socket.io message: ' + obj);
  });
  socket.on('disconnect', function (reason) {
    console.log('message socket.io disconnect: ' + reason);
  });
});

io.of('hostStore').on('connection', function (socket) {
  console.log('hostStore socket.io connection: ' + socket.id);
  socket.on('ackmessage', function (obj, fn) {
    console.log('hostStore socket.io ackmessage: ' + obj);
    fn('Ack');
  });
  socket.on('message', function (obj) {
    console.log('hostStore socket.io message: ' + obj);
  });
  socket.on('disconnect', function (reason) {
    console.log('hostStore socket.io disconnect: ' + reason);
  });
});
