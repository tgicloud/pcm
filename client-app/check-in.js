/**
 * pcm
 * check-in
 */

// -------------------------------------------------------------------------------------------------------------------
// check In Panel Loader
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.checkInPanel = function () {

  // Clear picture
  var canvas = document.querySelector("#matchPlayPicture");
  var context = canvas.getContext('2d');
  context.fillStyle = "#DDDDDD";
  context.fillRect(0, 0, 320, 240);

  // Clear Name & Address
  document.getElementById("txtCheckInName").innerHTML = "";

  document.getElementById("picTitle").innerHTML = "Scan Player Card to Check In";
  $("#picSnapBtn").hide();
  TakePhoto({isCard: true}, function () {
    // find the member
    var searchMember = new Member();
    var searchList = new List(searchMember);
    var searchingFor = {qrCode: pcm.qrCode};
    pcm.hostStore.getList(searchList, {qrCode: pcm.qrCode}, function (list, error) {
      if (error) {
        command('home');
        alertDanger('Error in getList: ' + error);
      } else {
        if (list.length() > 0) {
          list.firstItem();
          pcm.checkInList = list;

          // Update picture
          var canvas = document.querySelector("#matchPlayPicture");
          var context = canvas.getContext('2d');
          context.fillRect(0, 0, 320, 240);
          var img = new Image;
          img.onload = function () {
            context.drawImage(img, 0, 0);
          };
          img.src = list.get('photo');

          // Name & Address
          var name = list.get('name');
          var address = list.get('address');
          var city = list.get('city');
          var state = list.get('state');
          var zip = list.get('zip');
          var phone = list.get('phone');
          var html = "";
          if (name) {
            html = "<strong>" + name + "</strong>";
          } else {
            html = "<strong>No Name</strong>";
          }
          if (address) {
            html += "<br>" + address;
          }
          if (city || state || zip) {
            html += "<br>" + city + ', ' + state + zip;
          }
          if (phone) {
            html += "<br>Phone: " + phone;
          }
          document.getElementById("txtCheckInName").innerHTML = html

        } else {
          command('home');
          alertDanger('Card is not active');
        }
      }
    });
  });
};

// -------------------------------------------------------------------------------------------------------------------
// Cancel Check In
// -------------------------------------------------------------------------------------------------------------------
function CheckInCancel() {
  command('home');
}

// -------------------------------------------------------------------------------------------------------------------
// Check In
// -------------------------------------------------------------------------------------------------------------------
function CheckInSubmit() {
  var name = pcm.checkInList.get('name');
  var memberID = pcm.checkInList.get('id');

  var visit = new Visits();
  visit.set('visitDate', new Date());
  visit.set('MemberID', memberID);

  pcm.hostStore.putModel(visit, function (model, error) {
    if (typeof error != 'undefined') {
      alertDanger('Error: ' + error);
      return;
    }
    command('home');
    alertSuccess(name + ' checked in.');
  });

}
