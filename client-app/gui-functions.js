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
// OK / Cancel modal
// -------------------------------------------------------------------------------------------------------------------
function OKCancel(text, callback) {
  pcm.callbackOKCancel = callback;
  $('#modalBody').html(text);
  $('#myModal').modal('show');
}

function OKCancel_OK() {
  $('#myModal').modal('hide');
  pcm.callbackOKCancel();
}

// -------------------------------------------------------------------------------------------------------------------
// Execute commands
// -------------------------------------------------------------------------------------------------------------------
function command(cmd) {
  switchToPanel(cmd + "Panel", true);
}


// -------------------------------------------------------------------------------------------------------------------
// Take Photo
// -------------------------------------------------------------------------------------------------------------------
function TakePhoto(callback) {
  $("#picError").hide();
  pcm.callbackTakePhoto = callback;
  pcm.streamTakePhone = null;
  var video = document.querySelector("#videoElement");
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
  navigator.getUserMedia({video: true}, function (stream) {
    pcm.streamTakePhone = stream;
    video.src = window.URL.createObjectURL(stream);
  }, function (err) {
    alertDanger('cam error: ' + err.name);
    $('#myCamModal').modal('hide');
  });
  $('#myCamModal').modal('show');
}
function TakePhoto_Snap() {

  if (!pcm.streamTakePhone) {
    $("#picError").show();
    return;
  }

  $('#myCamModal').modal('hide');
  pcm.callbackTakePhoto();
  var video = document.querySelector("#videoElement");
  video.pause();
  video.src = "";
  pcm.streamTakePhone.stop();
}
