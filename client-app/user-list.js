/**
 * pcm
 * user-list
 */

// -------------------------------------------------------------------------------------------------------------------
// user List Panel
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.userListPanel = function () {
  // set loading message
  var userListDiv = document.getElementById("userList");
  userListDiv.innerHTML = pcm.loadingHTML;

  // Get the users
  pcm.hostStore.getList(new List(new Login()), {}, function (loginList, error) {
    var html = '';
    if (error) {
      command('home');
      secur
      alertDanger('Error in getList: ' + error);
    } else {
      if (loginList.length() > 0) {

        // shitty code
        for (var l = 0; l < loginList._items.length; l++) {
          loginList.indexedItem(l);
          var idHtml = loginList.get('id');
          if (typeof idHtml == 'string')
            idHtml = "'" + idHtml + "'"
          html += '<button type="button" style="text-align: left" onclick="presentUser(' +
            idHtml +
            ')" class="btn btn-block">&nbsp;&nbsp;<span class="glyphicon glyphicon-edit"></span> ' +
            loginList.get('name') +
            '</button>';
        }
      }
      html += '<button type="button" style="text-align: left" onclick="presentUser()" class="btn btn-success btn-block">&nbsp;&nbsp;<span class="glyphicon glyphicon-plus-sign"></span> Add new users</button>';
      userListDiv.innerHTML = html;
    }
  });
};

// -------------------------------------------------------------------------------------------------------------------
// Present User
// -------------------------------------------------------------------------------------------------------------------
function presentUser(id) {

  // Remember this when saving
  pcm.presentedUserID = id;

  // Clear all form elements
  var loginNameElement = document.getElementById("loginName");
  var loginPasswordElement = document.getElementById("loginPassword");
  var loginGroupElement = document.getElementById("loginGroup");
  loginNameElement.value = '';
  loginPasswordElement.value = '';
  loginGroupElement.innerHTML = '';

  // Get the user
  var login = new Login();
  if (id) {
    login.set('id', id);
    pcm.hostStore.getModel(login, function (model, error) {
      if (typeof error != 'undefined') {
        command('home');
        alertDanger('Error in getList: ' + error);
        return;
      }

      loginNameElement.value = login.get('name');
      loginPasswordElement.value = login.get('password');
      loginGroupElement.innerHTML = '';
      pcm.presentedUserName = loginNameElement.value;
      getGroup(login.get('GroupID'));

    });
  } else {
    pcm.presentedUserName = '(new group)';
    getGroup();
  }

  function getGroup(groupID) {
    // Get the group list
    pcm.hostStore.getList(new List(new Group()), {}, function (groupList, error) {
      if (error) {
        command('home');
        alertDanger('Error in getList: ' + error);
      } else {
        if (groupList.length() > 0) {
          var html = '';
          for (var l = 0; l < groupList._items.length; l++) {
            groupList.indexedItem(l);
            var idHtml = groupList.get('id');
//            if (typeof idHtml == 'string')
//              idHtml = "'" + idHtml + "'";

            var prefix = '<option value="' + groupList.get('id') + '"';
            console.log('compare groupID = ' + groupID)
            console.log('compare idHtml = ' + idHtml)
            if (groupID && groupID == idHtml)
              html += prefix + ' selected>' + groupList.get('name') + '</option>';
            else
              html += prefix + '>' + groupList.get('name') + '</option>';
          }
          document.getElementById("loginGroup").innerHTML = html;
        } else {
          document.getElementById("loginGroup").innerHTML = '';
        }
        $('#userListModal').modal('show');
      }
    });
  }
}

// -------------------------------------------------------------------------------------------------------------------
// Submit Form
// -------------------------------------------------------------------------------------------------------------------
function userSubmit() {

  var gotErrors = false;

  // Name is required
  var nameText = document.getElementById("loginName").value.trim();
  var nameUser = $("#loginUser");
  var nameHelp = $("#loginNameHelp");
  var name = $("#loginName");
  if (nameText.length) {
    nameUser.removeClass("has-error");
    nameHelp.hide();
  } else {
    gotErrors = true;
    nameUser.addClass("has-error");
    name.focus();
    nameHelp.show();
  }

  // Any errors leave
  if (gotErrors) return;

  // No errors save
  // Add to store for now
  var loginModel = new Login();
  if (pcm.presentedUserID) loginModel.set('id', pcm.presentedUserID);
  loginModel.set('name', document.getElementById("loginName").value);
  loginModel.set('password', document.getElementById("loginPassword").value);
  loginModel.set('GroupID', document.getElementById("loginGroup").value);
  pcm.hostStore.putModel(loginModel, function (model, error) {
    if (typeof error != 'undefined') {
      alertDanger('Error: ' + error);
      return;
    }
    $('#userListModal').modal('hide');
    command('userList');
    alertSuccess('changes saved');
  });
}

// -------------------------------------------------------------------------------------------------------------------
// User Delete
// -------------------------------------------------------------------------------------------------------------------
function userDelete() {
  $('#userListModal').modal('hide');
  OKCancel('Are you SURE you want to delete this user (' + pcm.presentedUserName + ')?', function () {
    var loginModel = new Login();
    if (pcm.presentedUserID) {
      loginModel.set('id', pcm.presentedUserID);
      pcm.hostStore.deleteModel(loginModel, function (model, error) {
        if (typeof error != 'undefined') {
          alertDanger('Error: ' + error);
          return;
        }
        $('#userListModal').modal('hide');
        command('userList');
        alertSuccess('user deleted');
      });
    }
  })
}