/**
 * pcm
 * group-list
 */

// -------------------------------------------------------------------------------------------------------------------
// group List Panel
// -------------------------------------------------------------------------------------------------------------------
pcm.panelLoaders.groupListPanel = function () {
  // set loading message
  var groupListDiv = document.getElementById("groupList");
  groupListDiv.innerHTML = pcm.loadingHTML;

  // Get the groups
  pcm.hostStore.getList(new List(new Group()), {}, {name: 1}, function (groupList, error) {
    var html = '';
    if (error) {
      command('home');
      alertDanger('Error in getList: ' + error);
    } else {
      if (groupList.length() > 0) {

        // shitty code
        for (var l = 0; l < groupList._items.length; l++) {
          groupList.indexedItem(l);
          var idHtml = groupList.get('id');
          if (typeof idHtml == 'string')
            idHtml = "'" + idHtml + "'";
          html += '<button type="button" style="text-align: left" onclick="presentGroup(' +
            idHtml +
            ')" class="btn btn-default btn-block">&nbsp;&nbsp;<span class="glyphicon glyphicon-edit"></span> ' +
            groupList.get('name') +
            '</button>';
        }
      }
      html += '<button type="button" style="text-align: left" onclick="presentGroup()" class="btn btn-success btn-block">&nbsp;&nbsp;<span class="glyphicon glyphicon-plus-sign"></span> Add new groups</button>';
      groupListDiv.innerHTML = html;
    }
  });
};

// -------------------------------------------------------------------------------------------------------------------
// Present Group
// -------------------------------------------------------------------------------------------------------------------
function presentGroup(id) {

  // Remember this when saving
  pcm.presentedGroupID = id;

  // Clear all form elements
  var groupNameElement = document.getElementById("groupName");
  var cellAccessElement = document.getElementById("cellAccess");
  var wsAccessElement = document.getElementById("wsAccess");
  var canAddWithoutPhotoElement = document.getElementById("canAddWithoutPhoto");
  var canAddMemberElement = document.getElementById("canAddMember");
  var canSetMatchElement = document.getElementById("canSetMatch");
  var canSearchMemberElement = document.getElementById("canSearchMember");
  var canCheckInElement = document.getElementById("canCheckIn");
  var canMatchPlayElement = document.getElementById("canMatchPlay");
  groupNameElement.value = '';
  cellAccessElement.checked = false;
  wsAccessElement.checked = false;
  canAddWithoutPhotoElement.checked = false;
  canAddMemberElement.checked = false;
  canSetMatchElement.checked = false;
  canSearchMemberElement.checked = false;
  canCheckInElement.checked = false;
  canMatchPlayElement.checked = false;

  // Get the group model
  var group = new Group();
  if (id) {
    group.set('id', id);
    pcm.hostStore.getModel(group, function (model, error) {
      if (typeof error != 'undefined') {
        command('home');
        alertDanger('Error in getList: ' + error);
        return;
      }
      groupNameElement.value = model.get('name');
      cellAccessElement.checked = model.get('cellAccess');
      wsAccessElement.checked = model.get('wsAccess');
      canAddWithoutPhotoElement.checked = model.get('canAddWithoutPhoto');
      canAddMemberElement.checked = model.get('canAddMember');
      canSetMatchElement.checked = model.get('canSetMatch');
      canSearchMemberElement.checked = model.get('canSearchMember');
      canCheckInElement.checked = model.get('canCheckIn');
      canMatchPlayElement.checked = model.get('canMatchPlay');

      pcm.presentedGroupName = groupNameElement.value;
      
      $('#groupListModal').modal('show');
    });
  } else {
    pcm.presentedGroupName = '(new group)';
    $('#groupListModal').modal('show');
  }
}

// -------------------------------------------------------------------------------------------------------------------
// Submit Form
// -------------------------------------------------------------------------------------------------------------------
function groupSubmit() {

  var gotErrors = false;

  // Name is required
  var nameText = document.getElementById("groupName").value.trim();
  var nameGroup = $("#groupGroup");
  var nameHelp = $("#groupNameHelp");
  var name = $("#groupName");
  if (nameText.length) {
    nameGroup.removeClass("has-error");
    nameHelp.hide();
  } else {
    gotErrors = true;
    nameGroup.addClass("has-error");
    name.focus();
    nameHelp.show();
  }

  // Any errors leave
  if (gotErrors) return;

  // No errors save
  // Add to store for now
  var groupModel = new Group();
  if (pcm.presentedGroupID) groupModel.set('id', pcm.presentedGroupID);
  groupModel.set('name', document.getElementById("groupName").value);
  groupModel.set('cellAccess', document.getElementById("cellAccess").checked);
  groupModel.set('wsAccess', document.getElementById("wsAccess").checked);
  groupModel.set('canAddWithoutPhoto', document.getElementById("canAddWithoutPhoto").checked);
  groupModel.set('canAddMember', document.getElementById("canAddMember").checked);
  groupModel.set('canSetMatch', document.getElementById("canSetMatch").checked);
  groupModel.set('canSearchMember', document.getElementById("canSearchMember").checked);
  groupModel.set('canCheckIn', document.getElementById("canCheckIn").checked);
  groupModel.set('canMatchPlay', document.getElementById("canMatchPlay").checked);
  pcm.hostStore.putModel(groupModel, function (model, error) {
    if (typeof error != 'undefined') {
      alertDanger('Error: ' + error);
      return;
    }
    $('#groupListModal').modal('hide');
    command('groupList');
    alertSuccess('changes saved');
  });
}

// -------------------------------------------------------------------------------------------------------------------
// Group Delete
// -------------------------------------------------------------------------------------------------------------------
function groupDelete() {
  $('#groupListModal').modal('hide');
  OKCancel('Are you SURE you want to delete this group (' + pcm.presentedGroupName + ')?', function () {
    var groupModel = new Group();
    if (pcm.presentedGroupID) {
      groupModel.set('id', pcm.presentedGroupID);
      pcm.hostStore.deleteModel(groupModel, function (model, error) {
        if (typeof error != 'undefined') {
          alertDanger('Error: ' + error);
          return;
        }
        $('#groupListModal').modal('hide');
        command('groupList');
        alertSuccess('group deleted');
      });
    }
  })
}
