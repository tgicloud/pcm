/**
 * pcm
 * client-app/client-app.js
 */

var pcm = {};
pcm.lastPanelShown = "loadingPanel";
pcm.userID = null;

// -------------------------------------------------------------------------------------------------------------------
// Entry point when document ready
// -------------------------------------------------------------------------------------------------------------------
$(document).ready(function () {
  loadStore();
});

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
    command('home');
  });
}

