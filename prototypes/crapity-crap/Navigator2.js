/**
 * pcm
 * Navigator2.js
 */

var pcm = {};
pcm.lastPanelShown = "homePanel";
//pcm.lastActiveNav = "";
// navBtnMatchPlay class="active"
function command(cmd) {
//  if (pcm.lastActiveNav)
//    $('#' + pcm.lastActiveNav).removeClass('active');
//  $("#navCollapse").collapse('hide');
  $('#' + pcm.lastPanelShown).hide();
  pcm.lastPanelShown = cmd + "Panel";
//  pcm.lastActiveNav = cmd + "NavBtn";
//  $('#' + pcm.lastActiveNav).addClass('active');
  $('#' + pcm.lastPanelShown).show();
}
