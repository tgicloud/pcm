/**
 * pcm
 * check-in
 */

// -------------------------------------------------------------------------------------------------------------------
// check In Panel Loader
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.checkInPanel = function () {

  var self = this;

  document.getElementById("matchBtn1").className = "btn btn-default btn-lg";
  document.getElementById("matchBtn5").className = "btn btn-default btn-lg";
  document.getElementById("matchBtn10").className = "btn btn-default btn-lg";
  document.getElementById("matchBtn20").className = "btn btn-default btn-lg";
  document.getElementById("matchBtn50").className = "btn btn-default btn-lg";
  document.getElementById("matchBtn100").className = "btn btn-default btn-lg";

  // For storing previous visitsList
  pcm.gotVisits = false;
  pcm.visitsList = null;

  // Clear picture
  var canvas = document.querySelector("#checkInPicture");
  var context = canvas.getContext('2d');
  context.fillStyle = "#DDDDDD";
  context.fillRect(0, 0, 320, 240);

  // Clear Name & Address
  document.getElementById("txtCheckInNameInfo").innerHTML = "";
  document.getElementById("picTitle").innerHTML = "Scan Player Card to Check In";
  $("#picSnapBtn").hide();

  TakePhoto({isCard: true}, function () {
    // find the member
    var searchMember = new Member();
    var searchMemberList = new List(searchMember);
    pcm.hostStore.getList(searchMemberList, {qrCode: pcm.qrCode}, function (memberList, error) {
      if (error) {
        command('home');
        alertDanger('Error in getList(searchMemberList: ' + error);
      } else {
        if (memberList.length() > 0) {
          memberList.firstItem();
          pcm.checkInList = memberList;

          // Update picture
          var canvas = document.querySelector("#checkInPicture");
          var context = canvas.getContext('2d');
          context.fillRect(0, 0, 320, 240);
          var img = new Image;
          img.onload = function () {
            context.drawImage(img, 0, 0);
          };
          img.src = memberList.get('photo');

          // Name & Info
          var name = memberList.get('name');
          pcm.checkInName = name;
          var address = memberList.get('address');
          var city = memberList.get('city');
          var state = memberList.get('state');
          var zip = memberList.get('zip');
          var phone = memberList.get('phone');
          var html = name ? "<strong>" + name + "</strong>" : "<strong>No Name</strong>";
          if (address) html += "<br>" + address;
          if (city || state || zip) html += city + ', ' + state + zip;
          if (phone) html += "<br>Phone: " + phone;
          document.getElementById("txtCheckInNameInfo").innerHTML = html;

          // Now get visitsList
          html = "";
          var searchVisits = new Visits();
          var searchVisitsList = new List(searchVisits);
          pcm.hostStore.getList(searchVisitsList, {MemberID: memberList.get('id')}, {visitDate: -1}, function (visitsList, error) {
            if (error) {
              command('home');
              alertDanger('Error in getList(searchVisitsList: ' + error);
            } else {
              pcm.gotVisits = true;
              pcm.previousTime = null;
              pcm.visitsList = visitsList;
//              html += '<br>' + JSON.stringify(pcm.visitsList);
              if (pcm.visitsList.length() > 0) {
                pcm.visitsList.firstItem();
                pcm.previousTime = pcm.visitsList.get('visitDate');

                var match = "btn btn-info btn-lg";
                if (pcm.visitsList.get('MatchGiven'))
                  match = "btn btn-success btn-lg";

                var MatchAmount = pcm.visitsList.get('MatchAmount');

                switch (MatchAmount) {
                  case 1:
                    document.getElementById("matchBtn1").className = match;
                    break;
                  case 5:
                    document.getElementById("matchBtn5").className = match;
                    break;
                  case 10:
                    document.getElementById("matchBtn10").className = match;
                    break;
                  case 20:
                    document.getElementById("matchBtn20").className = match;
                    break;
                  case 50:
                    document.getElementById("matchBtn50").className = match;
                    break;
                  case 100:
                    document.getElementById("matchBtn100").className = match;
                    break;
                }
                html += '<strong>Last Visit:</strong> ' + moment(pcm.previousTime).format('LLLL') + '<br>';
              }
//              html += '<br>';
              document.getElementById("txtCheckInNameShiz").innerHTML = html;
            }
          });
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

  if (!pcm.gotVisits) {
    alertDanger('Waiting for server, try again...');
    return;
  }

  if (pcm.previousTime) {
    var now = moment();
    var next = moment(pcm.previousTime).add('hours', 24);
    var diff = next.diff(now, 'minutes');
    var html = document.getElementById("txtCheckInName").innerHTML;
    html += '<br>next: ' + next.format('LLLL');
    html += '<br>now:  ' + now.format('LLLL');
    html += '<br>diff: ' + diff;
    document.getElementById("txtCheckInName").innerHTML = html;

    if (diff > 0) {
      alertDanger('Already checked in.  Next at: ' + next.format('LLLL'));
      return;
    }
  }

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

// -------------------------------------------------------------------------------------------------------------------
// Check In Match
// -------------------------------------------------------------------------------------------------------------------
function CheckInMatch(amt) {
  OKCancel('<h4>Name: <strong>' + pcm.checkInName + '</strong><br><br>Match: <strong>' + '$' + amt + '</strong></h4', function () {
    if (!pcm.gotVisits) {
      alertDanger('Waiting for server, try again...');
      return;
    }
    if (pcm.previousTime) {
      var now = moment();
      var next = moment(pcm.previousTime).add('hours', 24);
      var diff = next.diff(now, 'minutes');
//      var html = document.getElementById("txtCheckInNameShiz").innerHTML;
//      html += '<br>next: ' + next.format('LLLL');
//      html += '<br>now:  ' + now.format('LLLL');
//      html += '<br>diff: ' + diff;
//      document.getElementById("txtCheckInNameShiz").innerHTML = html;
      if (diff > 0) {
        alertDanger('Already checked in.  Next at: ' + next.format('LLLL'));
        return;
      }
    }
    var name = pcm.checkInList.get('name');
    var memberID = pcm.checkInList.get('id');
    var visit = new Visits();
    visit.set('visitDate', new Date());
    visit.set('MemberID', memberID);
    visit.set('MatchAmount',amt);
    visit.set('MatchGiven',false);
    pcm.hostStore.putModel(visit, function (model, error) {
      if (typeof error != 'undefined') {
        alertDanger('Error: ' + error);
        return;
      }
      command('home');
      alertSuccess(name + ' checked in for $' + amt + ' match.');
    });

//    // Update match amount in visit
//    var visit = new Visits();
//    visit.set('id', pcm.visitsList.get('id'));
//    pcm.hostStore.getModel(visit, function (model, error) {
//      if (typeof error != 'undefined') {
//        alertDanger('Error: ' + error);
//        return;
//      }
//      var matchAmount = model.get('MatchAmount');
//      if (matchAmount && matchAmount > 0) {
//        alertDanger('Match already given!');
//        return;
//      } else {
//        model.set('MatchAmount',amt);
//        pcm.hostStore.putModel(visit, function (model, error){
//          if (typeof error != 'undefined') {
//            alertDanger('getModel Error: ' + error);
//            return;
//          }
//        });
//        command('home');
//        alertSuccess('$' + amt + ' match given to ' + pcm.matchName);
//      }
//    });


  });
}