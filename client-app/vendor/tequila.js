// FILE IS DESTROYED AND REBUILT IN MAKE
/**
 * tequila
 * tequila-class.js
 */

var Tequila = (function () {
  var singletonInstance;

  function init() {
    // Private methods and variables
    var version = '0.0.1';
    var attributeTypes = ['ID', 'String', 'Date', 'Boolean', 'Number', 'Model', 'Group', 'Table'];
    var messageTypes = ['Null', 'Connected', 'Error', 'Sent', 'Ping', 'PutModel', 'PutModelAck', 'GetModel', 'GetModelAck', 'DeleteModel', 'DeleteModelAck', 'GetList', 'GetListAck'];
    var messageHandlers = {};
    return    {
      // Public methods and variables
      getVersion: function () {
        return version;
      },
      isServer: function () {
        return typeof exports !== 'undefined' && this.exports !== exports
      },
      contains: function (a, obj) {
        for (var i = 0; i < a.length; i++) {
          if (a[i] === obj) return true;
        }
        return false;
      },
      getUnusedProperties: function (properties, allowedProperties) {
        var props = [];
        for (var property in properties) {
          if (properties.hasOwnProperty(property)) {
            if (!this.contains(allowedProperties, property)) {
              props.push(property);
            }
          }
        }
        return props;
      },
      getRegisteredStores: function () {
        return [];
      },
      inheritPrototype: function (p) {
        if (p == null) throw TypeError();
        if (Object.create) return Object.create(p);
        var t = typeof p;
        if (t !== "object" && typeof t !== "function") throw TypeError();
        function f() {
        };
        f.prototype = p;
        return new f();
      },
      getAttributeTypes: function () {
        return attributeTypes;
      },
      getMessageTypes: function () {
        return messageTypes;
      },
      setMessageHandler: function (message, handler) {
        messageHandlers[message] = handler;
      },
      hostMessageProcess: function (obj, fn) {
        if (messageHandlers[obj.type]) {
          messageHandlers[obj.type](obj.contents, fn);
        } else {
          console.log('socket.io ackmessage: ' + JSON.stringify(obj));
          fn(true); // todo should this be an error?
        }
      }

    };
  };
  return function () {
    if (!singletonInstance) singletonInstance = init();
    return singletonInstance;
  };
})();
// Library scoped ref to singleton
var T = Tequila();

/**
 * tequila
 * transport-class
 */
function Transport(location, callBack) {
  if (false === (this instanceof Transport)) throw new Error('new operator required');
  if (typeof location != 'string') throw new Error('argument must a url string');
  if (typeof callBack != 'function') throw new Error('argument must a callback');
  var self = this;
  self.connected = false;
  self.initialConnect = true;
  self.location = location;
  if (self.location == '') self.location = 'http host';
  self.socket = io.connect(location);
  self.socket.on('connect', function () {
    self.connected = true;
    self.initialConnect = false;
    console.log('socket.io (' + self.location + ') connected');
    callBack.call(self, new Message('Connected', ''));
  });
  self.socket.on('connecting', function () {
    console.log('socket.io (' + self.location + ') connecting');
  });
  self.socket.on('error', function (reason) {
    var theReason = reason;
    if (theReason.length < 1) theReason = "(unknown)";
    console.error('socket.io (' + self.location + ') error: ' + theReason + '.');
    // If have not ever connected then signal error
    if (self.initialConnect) {
      callBack.call(self, new Message('Error', 'cannot connect'));
    }
  });
  self.socket.on('connect_failed', function (reason) {
    var theReason = reason;
    if (theReason.length < 1) theReason = "(unknown)";
    console.error('socket.io (' + self.location + ') connect_failed: ' + theReason + '.');
    // If have not ever connected then signal error
    if (self.initialConnect) {
      callBack.call(self, new Message('Error', 'cannot connect'));
    }
  });
  self.socket.on('message', function (obj) {
    console.log('socket.io (' + self.location + ') message: ' + obj);
  });
  self.socket.on('disconnect', function (reason) {
    self.connected = false;
    console.log('socket.io (' + self.location + ') disconnect: ' + reason);
  });
}
/*
 * Methods
 */
Transport.prototype.send = function (message, callBack) {
  var self = this;
  if (typeof message == 'undefined') throw new Error('message required');
  if (!(message instanceof Message)) throw new Error('parameter must be instance of Message');
  if (typeof callBack != 'undefined' && typeof callBack != 'function') throw new Error('argument must a callback');
  if (!this.connected) {
    callBack.call(self, new Message('Error', 'not connected'));
    return;
  }
  if (typeof callBack != 'undefined') {
    self.socket.emit('ackmessage', message, function (msg) {
      callBack.call(self, msg);
    });
  } else {
    self.socket.send(message);
  }
};
Transport.prototype.close = function () {
  if (!this.connected)
    throw new Error('not connected');
  this.socket.disconnect();
};
/**
 * tequila
 * message-class
 */
// Message Constructor
function Message(type, contents) {
  if (false === (this instanceof Message)) throw new Error('new operator required');
  if ('undefined' == typeof type) throw new Error('message type required');
  if (!T.contains(T.getMessageTypes(), type)) throw new Error('Invalid message type: ' + type);
  this.type = type;
  this.contents = contents;
}
/*
 * Methods
 */
Message.prototype.toString = function () {
  switch (this.type) {
    case 'Null':
      return this.type + ' Message';
      break;
    default:
      return this.type + ' Message: ' + this.contents;
      break;
  }
};
/**
 * tequila
 * attribute-class
 */
// Attribute Constructor
function Attribute(args, arg2) {
  var splitTypes; // For String(30) type
  if (false === (this instanceof Attribute)) throw new Error('new operator required');
  if (typeof args == 'string') {
    var quickName = args;
    args = [];
    args.name = quickName;
    if (typeof arg2 == 'string') {
      args.type = arg2;
    }
  }
  args = args || [];
  this.name = args.name || null;
  this.label = args.label || args.name;
  this.type = args.type || 'String';
  splitTypes = splitParens(this.type);
  this.type = splitTypes[0];
  var unusedProperties = [];
  switch (this.type) {
    case 'ID':
      unusedProperties = T.getUnusedProperties(args, ['name', 'type', 'label', 'value']);
      this.value = args.value || null;
      break;
    case 'String':
      unusedProperties = T.getUnusedProperties(args, ['name', 'type', 'label', 'value', 'size']);
      this.size = splitTypes[1] ? splitTypes[1] : typeof args.size == 'number' ? args.size : args.size || 50;
      this.value = args.value || null;
      break;
    case 'Date':
      unusedProperties = T.getUnusedProperties(args, ['name', 'type', 'label', 'value']);
      this.value = args.value || null;
      break;
    case 'Boolean':
      unusedProperties = T.getUnusedProperties(args, ['name', 'type', 'label', 'value']);
      this.value = args.value || null;
      break;
    case 'Number':
      unusedProperties = T.getUnusedProperties(args, ['name', 'type', 'label', 'value']);
      this.value = args.value || null;
      break;
    case 'Model':
      unusedProperties = T.getUnusedProperties(args, ['name', 'type', 'label', 'value', 'modelType']);
      this.value = args.value || null;
      this.modelType = args.modelType || null;
      break;
    case 'Group':
      unusedProperties = T.getUnusedProperties(args, ['name', 'type', 'label', 'value']);
      this.value = args.value || null;
      break;
    case 'Table':
      unusedProperties = T.getUnusedProperties(args, ['name', 'type', 'label', 'value', 'group']);
      this.value = args.value || null;
      this.group = args.group || null;
      break;

    default:
      break;
  }
  var badJooJoo = this.getValidationErrors(); // before leaving make sure valid Attribute
  for (var i = 0; i < unusedProperties.length; i++) badJooJoo.push('invalid property: ' + unusedProperties[i]);
  if (badJooJoo.length > 1) throw new Error('error creating Attribute: multiple errors');
  if (badJooJoo.length)
    throw new Error('error creating Attribute: ' + badJooJoo[0]);
}
/*
 * Methods
 */
Attribute.prototype.toString = function () {
  return this.name === null ? 'new Attribute' : 'Attribute: ' + this.name;
};
Attribute.prototype.coerce = function (value) {
  var newValue = value;
  var temp;
  switch (this.type) {
    case 'String':
      if (typeof newValue == 'undefined') return '';
      if (typeof newValue == 'boolean' && !newValue) return 'false';
      if (!newValue) return '';
      newValue = value.toString();
      if (newValue.length > this.size) return newValue.substring(0, this.size);
      return newValue;
      break;
    case 'Number':
      if (typeof newValue == 'undefined') return 0;
      if (!newValue) return 0;
      if (typeof newValue == 'string') {
        newValue = newValue.replace(/^\s+|\s+$/g, ''); // trim
        temp = newValue.split(' ');
        newValue = temp.length ? temp[0] : '';
        newValue = Number(newValue.replace(/[^/0-9\ \.]+/g, ""));
      } else {
        newValue = Number(newValue);
      }
      if (!newValue) return 0;
      return newValue;
      break;
    case 'Boolean':
      if (typeof newValue == 'undefined') return false;
      if (typeof newValue == 'string') {
        newValue = newValue.toUpperCase();
        if (newValue === 'Y' || newValue === 'YES' || newValue === 'T' || newValue === 'TRUE' || newValue === '1')
          return true;
        return false;
      }
      return (newValue == true);
      break;
  }
  throw(Error('coerce cannot determine appropriate value'))
};
Attribute.prototype.getValidationErrors = function () {
  var errors = [];
  if (!this.name) errors.push('name required');
  if (!T.contains(T.getAttributeTypes(), this.type))
    errors.push('Invalid type: ' + this.type);
  switch (this.type) {
    case 'ID': // Todo how to handle IDs ?
      if (!(this.value == null /*  || this.value instanceof ID */ )) errors.push('value must be null or a ID');
      break;
    case 'String':
      if (typeof this.size != 'number') errors.push('size must be a number from 1 to 255');
      if (this.size < 1 || this.size > 255) errors.push('size must be a number from 1 to 255');
      if (!(this.value == null || typeof this.value == 'string')) errors.push('value must be null or a String');
      break;
    case 'Date':
      if (!(this.value == null || this.value instanceof Date)) errors.push('value must be null or a Date');
      break;
    case 'Boolean':
      if (!(this.value == null || typeof this.value == 'boolean')) errors.push('value must be null or a Boolean');
      break;
    case 'Number':
      if (!(this.value == null || typeof this.value == 'number')) errors.push('value must be null or a Number');
      break;
    case 'Model':
      if (!(this.value == null || this.value instanceof Model)) errors.push('value must be null or a Model');
      if (!(this.modelType instanceof Model)) errors.push('modelType must be instance of Model');
      break;
    case 'Group':
      if (this.value == null || this.value instanceof Array) {
        for (var i in this.value) {
          if (!(this.value[i] instanceof Attribute)) errors.push('each element in group must be instance of Attribute');
          if (this.value[i].getValidationErrors().length) errors.push('group contains invalid members');
        }
      } else {
        errors.push('value must be null or an array');
      }
      break;
    case 'Table':
      if (!(this.group instanceof Attribute)) {
        errors.push('group property required');
      } else {
        if (this.group.value instanceof Array) {
          if (this.group.value.length < 1) {
            errors.push('group property value must contain at least one Attribute');
          } else {
            for (var i in this.group.value) {
              if (!(this.group.value[i] instanceof Attribute)) errors.push('each element in group must be instance of Attribute');
              if (this.group.value[i].getValidationErrors().length) errors.push('group contains invalid members');
            }
          }
        } else {
          errors.push('group.value must be an array');
        }
      }
      break;
    default:
      break;
  }
  return errors;
};
/*
 * Helpers
 */
function splitParens(str, outside, inside) {
  var tmpSplit = str.split('(');
  tmpSplit[1] = parseInt(tmpSplit[1]);
  return tmpSplit;
}
/**
 * tequila
 * model-class
 */
// Model Constructor
var Model = function (args) {
  if (false === (this instanceof Model)) throw new Error('new operator required');
  this.modelType = "Model";
  this.attributes = [new Attribute('id', 'ID')];
  args = args || [];
  if (args.attributes) {
    for (var i in args.attributes) {
      this.attributes.push(args.attributes[i]);
    }
  }
  var unusedProperties = T.getUnusedProperties(args, ['attributes']);
  var badJooJoo = this.getValidationErrors(); // before leaving make sure valid Model
  for (var i = 0; i < unusedProperties.length; i++) badJooJoo.push('invalid property: ' + unusedProperties[i]);
  if (badJooJoo.length > 1) throw new Error('error creating Attribute: multiple errors');
  if (badJooJoo.length) throw new Error('error creating Attribute: ' + badJooJoo[0]);
};
// Methods
Model.prototype.toString = function () {
  return "a " + this.modelType;
};
Model.prototype.copy = function (sourceModel) {
  for (var i in this.attributes) {
    this.attributes[i].value = sourceModel.attributes[i].value;
  }
};
Model.prototype.getValidationErrors = function () {
  var errors = [];
  // check attributes
  if (!(this.attributes instanceof Array)) {
    errors.push('attributes must be Array');
  } else {
    if (this.attributes.length < 1) {
      errors.push('attributes must not be empty');
    } else {
      for (var i = 0; i < this.attributes.length; i++) {
        if (i == 0 && (!(this.attributes[i] instanceof Attribute) || this.attributes[i].type != "ID")) errors.push('first attribute must be ID');
        if (!(this.attributes[i] instanceof Attribute)) errors.push('attribute must be Attribute');
      }
    }
  }
  // check tags
  if (this.tags !== undefined && !(this.tags instanceof Array)) {
    errors.push('tags must be Array or null');
  }
  return errors;
};
Model.prototype.get = function (attribute) {
  for (var i = 0; i < this.attributes.length; i++) {
    if (this.attributes[i].name.toUpperCase() == attribute.toUpperCase())
      return this.attributes[i].value;
  }
};
Model.prototype.set = function (attribute, value) {
  for (var i = 0; i < this.attributes.length; i++) {
    if (this.attributes[i].name.toUpperCase() == attribute.toUpperCase()) {
      this.attributes[i].value = value;
      return;
    }
  }
  throw new Error('attribute not valid for model');
};
/**
 * tequila
 * list-class
 */

// Constructor
var List = function (model) {
  if (false === (this instanceof List)) throw new Error('new operator required');
  if (false === (model instanceof Model)) throw new Error('argument required: model');
  this.model = model;
  this._items = [];
  this._itemIndex = -1;
};
List.prototype.length = function () {
  return this._items.length;
};
List.prototype.clear = function () {
  this._items = [];
  this._itemIndex = -1;
  return this;
};
List.prototype.get = function (attribute) {
  if (this._items.length < 1) throw new Error('list is empty');
  for (var i = 0; i < this.model.attributes.length; i++) {
    if (this.model.attributes[i].name.toUpperCase() == attribute.toUpperCase())
      return this._items[this._itemIndex][i];
  }
};
List.prototype.set = function (attribute, value) {
  if (this._items.length < 1) throw new Error('list is empty');
  for (var i = 0; i < this.model.attributes.length; i++) {
    if (this.model.attributes[i].name.toUpperCase() == attribute.toUpperCase()) {
      this._items[this._itemIndex][i] = value;
      return;
    }
  }
  throw new Error('attribute not valid for list model');
};
List.prototype.addItem = function (item) {
  var values = [];
  if (item) {
    for (var i in item.attributes) {
      values.push(item.attributes[i].value);
    }
  } else {
    for (var i in this.model.attributes) {
      values.push(undefined);
    }
  }
  this._items.push(values);
  this._itemIndex = this._items.length - 1;
  return this;
};
List.prototype.removeItem = function (item) {
  this._items.splice(this._itemIndex, 1);
  this._itemIndex--;
  return this;
};
List.prototype.indexedItem = function (index) {
  if (this._items.length < 1) throw new Error('list is empty');
  if (index < 0) throw new Error('item not found');
  this._itemIndex = index;
};
List.prototype.nextItem = function () {
  if (this._items.length < 1) throw new Error('list is empty');
  this.indexedItem(this._itemIndex + 1);
};
List.prototype.previousItem = function () {
  if (this._items.length < 1) throw new Error('list is empty');
  this.indexedItem(this._itemIndex - 1);
};
List.prototype.firstItem = function () {
  if (this._items.length < 1) throw new Error('list is empty');
  this.indexedItem(0);
};
List.prototype.lastItem = function () {
  if (this._items.length < 1) throw new Error('list is empty');
  this.indexedItem(this._items.length - 1);
};
List.prototype.sort = function (key) {
  var i = 0;
  var keyvalue;
  for (var keyName in key) {
    if (!keyvalue) keyvalue = keyName;
  }
  if (!keyvalue) throw new Error('sort order required');
  var ascendingSort = (key[keyvalue] == 1);
  while (i < this.model.attributes.length && this.model.attributes[i].name != keyvalue) i++;
  this._items.sort(function (a, b) {
    if (ascendingSort) {
      if (a[i] < b[i])
        return -1;
      if (a[i] > b[i])
        return 1;
    } else {
      if (a[i] > b[i])
        return -1;
      if (a[i] < b[i])
        return 1;
    }
    return 0;
  });
};
/**
 * tequila
 * user-core-model
 */

// Model Constructor
var User = function (args) {
  if (false === (this instanceof User)) throw new Error('new operator required');
  Model.call(this, args);
  this.modelType = "User";
};
User.prototype = T.inheritPrototype(Model.prototype);
/**
 * tequila
 * store-core-model
 */

// Constructor
var Store = function (args) {
  if (false === (this instanceof Store)) throw new Error('new operator required');
  args = args || [];
  this.storeType = args.storeType || "Store";
  this.name = args.name || 'a ' + this.storeType;
  this.storeInterface = {
    isReady: true,
    canGetModel: false,
    canPutModel: false,
    canDeleteModel: false,
    canGetList: false
  };
  var unusedProperties = T.getUnusedProperties(args, ['name', 'storeType']);
  var badJooJoo = [];
  for (var i = 0; i < unusedProperties.length; i++) badJooJoo.push('invalid property: ' + unusedProperties[i]);
  if (badJooJoo.length > 1) throw new Error('error creating Store: multiple errors');
  if (badJooJoo.length) throw new Error('error creating Store: ' + badJooJoo[0]);
};
Store.prototype = T.inheritPrototype(Model.prototype);
// Methods
Store.prototype.toString = function () {
  if (this.name == 'a ' + this.storeType) {
    return this.name;
  } else {
    return this.storeType + ': ' + this.name;
  }
};
Store.prototype.getStoreInterface = function () {
  return this.storeInterface;
};
Store.prototype.onConnect = function (location, callBack) {
  if (typeof location != 'string') throw new Error('argument must a url string');
  if (typeof callBack != 'function') throw new Error('argument must a callback');
  callBack(this, undefined);
};
Store.prototype.getModel = function () {
  throw new Error(this.storeType + ' does not provide getModel');
};
Store.prototype.putModel = function () {
  throw new Error('Store does not provide putModel');
};
Store.prototype.deleteModel = function () {
  throw new Error('Store does not provide deleteModel');
};
Store.prototype.getList = function () {
  throw new Error('Store does not provide getList');
};
/**
 * tequila
 * memory-store-model
 */
// Constructor
var MemoryStore = function (args) {
  if (false === (this instanceof MemoryStore)) throw new Error('new operator required');
  args = args || [];
  this.storeType = args.storeType || "MemoryStore";
  this.name = args.name || 'a ' + this.storeType;
  this.storeInterface = {
    isReady: true,
    canGetModel: true,
    canPutModel: true,
    canDeleteModel: true,
    canGetList: true
  };
  this.data = [];// Each ele is an array of model types and contents (which is an array of IDs and Model Value Store)
  this.idCounter = 0;
  var unusedProperties = T.getUnusedProperties(args, ['name', 'storeType']);
  var badJooJoo = [];
  for (var i = 0; i < unusedProperties.length; i++) badJooJoo.push('invalid property: ' + unusedProperties[i]);
  if (badJooJoo.length > 1) throw new Error('error creating Store: multiple errors');
  if (badJooJoo.length) throw new Error('error creating Store: ' + badJooJoo[0]);
};
MemoryStore.prototype = T.inheritPrototype(Store.prototype);
// Methods
MemoryStore.prototype.getModel = function (model, callBack) {
  if (!(model instanceof Model)) throw new Error('argument must be a Model');
  if (model.getValidationErrors().length) throw new Error('model has validation errors');
  if (!model.attributes[0].value) throw new Error('ID not set');
  if (typeof callBack != "function") throw new Error('callback required');
  // Find model in memorystore, error out if can't find
  var modelIndex = -1;
  for (var i = 0; i < this.data.length; i++) if (this.data[i][0] == model.modelType) modelIndex = i;
  if (modelIndex < 0) {
    callBack(model, new Error('model not found in store'));
    return;
  }
  // Find the ID now and put in instanceIndex
  var id = model.get('id');
  var storedPair = this.data[modelIndex][1];
  var instanceIndex = -1;
  for (var i = 0; instanceIndex < 0 && i < storedPair.length; i++) if (storedPair[i][0] == id) instanceIndex = i;
  if (instanceIndex < 0) {
    callBack(model, new Error('id not found in store'));
    return;
  }
  // Copy values from store to ref model
  var storeValues = storedPair[instanceIndex][1];
  for (var a in model.attributes) {
    model.attributes[a].value = storeValues[model.attributes[a].name];
  }
  callBack(model, undefined);
};
MemoryStore.prototype.putModel = function (model, callBack) {
  if (!(model instanceof Model)) throw new Error('argument must be a Model');
  if (model.getValidationErrors().length) throw new Error('model has validation errors');
  if (typeof callBack != "function") throw new Error('callback required');
  var id = model.get('ID');
  if (id) {
    // Find model in memorystore, error out if can't find
    var modelIndex = -1;
    for (var i = 0; i < this.data.length; i++) if (this.data[i][0] == model.modelType) modelIndex = i;
    if (modelIndex < 0) {
      callBack(model, new Error('model not found in store'));
      return;
    }
    // Find the ID now
    var instanceIndex = -1;
    var id = model.get('id');
    var storedPair = this.data[modelIndex][1];
    for (var i = 0; instanceIndex < 0 && i < storedPair.length; i++) if (storedPair[i][0] == id) instanceIndex = i;
    if (instanceIndex < 0) {
      callBack(model, new Error('id not found in store'));
      return;
    }
    // Copy from store
    var ModelValues = {};
    for (var a in model.attributes) {
      var theName = model.attributes[a].name;
      var theValue = model.attributes[a].value;
      ModelValues[theName] = theValue;
    }
    storedPair[instanceIndex][1] = ModelValues;
    callBack(model, undefined);
  } else {
    // Find model in memorystore, add if not found
    var modelIndex = -1;
    for (var i = 0; i < this.data.length; i++) if (this.data[i][0] == model.modelType) modelIndex = i;
    if (modelIndex < 0) {
      this.data.push([model.modelType, [] ]);
      modelIndex = this.data.length - 1;
    }
    // Add the id and model to memory store
    var newID = ++this.idCounter;
    model.set('id', newID);
    var ModelValues = {};
    for (var a in model.attributes) {
      var theName = model.attributes[a].name;
      var theValue = model.attributes[a].value;
      ModelValues[theName] = theValue;
    }
    this.data[modelIndex][1].push([newID, ModelValues]);
    callBack(model, undefined);
  }

};
MemoryStore.prototype.deleteModel = function (model, callBack) {
  if (!(model instanceof Model)) throw new Error('argument must be a Model');
  if (model.getValidationErrors().length) throw new Error('model has validation errors');
  if (typeof callBack != "function") throw new Error('callback required');
  // Find model in memorystore, error out if can't find
  var modelIndex = -1;
  for (var i = 0; i < this.data.length; i++) if (this.data[i][0] == model.modelType) modelIndex = i;
  if (modelIndex < 0) {
    callBack(model, new Error('model not found in store'));
    return;
  }
  // Find the ID now
  var instanceIndex = -1;
  var id = model.get('id');
  var storedPair = this.data[modelIndex][1];
  for (var i = 0; instanceIndex < 0 && i < storedPair.length; i++) if (storedPair[i][0] == id) instanceIndex = i;
  if (instanceIndex < 0) {
    callBack(model, new Error('id not found in store'));
    return;
  }
  // Splice out the stored values then prepare that Model for callback with ID stripped
  var storeValues = storedPair.splice(instanceIndex, 1)[0][1];
  for (var a in model.attributes) {
    if (model.attributes[a].name == 'id')
      model.attributes[a].value = undefined;
    else
      model.attributes[a].value = storeValues[model.attributes[a].name];
  }
  callBack(model, undefined);
};
MemoryStore.prototype.getList = function (list, filter, arg3, arg4) {
  var callBack, order;
  if (typeof(arg4) == 'function') {
    callBack = arg4;
    order = arg3;
  } else {
    callBack = arg3;
  }
  if (!(list instanceof List)) throw new Error('argument must be a List');
  if (!(filter instanceof Object)) throw new Error('filter argument must be Object');
  if (typeof callBack != "function") throw new Error('callback required');
  // Find model in memorystore, error out if can't find
  var modelIndex = -1;
  for (var i = 0; i < this.data.length; i++) if (this.data[i][0] == list.model.modelType) modelIndex = i;
  if (modelIndex < 0) {
    callBack(list);
    return;
  }
  list.clear();
  var storedPair = this.data[modelIndex][1];
  for (var i = 0; i < storedPair.length; i++) {
    var doIt = true;
    for (var prop in filter) {
      if (filter.hasOwnProperty(prop)) {
        console.log(storedPair[i][1][prop]);
        if (filter[prop] instanceof RegExp) {
          if (!filter[prop].test(storedPair[i][1][prop])) doIt = false;
        } else {
          if (filter[prop] != storedPair[i][1][prop]) doIt = false;
        }
      }
    }
    if (doIt) {
      var dataPart = [];
      for (var j in storedPair[i][1]) {
        dataPart.push(storedPair[i][1][j]);
      }
      list._items.push(dataPart);
    }
  }
  list._itemIndex = list._items.length - 1;
  if (order) {
    list.sort(order);
  }
  callBack(list);
};
/**
 * tequila
 * remote-store-model
 */
// Constructor
var RemoteStore = function (args) {
  if (false === (this instanceof RemoteStore)) throw new Error('new operator required');
  args = args || [];
  this.storeType = args.storeType || "RemoteStore";
  this.name = args.name || 'a ' + this.storeType;
  this.storeInterface = {
    isReady: false,
    canGetModel: true,
    canPutModel: true,
    canDeleteModel: true,
    canGetList: true
  };
  var unusedProperties = T.getUnusedProperties(args, ['name', 'storeType']);
  var badJooJoo = [];
  for (var i = 0; i < unusedProperties.length; i++) badJooJoo.push('invalid property: ' + unusedProperties[i]);
  if (badJooJoo.length > 1) throw new Error('error creating Store: multiple errors');
  if (badJooJoo.length) throw new Error('error creating Store: ' + badJooJoo[0]);
};
RemoteStore.prototype = T.inheritPrototype(Store.prototype);
// Methods
RemoteStore.prototype.onConnect = function (location, callBack) {
  if (typeof location != 'string') throw new Error('argument must a url string');
  if (typeof callBack != 'function') throw new Error('argument must a callback');
  var store = this;
  try {
    this.transport = new Transport(location, function (msg) {
      if (msg.type == 'Error') {
        console.log('Transport connect error: ' + store.name);
        callBack(undefined, new Error(msg.contents));
        return;
      }
      if (msg.type == 'Connected') {
        console.log('Transport connected: ' + store.name);
        store.storeInterface.isReady = true;
        callBack(store);
        return;
      }
      console.log('Transport unexpected message type: ' + store.name);
      callBack(undefined, new Error('unexpected message type: ' + msg.type));
    });
  }
  catch (err) {
    callBack(undefined, err);
  }
};
RemoteStore.prototype.putModel = function (model, callBack) {
  if (!(model instanceof Model)) throw new Error('argument must be a Model');
  if (model.getValidationErrors().length) throw new Error('model has validation errors');
  if (typeof callBack != "function") throw new Error('callback required');
  this.transport.send(new Message('PutModel', model), function (msg) {
    if (false && msg == 'Ack') { // todo wtf is this
      callBack(model);
    } else if (msg.type == 'PutModelAck') {
      var c = msg.contents;
      model.attributes = [];
      for (var a in c.attributes) {
        if (c.attributes.hasOwnProperty(a)) {
          var attrib = new Attribute(c.attributes[a].name, c.attributes[a].type);
          attrib.value = c.attributes[a].value;
          model.attributes.push(attrib);
        }
      }
      if (typeof c == 'string')
        callBack(model, c);
      else
        callBack(model);
    } else {
      callBack(model, Error(msg));
    }
  });
};
RemoteStore.prototype.getModel = function (model, callBack) {
  if (!(model instanceof Model)) throw new Error('argument must be a Model');
  if (model.getValidationErrors().length) throw new Error('model has validation errors');
  if (!model.attributes[0].value) throw new Error('ID not set');
  if (typeof callBack != "function") throw new Error('callback required');
  this.transport.send(new Message('GetModel', model), function (msg) {
    if (false && msg == 'Ack') { // todo wtf is this
      callBack(model);
    } else if (msg.type == 'GetModelAck') {
      var c = msg.contents;
      model.attributes = [];
      for (var a in c.attributes) {
        var attrib = new Attribute(c.attributes[a].name, c.attributes[a].type);
        attrib.value = c.attributes[a].value;
        model.attributes.push(attrib);
      }
      if (typeof c == 'string')
        callBack(model, c);
      else
        callBack(model);
    } else {
      callBack(model, Error(msg));
    }
  });
};
RemoteStore.prototype.deleteModel = function (model, callBack) {
  if (!(model instanceof Model)) throw new Error('argument must be a Model');
  if (model.getValidationErrors().length) throw new Error('model has validation errors');
  if (typeof callBack != "function") throw new Error('callback required');
  this.transport.send(new Message('DeleteModel', model), function (msg) {
    if (false && msg == 'Ack') { // todo wtf is this
      callBack(model);
    } else if (msg.type == 'DeleteModelAck') {
      var c = msg.contents;
      model.attributes = [];
      for (var a in c.attributes) {
        var attrib = new Attribute(c.attributes[a].name, c.attributes[a].type);
        attrib.value = c.attributes[a].value;
        model.attributes.push(attrib);
      }
      if (typeof c == 'string')
        callBack(model, c);
      else
        callBack(model);
    } else {
      callBack(model, Error(msg));
    }
  });
};
RemoteStore.prototype.getList = function (list, filter, arg3, arg4) {
  var callBack, order;
  if (typeof(arg4) == 'function') {
    callBack = arg4;
    order = arg3;
  } else {
    callBack = arg3;
  }
  if (!(list instanceof List)) throw new Error('argument must be a List');
  if (!(filter instanceof Object)) throw new Error('filter argument must be Object');
  if (typeof callBack != "function") throw new Error('callback required');
  this.transport.send(new Message('GetList', {list: list, filter: filter, order: order}), function (msg) {
    if (false && msg == 'Ack') { // todo wtf is this
      callBack(list);
    } else if (msg.type == 'GetListAck') {
      list._items = msg.contents._items;
      list._itemIndex = msg.contents._itemIndex;
      callBack(list);
    } else {
      callBack(list, Error(msg));
    }
  });

};
// Message Handlers
T.setMessageHandler('PutModel', function putModelMessageHandler(messageContents, fn) {
  // create proxy for client model
  var ProxyPutModel = function (args) {
    Model.call(this, args);
    this.modelType = messageContents.modelType;
    this.attributes = [];
    for (var a in messageContents.attributes) {
      var attrib = new Attribute(messageContents.attributes[a].name, messageContents.attributes[a].type);
      if (attrib.name == 'id') { // TODO only If mongo! or refactor mongo to normalize IDs
        if (attrib.value != messageContents.attributes[a].value)
          attrib.value = messageContents.attributes[a].value;
      } else {
        attrib.value = messageContents.attributes[a].value;
      }
      this.attributes.push(attrib);
    }
  };
  ProxyPutModel.prototype = T.inheritPrototype(Model.prototype); // Todo this is not a real class object may need to make factory builder
  var pm = new ProxyPutModel();
  var msg;
  hostStore.putModel(pm, function (model, error) {
    if (typeof error == 'undefined') {
      msg = new Message('PutModelAck', model);
    } else {
      console.log('ERROR: ' + error + "");
      msg = new Message('PutModelAck', error + "");
    }
    fn(msg);
  }, this);
});
T.setMessageHandler('GetModel', function getModelMessageHandler(messageContents, fn) {
  // create proxy for client model
  var ProxyGetModel = function (args) {
    Model.call(this, args);
    this.modelType = messageContents.modelType;
    this.attributes = [];
    for (var a in messageContents.attributes) {
      var attrib = new Attribute(messageContents.attributes[a].name, messageContents.attributes[a].type);
      if (attrib.name == 'id') { // TODO only If mongo! or refactor mongo to normalize IDs
        attrib.value = messageContents.attributes[a].value;
      } else {
        attrib.value = messageContents.attributes[a].value;
      }
      this.attributes.push(attrib);
    }
  };
  ProxyGetModel.prototype = T.inheritPrototype(Model.prototype);
  var pm = new ProxyGetModel();
  var msg;
  hostStore.getModel(pm, function (model, error) {
    if (typeof error == 'undefined') {
      msg = new Message('GetModelAck', model);
    } else {
      msg = new Message('GetModelAck', error + "");
    }
    fn(msg);
  }, this);
});
T.setMessageHandler('DeleteModel', function deleteModelMessageHandler(messageContents, fn) {
  // create proxy for client model
  var ProxyDeleteModel = function (args) {
    Model.call(this, args);
    this.modelType = messageContents.modelType;
    this.attributes = [];
    for (var a in messageContents.attributes) {
      var attrib = new Attribute(messageContents.attributes[a].name, messageContents.attributes[a].type);
      if (attrib.name == 'id') { // TODO only If mongo! or refactor mongo to normalize IDs
        attrib.value = messageContents.attributes[a].value;
      } else {
        attrib.value = messageContents.attributes[a].value;
      }
      this.attributes.push(attrib);
    }
  };
  ProxyDeleteModel.prototype = T.inheritPrototype(Model.prototype);
  var pm = new ProxyDeleteModel();
  var msg;
  hostStore.deleteModel(pm, function (model, error) {
    if (typeof error == 'undefined')
      msg = new Message('DeleteModelAck', model);
    else
      msg = new Message('DeleteModelAck', error);
    fn(msg);
  }, this);
});
T.setMessageHandler('GetList', function getListMessageHandler(messageContents, fn) {
  var proxyList = new List(new Model());
  proxyList.model.modelType = messageContents.list.model.modelType;
  proxyList.model.attributes = messageContents.list.model.attributes;
  var msg;

  function messageCallback(list, error) {
    if (typeof error == 'undefined')
      msg = new Message('GetListAck', list);
    else
      msg = new Message('GetListAck', error);
    fn(msg);
  }

  if (messageContents.order) {
    hostStore.getList(proxyList, messageContents.filter, messageContents.order, messageCallback);
  } else {
    hostStore.getList(proxyList, messageContents.filter, messageCallback);
  }
});
/**
 * tequila
 * mongo-MongoStore-model.js
 */

// Constructor
var MongoStore = function (args) {
  if (false === (this instanceof MongoStore)) throw new Error('new operator required');
  args = args || [];
  this.storeType = args.storeType || "MongoStore";
  this.name = args.name || 'a ' + this.storeType;

  this.storeInterface = {
    isReady: false,
    canGetModel: T.isServer(),
    canPutModel: T.isServer(),
    canDeleteModel: T.isServer(),
    canGetList: T.isServer()
  };
  var unusedProperties = T.getUnusedProperties(args, ['name', 'storeType']);
  var badJooJoo = [];
  for (var i = 0; i < unusedProperties.length; i++) badJooJoo.push('invalid property: ' + unusedProperties[i]);
  if (badJooJoo.length > 1) throw new Error('error creating Store: multiple errors');
  if (badJooJoo.length) throw new Error('error creating Store: ' + badJooJoo[0]);
};
MongoStore.prototype = T.inheritPrototype(Store.prototype);
// Methods

// See mongo-store-model-server... stub for client here
MongoStore.prototype.onConnect = function (location, callBack) {
  if (typeof location != 'string') throw new Error('argument must a url string');
  if (typeof callBack != 'function') throw new Error('argument must a callback');
  callBack(this, Error('mongoStore unavailable in client'));
};
