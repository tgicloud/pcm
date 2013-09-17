/**
 * pcm
 * client-app/client-app.js
 */

var pcm = {};
pcm.lastPanelShown = "loadingPanel";
pcm.userID = null;
pcm.panelLoaders = {};

// -------------------------------------------------------------------------------------------------------------------
// Entry point when document ready
// -------------------------------------------------------------------------------------------------------------------
$(document).ready(function () {
  loadStore();
//  console.log('-------------------------------------------------------------------------------------------------------------------');
//  for (var i = 0; i < 3; i++) {
//    var myID = makeIDCard();
//    if (IDCardValid(myID))
//      console.log('\tmyID  OK: ' + myID);
//    else
//      console.log('\tmyID BAD: ' + myID);
//  }
//
//  myID = 'YJyvYHmMFvA_86e061c0';
//  if (IDCardValid(myID))
//    console.log('\tmyID  OK: ' + myID);
//  else
//    console.log('\tmyID BAD: ' + myID);
//
//  myID = 'YJyvYHmMFVA_86e061c0';
//  if (IDCardValid(myID))
//    console.log('\tmyID  OK: ' + myID);
//  else
//    console.log('\tmyID BAD: ' + myID);
//
//  myID = 'shit';
//  if (IDCardValid(myID))
//    console.log('\tmyID  OK: ' + myID);
//  else
//    console.log('\tmyID BAD: ' + myID);

});

// -------------------------------------------------------------------------------------------------------------------
// check In Panel Loader
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.homePanel = function () {

  var self = this;

  // Clear Name & Address
  document.getElementById("homeInfo").innerHTML = "You are logged in as <strong>"+pcm.userLogin+"</strong>." +
    "<br><br>Select function from menu above menu.";

};

// -------------------------------------------------------------------------------------------------------------------
// Load the host store
// -------------------------------------------------------------------------------------------------------------------
function loadStore() {
  switchToPanel("loadingPanel", false)

  // Callback after store loaded
  var storeLoadCallback = function (success) {
    clearInterval(storeWatchdog);
    if (success) {
      switchToPanel("logInPanel", false);
//      switchToPanel("newMemberPanel", false);
    } else {
      switchToPanel("loadErrorPanel", false);
    }
  };

  // Watchdog timeout for store loaded
  var storeWatchdog = setInterval(function () {
    console.warn('Stores took too long to load');
    storeLoadCallback(true);
  }, 1000);

  // try to create a hostStore
  pcm.hostStore = new RemoteStore({name: 'PCM Store'});
  pcm.hostStore.onConnect('http://localhost', function (store, err) {
    if (err) {
      console.warn('hostStore unavailable (' + err + ')');
      storeLoadCallback(false);
    } else {
      console.warn('hostStore connected.');
      storeLoadCallback(true);
    }
  });

}

// -------------------------------------------------------------------------------------------------------------------
// Login
// -------------------------------------------------------------------------------------------------------------------
function login() {

  // Rest any form data
  clearNewMemberForm();

  // Get from html input controls
  var loginText = document.getElementById("txtLogin").value;
  var passwordText = document.getElementById("txtPassword").value;

  // Both fields required
  if (!loginText || !passwordText) {
    alertDanger('Login and password required.');
    return;
  }

//  // Add to store for now
//  var loginModel = new Login();
//  loginModel.set('name', loginText);
//  loginModel.set('password', passwordText);
//  pcm.hostStore.putModel(loginModel, function (model, error) {
//    if (typeof error != 'undefined') {
//      alertDanger('Error: ' + error);
//      return;
//    }
//    pcm.userID = true;
//    command('home');
//  });

  // Search store for user
  var loginList = new List(new Login());
  pcm.hostStore.getList(loginList, {name: loginText, password: passwordText}, function (list, error) {
    if (typeof error != 'undefined') {
      alertDanger('Error: ' + error);
      return;
    }
    if (list.length() < 1) {
      alertDanger('login failed');
      return;
    }
    pcm.userID = true;
    pcm.userLogin = loginText;
    command('home');
  });
}

// -------------------------------------------------------------------------------------------------------------------
// crc32 https://gist.github.com/Yaffle/1287361
// -------------------------------------------------------------------------------------------------------------------
function crc32(s/*, polynomial = 0x04C11DB7, initialValue = 0xFFFFFFFF, finalXORValue = 0xFFFFFFFF*/) {
  s = String(s);
  var polynomial = arguments.length < 2 ? 0x04C11DB7 : arguments[1],
    initialValue = arguments.length < 3 ? 0xFFFFFFFF : arguments[2],
    finalXORValue = arguments.length < 4 ? 0xFFFFFFFF : arguments[3],
    crc = initialValue,
    table = [], i, j, c;

  function reverse(x, n) {
    var b = 0;
    while (n) {
      b = b * 2 + x % 2;
      x /= 2;
      x -= x % 1;
      n--;
    }
    return b;
  }

  for (i = 255; i >= 0; i--) {
    c = reverse(i, 32);

    for (j = 0; j < 8; j++) {
      c = ((c * 2) ^ (((c >>> 31) % 2) * polynomial)) >>> 0;
    }

    table[i] = reverse(c, 32);
  }

  for (i = 0; i < s.length; i++) {
    c = s.charCodeAt(i);
    if (c > 255) {
      throw new RangeError();
    }
    j = (crc % 256) ^ c;
    crc = ((crc / 256) ^ table[j]) >>> 0;
  }

  return (crc ^ finalXORValue) >>> 0;
}