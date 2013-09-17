/**
 * pcm
 * match-play
 */

// -------------------------------------------------------------------------------------------------------------------
// match Play Panel Loader
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.matchPlayPanel = function () {

  var self = this;

  // Clear picture
  var canvas = document.querySelector("#matchPlayPicture");
  var context = canvas.getContext('2d');
  context.fillStyle = "#DDDDDD";
  context.fillRect(0, 0, 320, 240);

  // Clear Name & Address
  document.getElementById("txtMatchPlayName").innerHTML = "";
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
          pcm.matchPlayList = memberList;

          // Update picture
          var canvas = document.querySelector("#matchPlayPicture");
          var context = canvas.getContext('2d');
          context.fillRect(0, 0, 320, 240);
          var img = new Image;
          img.onload = function () {
            context.drawImage(img, 0, 0);
          };
          img.src = memberList.get('photo');

          // Name & Address
          var name = memberList.get('name');
          pcm.matchName = name;
          var html = "";
          if (name) {
            html = "<strong>" + name + "</strong>";
          } else {
            html = "<strong>No Name</strong>";
          }
          document.getElementById("txtMatchPlayName").innerHTML = html;

          // Now get visitsList
          var searchVisits = new Visits();
          var searchVisitsList = new List(searchVisits);
          pcm.hostStore.getList(searchVisitsList, {MemberID: memberList.get('id')}, {visitDate: -1}, function (visitsList, error) {
            var html = "";
            if (error) {
              command('home');
              alertDanger('Error in getList(searchVisitsList: ' + error);
            } else {
              pcm.gotVisits = true;
              pcm.previousTime = null;
              pcm.visitsList = visitsList;
              // self.txtMatchPlayNameHTML += '<br>' + JSON.stringify(pcm.visitsList);
              if (pcm.visitsList.length() > 0) {
                pcm.visitsList.firstItem();
                pcm.previousTime = pcm.visitsList.get('visitDate');
                pcm.previousMatch = pcm.visitsList.get('MatchAmount');
                html += '<strong>Checked In:</strong> ' + moment(pcm.previousTime).format('LLLL');
                if (pcm.previousMatch && pcm.previousMatch>0) {
                  html += '<br><br><strong>Match Given:</strong> $' + pcm.previousMatch;
                }
                $('#txtMatchPlayDollarGroup').show();
              } else {
                html += '<strong>Not checked in!</strong>';
                $('#txtMatchPlayDollarGroup').hide();
              }
              document.getElementById("txtMatchPlayVisit").innerHTML = html;
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
// Match Amount
// -------------------------------------------------------------------------------------------------------------------
function MatchAmount(amt) {
  OKCancel('<h4>Name: <strong>' + pcm.matchName + '</strong><br><br>Match: <strong>' + '$' + amt + '</strong></h4', function () {
    // Update match amount in visit
    var visit = new Visits();
    visit.set('id', pcm.visitsList.get('id'));
    pcm.hostStore.getModel(visit, function (model, error) {
      if (typeof error != 'undefined') {
        alertDanger('Error: ' + error);
        return;
      }
      var matchAmount = model.get('MatchAmount');
      if (matchAmount && matchAmount > 0) {
        alertDanger('Match already given!');
        return;
      } else {
        model.set('MatchAmount',amt);
        pcm.hostStore.putModel(visit, function (model, error){
          if (typeof error != 'undefined') {
            alertDanger('getModel Error: ' + error);
            return;
          }
        });
        command('home');
        alertSuccess('$' + amt + ' match given to ' + pcm.matchName);
      }
    });
  });
}

// -------------------------------------------------------------------------------------------------------------------
// Cancel Check In
// -------------------------------------------------------------------------------------------------------------------
function MatchPlayCancel() {
  command('home');
}