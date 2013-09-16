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
    $('#alertSuccessDiv').hide();
    $('#alertDangerDiv').hide();
    $('#' + pcm.lastPanelShown).hide();
    pcm.lastPanelShown = panel;
    $(newPanel).show();
    $('html,body').scrollTop(0);
    // if page loader defined
    if (pcm.panelLoaders[panel]) {
      pcm.panelLoaders[panel]();
    }
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
// Display alert box on top
// -------------------------------------------------------------------------------------------------------------------
function alertSuccess(text) {
  $('#alertSuccessDiv').show();
  $('#alertSuccessText').html(text);
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
function TakePhoto(args, callback) {
  args = args || {};

  // One time init
  if (!pcm.photoInit) {
    pcm.photoInit = true;
    $('#myCamModal').on('hidden.bs.modal', function () {
      if (pcm.qrcodeIntervalHandle) {
        window.clearInterval(pcm.qrcodeIntervalHandle);
        pcm.qrcodeIntervalHandle = undefined;
      }
    });
  }

  $("#picError").hide();
  pcm.callbackTakePhoto = callback;
  pcm.streamTakePhone = null;
  var video = document.querySelector("#videoElement");
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
  navigator.getUserMedia({video: true}, function (stream) {
    pcm.streamTakePhone = stream;
    video.src = window.URL.createObjectURL(stream);
    if (args.isCard) pcm.qrcodeIntervalHandle = setInterval(scanQRCodes, 333);
  }, function (err) {
    alertDanger('cam error: ' + err.name);
    $('#myCamModal').modal('hide');
  });
  $('#myCamModal').modal('show');
}

// -------------------------------------------------------------------------------------------------------------------
// Scan QRCodes
// -------------------------------------------------------------------------------------------------------------------
function scanQRCodes() {

  var video = document.querySelector("#videoElement");
  var canvas = document.querySelector("#qr-canvas");
  var context = canvas.getContext('2d');
  context.fillRect(0, 0, 320, 240);
  context.drawImage(video, 0, 0, 320, 240);
  var decodeString;
  try {
    decodeString = qrcode.decode();
  } catch (e) {
  }
  if (decodeString && IDCardValid(decodeString)) {
    console.log('scanQRCodes("' + decodeString + '")');
    pcm.qrCode = decodeString;
    window.clearInterval(pcm.qrcodeIntervalHandle);
    pcm.qrcodeIntervalHandle = undefined;
    $('#myCamModal').modal('hide');
    pcm.callbackTakePhoto();
    var video = document.querySelector("#videoElement");
    video.pause();
    video.src = "";
    pcm.streamTakePhone.stop();
  } else {
    if (decodeString)
      console.log('scanQRCodes("' + decodeString + '") INVALID!!! ');
    else
      console.log('scanQRCodes() ... waiting ');
  }
}

// -------------------------------------------------------------------------------------------------------------------
// Snap Button Pressed
// -------------------------------------------------------------------------------------------------------------------
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
