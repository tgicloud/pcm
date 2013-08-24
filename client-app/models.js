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