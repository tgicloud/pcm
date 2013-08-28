/**
 * pcm
 * gui-functions
 */

// -------------------------------------------------------------------------------------------------------------------
// Switch to Panel
// -------------------------------------------------------------------------------------------------------------------
function switchToPanel(panel, showHideNav) {

  // If showHideNav parameter used
  if (undefined != showHideNav) {
    if (showHideNav)
      $('#navbar').show();
    else
      $('#navbar').hide();
  }

  var newPanel = $('#' + panel);
  if (newPanel.length) {
    $('#alertDangerDiv').hide();
    $('#' + pcm.lastPanelShown).hide();
    pcm.lastPanelShown = panel;
    $(newPanel).show();
    $('html,body').scrollTop(0);
  } else {
    alertDanger('Cannot find ' + panel + '.')
  }

}

// -------------------------------------------------------------------------------------------------------------------
// Display alert box on top
// -------------------------------------------------------------------------------------------------------------------
function alertDanger(text) {
  $('#alertDangerDiv').show();
  $('#alertDangerText').html(text);
}

// -------------------------------------------------------------------------------------------------------------------
// Execute commands
// -------------------------------------------------------------------------------------------------------------------
function command(cmd) {
  switchToPanel(cmd + "Panel", true);
}


//  $('#' + pcm.lastPanelShown).show();
//  $('#navbar').show();
//  alertDanger('BULLSHIT');
//  $('body').animate({ backgroundColor: "white" }, "slow");
// Remove loading screen
//  $('#' + pcm.lastPanelShown).hide();
//  $('body').css('background-color', 'white');
//  $('body').animate("{background-color:white}");
//  $("body").animate({ backgroundColor: "#000000" }, 10000);

