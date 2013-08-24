/**
 * pcm
 * Navigator2.js
 */

var pcm = {};
pcm.lastPanelShown = "logInPanel";
pcm.loggedIn = false;

$(document).ready(function () {
  $('#' + pcm.lastPanelShown).show();


  // if not cell phone more padding below navbar
//  if (window.innerWidth>767) {
//    $('body').css({ paddingTop: '70px' });
//  }
//
//  $(window).resize(function() {
//    if (window.innerWidth>767) {
//      $('body').css({ paddingTop: '70px' });
//    } else {
//      $('body').css({ paddingTop: '50px' });
//    }
//  });

});

// Execute commands
function command(cmd) {
  $('#alertDangerDiv').hide();
  $('#' + pcm.lastPanelShown).hide();
  if (pcm.loggedIn) {
    pcm.lastPanelShown = cmd + "Panel";
  } else {
    alertDanger("YOU MUST LOGIN FIRST");
    pcm.lastPanelShown = "logInPanel";
  }
  $('#' + pcm.lastPanelShown).show();
  $('html,body').scrollTop(0);
}

function login() {
  pcm.loggedIn = true;
  command('home');
}

function alertDanger(text) {
  $('#alertDangerDiv').show();
  $('#alertDangerText').html(text);
}