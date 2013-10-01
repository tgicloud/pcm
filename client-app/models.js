/**
 * pcm
 * models
 */
  
// SysApp
var SysApp = function (args) {
  Model.call(this, args);
  this.modelType = "SysApp";
  this.attributes.push(new Attribute('appID'));
  this.attributes.push(new Attribute('storeInitDate','Date'));
  this.attributes.push(new Attribute('maxMatch','Number'));
};
SysApp.prototype = T.inheritPrototype(Model.prototype);

// Login
var Login = function (args) {
  Model.call(this, args);
  this.modelType = "Login";
  this.attributes.push(new Attribute('name'));
  this.attributes.push(new Attribute('password'));
  this.attributes.push(new Attribute('GroupID','ID'));
};
Login.prototype = T.inheritPrototype(Model.prototype);

// Group
var Group = function (args) {
  Model.call(this, args);
  this.modelType = "Group";
  this.attributes.push(new Attribute('name'));
  this.attributes.push(new Attribute('cellAccess','Boolean'));
  this.attributes.push(new Attribute('wsAccess','Boolean'));
  this.attributes.push(new Attribute('canAddWithoutPhoto','Boolean'));
  this.attributes.push(new Attribute('canAddMember','Boolean'));
  this.attributes.push(new Attribute('canSetMatch','Boolean'));
  this.attributes.push(new Attribute('canSearchMember','Boolean'));
  this.attributes.push(new Attribute('canCheckIn','Boolean'));
  this.attributes.push(new Attribute('canMatchPlay','Boolean'));
};
Group.prototype = T.inheritPrototype(Model.prototype);

// Member
var Member = function (args) {
  Model.call(this, args);
  this.modelType = "Member";
  this.attributes.push(new Attribute('name'));
  this.attributes.push(new Attribute('address'));
  this.attributes.push(new Attribute('city'));
  this.attributes.push(new Attribute('state'));
  this.attributes.push(new Attribute('zip'));
  this.attributes.push(new Attribute('phone'));
  this.attributes.push(new Attribute('DOB','Date'));
  this.attributes.push(new Attribute('dateAdded','Date'));
  this.attributes.push(new Attribute('email'));
  this.attributes.push(new Attribute('maxMatch','Number'));
  this.attributes.push(new Attribute('qrCode'));
  this.attributes.push(new Attribute('photo'));
};
Member.prototype = T.inheritPrototype(Model.prototype);

// Visits
var Visits = function (args) {
  Model.call(this, args);
  this.modelType = "Visits";
  this.attributes.push(new Attribute('visitDate','Date'));
  this.attributes.push(new Attribute('MemberID','ID'));
  this.attributes.push(new Attribute('MatchAmount','Number'));
};
Visits.prototype = T.inheritPrototype(Model.prototype);
