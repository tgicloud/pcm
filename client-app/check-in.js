/**
 * pcm
 * check-in
 */

// -------------------------------------------------------------------------------------------------------------------
// check In Panel Loader
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.checkInPanel = function () {

  document.getElementById("picTitle").innerHTML = "Scan Player Card to Check In";
  $("#picSnapBtn").hide();
  TakePhoto({isCard: true}, function () {

    // find the member
    var searchMember = new Member();
    var searchList = new List(searchMember);
    pcm.hostStore.getList(searchList, {qrCode: pcm.qrCode}, function (list, error) {
      if (error) {
        command('home');
        alertDanger('Error in getList: ' + error);
      } else {
        alertDanger('Danger Danger Will Robinson is in Danger!');
      }
    });

  });


};