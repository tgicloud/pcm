/**
 * pcm
 * member-form
 */

// -------------------------------------------------------------------------------------------------------------------
// user List Panel
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.newMemberPanel = function () {
  // Rest any form data
  clearNewMemberForm();
};

// -------------------------------------------------------------------------------------------------------------------
// Submit Form
// -------------------------------------------------------------------------------------------------------------------
function memberSubmit(forceSubmit) {

  var gotErrors = false;

  // Name is required
  var nameText = document.getElementById("txtName").value.trim();
  var nameGroup = $("#txtNameGroup");
  var nameHelp = $("#txtNameHelp");
  var name = $("#txtName");
  if (nameText.length) {
    nameGroup.removeClass("has-error");
    nameHelp.hide();
  } else {
    gotErrors = true;
    nameGroup.addClass("has-error");
    name.focus();
    nameHelp.show();
  }

  // Card is required
  if (!forceSubmit && !pcm.gotCard) {
    gotErrors = true;
    $("#txtCardGroup").addClass("has-error");
    $("#txtCardHelp").show();
  } else {
    $("#txtCardGroup").removeClass("has-error");
    $("#txtCardHelp").hide();
  }

  // Photo is required
  if (!forceSubmit && !pcm.gotPhoto) {
    $("#txtPhotoGroup").addClass("has-error");
    $("#txtPhotoGroupHelp").show();
    if (!gotErrors && pcm.userGroupModel.get('canAddWithoutPhoto')) {
      OKCancel('Are you SURE you want to add without Photo?', function () {
        memberSubmit(true);
      });
      return;
    }
    gotErrors = true;
  } else {
    $("#txtPhotoGroup").removeClass("has-error");
    $("#txtPhotoGroupHelp").hide();
  }

  // Any errors leave
  if (gotErrors) return;

  // No errors save
  // Add to store for now
  var memberModel = new Member();
  if (pcm.memberViewID)
    memberModel.set('id', pcm.memberViewID);
  memberModel.set('name', document.getElementById("txtName").value);
  memberModel.set('address', document.getElementById("txtAddress").value);
  memberModel.set('city', document.getElementById("txtCity").value);
  memberModel.set('state', document.getElementById("txtState").value);
  memberModel.set('zip', document.getElementById("txtZip").value);
  memberModel.set('phone', document.getElementById("txtPhone").value);
  memberModel.set('DOB', document.getElementById("txtDOB").value);
  memberModel.set('email', document.getElementById("txtEmail").value);
  memberModel.set('maxMatch', document.getElementById("txtMaxMatch").value);
  memberModel.set('dateAdded', new Date());
  memberModel.set('qrCode', pcm.qrCode);
  memberModel.set('photo', pcm.dataURL);

  pcm.hostStore.putModel(memberModel, function (model, error) {
    if (typeof error != 'undefined') {
      alertDanger('Error: ' + error);
      return;
    }
    clearNewMemberForm();
    pcm.newMemberID = memberModel.get('id');
    console.log('id ' + pcm.newMemberID);
    command('home');
  });

}

// -------------------------------------------------------------------------------------------------------------------
// Take Photo Submit
// -------------------------------------------------------------------------------------------------------------------
function TakePhoto_Submit(args) {
  args = args || {};
  if (args.isCard) {
    document.getElementById("picTitle").innerHTML = "Scan New Player Card";
    $("#picSnapBtn").hide();
    TakePhoto(args, function () {
      // find the member
      var searchMember = new Member();
      var searchList = new List(searchMember);
      pcm.hostStore.getList(searchList, {qrCode: pcm.qrCode}, function (list, error) {
        if (error) {
          command('home');
          alertDanger('Error in getList: ' + error);
        } else {
          if (list.length() > 0) {
            alertDanger('That card is already in use!');
          } else {
            alertDanger();
            pcm.gotCard = true;
            $("#txtCardGroup").removeClass("has-error");
            $("#txtCardHelp").hide();
            document.getElementById("newMemberCardBtn").setAttribute("class", "btn btn-block btn-success");
            document.getElementById("newMemberCardBtn").innerHTML =
              '<span class="glyphicon glyphicon-qrcode"></span> Rescan NEW Card';
            $("#newMemberPhoto").show();
          }
        }
      });
    });
  } else {
    document.getElementById("picTitle").innerHTML = "Taking Member Photo";
    $("#picSnapBtn").show();
    TakePhoto(args, function () {
      pcm.gotPhoto = true;
      $("#txtPhotoGroup").removeClass("has-error");
      $("#txtPhotoGroupHelp").hide();
      document.getElementById("newMemberPhotoBtn").setAttribute("class", "btn btn-block btn-success");
      document.getElementById("newMemberPhotoBtn").innerHTML = '<span class="glyphicon glyphicon-picture"></span> Retake Photo';
      $("#newMemberPhoto").show();
      var video = document.querySelector("#videoElement");
      var canvas = document.querySelector("#newMemberPhoto");
      var context = canvas.getContext('2d');
      context.fillRect(0, 0, 320, 240);
      context.drawImage(video, 0, 0, 320, 240);
      pcm.dataURL = canvas.toDataURL();
    });
  }
}

// -------------------------------------------------------------------------------------------------------------------
// Cancel Form
// -------------------------------------------------------------------------------------------------------------------
function memberCancel() {
  OKCancel('Are you want to cancel this new member?', function () {
    clearNewMemberForm();
    command('home');
  })
}

// -------------------------------------------------------------------------------------------------------------------
// Clear Form
// -------------------------------------------------------------------------------------------------------------------
function clearNewMemberForm() {
  pcm.memberViewID = null;
  pcm.gotPhoto = false;
  pcm.gotCard = false;
  document.getElementById("newMemberPhotoBtn").setAttribute("class", "btn btn-block btn-warning");
  document.getElementById("newMemberPhotoBtn").innerHTML = "Take Photo";
  document.getElementById("newMemberCardBtn").setAttribute("class", "btn btn-block btn-warning");
  document.getElementById("newMemberCardBtn").innerHTML = "Scan New Card";
  $("#txtPhotoGroup").removeClass("has-error");
  $("#txtPhotoGroupHelp").hide();
  $("#txtCardGroup").removeClass("has-error");
  $("#txtCardHelp").hide();
  $("#txtNameGroup").removeClass("has-error");
  $("#txtNameHelp").hide();
  $("#newMemberPhoto").hide();
  document.getElementById("txtName").value = "";
  document.getElementById("txtAddress").value = "";
  document.getElementById("txtCity").value = "";
  document.getElementById("txtState").value = "";
  document.getElementById("txtZip").value = "";
  document.getElementById("txtPhone").value = "";
  document.getElementById("txtDOB").value = "";
  document.getElementById("txtEmail").value = "";
  document.getElementById("txtMaxMatch").value = "";

  if (pcm.userGroupModel.get('canSetMatch'))
    $("#memberMatchDiv").show();
  else
    $("#memberMatchDiv").hide();
}
