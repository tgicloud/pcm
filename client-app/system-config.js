/**
 * pcm
 * system-config
 */

// -------------------------------------------------------------------------------------------------------------------
// System Config Panel
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.systemConfigPanel = function () {
  loadApp(function (error) {
    if (typeof error != 'undefined') {
      command('home');
      alertDanger('Error: ' + error);
      return;
    }
    document.getElementById("txtConfigMaxMatch").value = pcm.app.get('maxMatch');
  });
};

// -------------------------------------------------------------------------------------------------------------------
// Submit Form
// -------------------------------------------------------------------------------------------------------------------
function systemConfigSubmit() {
  pcm.app.set('maxMatch', document.getElementById("txtConfigMaxMatch").value);
  pcm.hostStore.putModel(pcm.app, function (model, error) {
    if (typeof error != 'undefined') {
      alertDanger('Error: ' + error);
      return;
    }
    command('home');
  });
}

// -------------------------------------------------------------------------------------------------------------------
// Cancel Form
// -------------------------------------------------------------------------------------------------------------------
function systemConfigCancel() {
  OKCancel('Are you want to cancel any changes?', function () {
    command('home');
  })
}