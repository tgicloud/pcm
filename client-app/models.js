/**
 * pcm
 * models
 */

// Login
var Login = function (args) {
  Model.call(this, args);
  this.modelType = "Login";
  this.attributes.push(new Attribute('name'));
  this.attributes.push(new Attribute('password'));
};
Login.prototype = T.inheritPrototype(Model.prototype);

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
