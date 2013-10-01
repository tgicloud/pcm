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
      command('home');secur
      alertDanger('Error in getList: ' + error);
    } else {
      if (loginList.length() > 0) {

        // shitty code
        for (var l=0; l<loginList._items.length; l++) {
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



  // Get the group list
  pcm.hostStore.getList(new List(new Group()), {}, function (groupList, error) {
    if (error) {
      command('home');
      alertDanger('Error in getList: ' + error);
    } else {
      if (groupList.length() > 0) {
        var html = '';
        for (var l=0; l<groupList._items.length; l++) {
          groupList.indexedItem(l);
          var idHtml = groupList.get('id');
          if (typeof idHtml == 'string')
            idHtml = "'" + idHtml + "'";
          if (id == idHtml)
            html += '<option selected>'+groupList.get('name')+'</option>';
          else
            html += '<option>'+groupList.get('name')+'</option>';
        }
        document.getElementById("loginGroup").innerHTML = html;
      } else {
        document.getElementById("loginGroup").innerHTML = '';
      }
      $('#userListModal').modal('show');
    }

  });
}
