/**
 * pcm
 * member-form
 */

// -------------------------------------------------------------------------------------------------------------------
// Submit Form
// -------------------------------------------------------------------------------------------------------------------
function memberSubmit() {


  // Name is required
  var nameText = document.getElementById("txtName").value.trim();
  var nameGroup = $("#txtNameGroup");
  var nameHelp = $("#txtNameHelp");
  var name = $("#txtName");
  if (nameText.length) {
    nameGroup.removeClass("has-error");
    nameHelp.hide();
  } else {
    nameGroup.addClass("has-error");
    name.focus();
    nameHelp.show();
  }
}
