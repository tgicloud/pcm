/**
 * pcm
 * server-app-source
 */

console.log('T.getVersion(' + T.getVersion() + ')');

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

// Start up HTTPS server (https)
var version = "0.1";
var ServerName = "PCM";
var IP = addresses[0];
var Port = 8080;
var http = require('https');
var fs = require('fs');
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var httpServer = http.createServer(options,app);
var server = httpServer.listen(Port, function () {
  console.log(ServerName + '\nVersion ' + version + '\nAddress: https://' + IP + ':' + Port + '/client-app.html');
});

// Start up Socket Server (io)
var io = require('socket.io').listen(server);

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
  sysApp.set('maxMatch', 20);
  hostStore.putModel(sysApp, function (model, error) {
    if (typeof error != 'undefined') {
      console.log('Error Initializing DataStore...\n', JSON.stringify(error));
      return;
    }
    getSysApp(model.get('id'));
  });


  // Admin Group
  var sec = new Group();
  sec.set('name','Admin');
  sec.set('cellAccess',true);
  sec.set('wsAccess',true);
  sec.set('canAddWithoutPhoto',true);
  sec.set('canAddMember',true);
  sec.set('canSetMatch',true);
  sec.set('canSearchMember',true);
  sec.set('canCheckIn',true);
  sec.set('canMatchPlay',true);
  hostStore.putModel(sec, function (model, error) {
    if (typeof error != 'undefined') {
      console.log('Error creating default Admin...\n', JSON.stringify(error));
      return;
    }
    // default login
    var login = new Login();
    login.set('name','crown');
    login.set('password','Keepout!');
    login.set('GroupID',model.get('id'));
    hostStore.putModel(login, function (model, error) {
      if (typeof error != 'undefined') {
        console.log('Error creating default account...\n', JSON.stringify(error));
        return;
      }
    });

  });

  // Security Group
  var sec = new Group();
  sec.set('name','Security');
  sec.set('cellAccess',true);
  sec.set('wsAccess',false);
  sec.set('canAddWithoutPhoto',false);
  sec.set('canAddMember',false);
  sec.set('canSetMatch',false);
  sec.set('canSearchMember',false);
  sec.set('canCheckIn',true);
  sec.set('canMatchPlay',false);
  hostStore.putModel(sec, function (model, error) {
    if (typeof error != 'undefined') {
      console.log('Error creating default Security...\n', JSON.stringify(error));
      return;
    }
  });

  // Attendant Group
  var sec = new Group();
  sec.set('name','Attendant');
  sec.set('cellAccess',false);
  sec.set('wsAccess',false);
  sec.set('canAddWithoutPhoto',false);
  sec.set('canAddMember',true);
  sec.set('canSetMatch',false);
  sec.set('canSearchMember',true);
  sec.set('canCheckIn',false);
  sec.set('canMatchPlay',true);
  hostStore.putModel(sec, function (model, error) {
    if (typeof error != 'undefined') {
      console.log('Error creating default Attendant...\n', JSON.stringify(error));
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
