/**
 * pcm
 * view-member
 */

// -------------------------------------------------------------------------------------------------------------------
// view Member Panel
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.viewMemberPanel = function () {
  document.getElementById("picTitle").innerHTML = "Scan Card to view Member";
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
          pcm.memberViewList = memberList;

          switchToPanel('newMemberPanel', true);

          $("#txtPhotoGroup").removeClass("has-error");
          $("#txtPhotoGroupHelp").hide();
          document.getElementById("newMemberPhotoBtn").setAttribute("class", "btn btn-block btn-success");
          document.getElementById("newMemberPhotoBtn").innerHTML = '<span class="glyphicon glyphicon-picture"></span> Retake Photo';
          $("#newMemberPhoto").show();

          document.getElementById("newMemberCardBtn").setAttribute("class", "btn btn-block btn-success");
          document.getElementById("newMemberCardBtn").innerHTML =
            '<span class="glyphicon glyphicon-qrcode"></span> Rescan NEW Card';


          // Update picture
          var canvas = document.querySelector("#newMemberPhoto");
          var context = canvas.getContext('2d');
          context.fillRect(0, 0, 320, 240);
          var img = new Image;
          img.onload = function () {
            context.drawImage(img, 0, 0);
          };
          img.src = memberList.get('photo');

          pcm.memberViewID = memberList.get('id');
          pcm.gotPhoto = true;
          pcm.gotCard = true;

          pcm.qrCode = memberList.get('qrCode');
          pcm.dataURL = memberList.get('photo');

          // Update Data
          document.getElementById("txtName").value = memberList.get('name');
          document.getElementById("txtAddress").value = memberList.get('address');
          document.getElementById("txtCity").value = memberList.get('city');
          document.getElementById("txtState").value = memberList.get('state');
          document.getElementById("txtZip").value = memberList.get('zip');
          document.getElementById("txtPhone").value = memberList.get('phone');
          document.getElementById("txtDOB").value = memberList.get('DOB');
          document.getElementById("txtEmail").value = memberList.get('email');
          document.getElementById("txtMaxMatch").value = memberList.get('maxMatch');

        } else {
          command('home');
          alertDanger('Card is not active');
        }
      }
    });
  });
};