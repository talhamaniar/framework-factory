/**
 * Copyright (C) 2011 - Maniar Technologies Pvt Ltd
 *
 * Desigined By: Mohamed Aamir Maniar
 *
 * */

/**
 * A factory class which creates the base framworks for you.
 * @name FrameworkFactory
 * @class FrameworkFactory
 **/
(function(global, undefined) {

    "use strict";

    /**
     * @lends FrameworkFactory
     * */
    var Framework = function Framework(options) {

        options = options || {};

        this.version = options.version || '1.0.0';
        this.rootNamespace = options.root || 'framework';
        this.fullName = options.fullName || 'framework';
        this.defaultBaseClass = options.defaultBaseClass || Object;

    };

    var FrameworkFactory = {};

    /**
     * Specifies the current version of FrameworkFactory
     * @field FrameworkFactory.version
     **/
    FrameworkFactory.version = '1.0.0 alpha';

    /*
    * A factory function to create framework root based on spplied options.
    * @function FrameworkFactory.create
    * @param options which help define the behaviour of the framework.
    * */
    FrameworkFactory.create = function create(options) {

        var framework = new Framework(options);

        return framework;

    };

    var $f = Framework.prototype;
    var _framework = $f;


    /*
     * @function Registeres a new member to the framework factory;
     * */
    FrameworkFactory.register = function (memberName, member) {
        if (_framework[memberName] !== undefined) {
            throw new Error ('Member already registered.');
        }
        _framework[memberName] = member;
    };

    global.FrameworkFactory = FrameworkFactory;


    Object.create = Object.create || function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };

    Object.getPrototypeOf = Object.getPrototypeOf || function() {

        if (typeof "test".__proto__ === "object" ) {
            Object.getPrototypeOf = function(o){
                return o.__proto__;
            };
        } else {
            Object.getPrototypeOf = function(o){
                // May break if the constructor has been tampered with
                return o.constructor.prototype;
            };
        }
    };


    Array.prototype.indexOf = Array.prototype.indexOf ||
    function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i += 1) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };


    String.trim = String.trim || function(s) {
        return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    };


    _framework.utils = {

        /**
         * Checks whether both the objects are equals. Iterates through all the
         * members to check equality.
         * @function framework.utils.equals
         * @param o1 The first object
         * @param o2 The second object
         * @returns True if both the objects are equal, false if they are not.
         **/
        equals: function(o1, o2) {

            var key;

            //True if both objects are same.
            if (o1 === o2) {
                return true;
            }

            for(key in o1) {

                //If key exists in o1 but not in o2, return false.
                if (o2[key] === undefined) {
                    return false;
                }

                var v1 = o1[key];
                var v2 = o2[key];

                //If values in a given key not matches return false.
                if (v1 !== v2) {
                    return false;
                }
            }

            //If key exists in o2 but not in o1, returns false.
            for (key in o2) {
                if (o1[key] === undefined) {
                    return false;
                }
            }

            //Return true, becuase no differences found.
            return true;

        },

        /**
         *
         **/
        clone: function(o, deep) {
            deep = deep || false;
            throw new Error ('Not implemented error.');
        },

        loadFromJSON: function(o, json, options) {

            options = options || {};
            var setFunctions = options.setFunctions || false;

            for (var key in json) {

                //Check json object owns the member
                if (json.hasOwnProperty[key] === false) {
                    continue;
                }

                //Check the member exists in object to set.
                //if (o[key] === undefined) {
                //    continue;
                //}

                //var propMemberType = typeof prop[key];
                var oMemberType = typeof o[key];
                var val = json[key];

                switch (oMemberType) {

                    case 'object': {

                        if (o[key].constructor.loadFromJSON !== undefined) {
                            o[key].constructor.loadFromJSON(o[key], json[key]);
                        }
                        else if (o[key] instanceof Array) {
                            //Push the val to o[key].
                            o[key].push.apply(o[key], val);
                        }
                        else {
                            _framework.Utils.loadFromJSON(o[key], val);
                        }
                        break;
                    }
                    case 'function': {
                        if (setFunctions === true) {
                            o[key] = val;
                        }
                    }
                    default: {
                        o[key] = val;
                    }
                }
            }
        },

        exportToJSON: function exportToJSON(o) {
            var json = {};
            for (key in o) {

            }
        },

        //Validation
        isFunction: function(fn) {
            return typeof fn === 'function';
        },

        isNumber: function(num) {
            return typeof num === 'number';
        },

        isUndefined: function(val) {
            return typeof val === 'undefined';
        },

        isString: function(str) {
            return typeof val === 'string';
        },

        isDate: function(dt) {
            return (typeof dt === 'object') &&
                (dt instanceof Date === true);
        },

        //UUID

        simpleGuid: function(sep) {
            function section() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (section()+section()+"-"+section()+"-"+section()+"-"+section()+"-"+section()+section()+section());
        },

        //Empty
        emptyFn: function(){},

        'undefined': undefined

    };


    $f.Class = function (prop, parent) {
        //Checks if _super exists in overriden function, inspired by John Resig.
        var fnTest = /xyz/.test(function (){xyz;}) ? /\bbase\b/ : /.*/,
            hasProp = Object.prototype.hasOwnProperty,
            initializing, proto, key, Class, __super__, framework;

        //console.log(fnTest.toString());

        framework = this;

        parent  = parent || framework.defaultBaseClass;
        prop    = prop || {};

        //prevents call to
        initializing = true;
        proto = new parent;
        initializing = false;

        Class = function Class() {
            if (!(this instanceof Class)) {
                throw Error('Class used as function.');
            }
            //this.constructor = Class;
            if (initializing === false && this["init"] !== undefined) {
                this.init.apply(this, arguments);
            }
        };

        //for each static members in parents, copy'em to child
        for (key in parent) {
            //if parent owns the key, set child item = parent item
            if (hasProp.call(parent, key)) Class[key] = parent[key];
        }

        __super__ = parent.prototype;

        Class.prototype = proto;
        Class.prototype.constructor = Class;
        Class.__super__ = __super__;

        Class.attach = function attach (prop) {

            for(key in prop) {

                if (!hasProp.call(prop, key)) {
                    continue;
                }

                var item = prop[key];
                var type = typeof item;
                //var privKey = "_" + key;

                var val = item;

                //console.log([key, item]);

                var processed = false;

                if (type === 'object' && item.type !== undefined) {

                    var typeHandler = _framework.TypeHandlers[item.type];
                    if (typeHandler !== undefined) {
                        typeHandler(Class, key, item);
                        processed = true;
                    }
                }
                else if (type === 'function' &&
                        typeof __super__[key] === 'function' &&
                        fnTest.test(item)) {
                    proto[key] = (function(key, fn){
                        return function() {

                            this.base =  function() {
                                __super__[key].apply(this, arguments);
                            };
                            var ret = fn.apply(this, arguments);
                            //this._super = tmp;
                            delete this.base;
                            return ret;
                        };
                    })(key, item);
                    processed = true;
                }

                //console.log([key, type == 'function', typeof __super__[key], fnTest.test(item)]);

                if (!processed) {
                    proto[key] = val;
                }
                Class.__meta__[key] = item;
            }
        };

        Class.__meta__ = {};

        Class.attach(prop);

        //return
        return Class;

    };

    $f.TypeHandlers = {};


    (function($f, global, undefined) {

        $f.event = function() {
            return {
                type: 'framework.event'
            }
        };

        var eventHandler = function(Class, key, options) {

            var proto = Class.prototype;
            //var eventName = key;


            /**
             * Registers the event for particular event.
             * @example
             * var btn = new Button();
             * btn.mouseMove(function(){
             *  console.log('mouse is moving');
             * });
             **/
            proto[key] = function (handler) {
                var privKey = '_' + key;
                if (this[privKey] === undefined) {
                    this[privKey] = [];
                }
                this[privKey].push(handler);
            };


            if (proto.on === undefined) {

                /**
                 * Registers the event handler for one or more events.
                 * This function is similar to obj.eventName except it accepts more then one events.
                 * @example
                 * var btn = new Button();
                 * btn.on('mousemove, mouseout, mouseup', function() {});
                 **/
                proto.on = function(eventNames, eventHandler) {
                    var names = eventNames.split(',');
                    for(var i=0, length=names.length; i<length; i++) {
                        var eventName = String.trim(names[i]);
                        if (this[eventName] !== undefined) {
                            //Event found, now register handler
                            this[eventName](eventHandler);
                        }
                    }
                };

                /**
                 * Triggers an event causes all the hander associated with the event
                 * to be invoked.
                 * @param evantName The name of the event to be triggered.
                 * @param args arguments to be supplied to event handler. The args must be
                 * derived from an Object. This is an optional parameter if it is not supplied
                 * it will be created having a field 'eventName' which will help identify
                 * the name of the event which triggered.
                 **/
                proto.trigger = function(eventName, args) {

                    var s = this['_' + eventName];
                    //console.log(eventName, s);
                    if (s === undefined || s.length === 0) {
                        return this; //No need to fire event, sicne there is no subscriber.
                    }
                    args = args || {};
                    args["eventName"] = eventName;
                    for(var i=0, len=s.length; i<len ; i++) {
                        var ret = s[i](this, args);
                        if (ret === false) {
                            //no more firing, if handler returns falses
                            break;
                        }
                    }
                    return this;
                };

                /**
                 * Disassociate the handler from the trigger.
                 **/
                proto.off = function(eventName, handler) {
                    var arr = this['_' + eventName];
                    var index = arr.indexOf(handler);
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                };

            }
        };

        $f.TypeHandlers["framework.event"] = eventHandler;

    })(_framework, global);


    _framework.attribute = function(defaultValue, options) {
        return {
            type: 'framework.attribute',
            defaultValue: defaultValue,
            options: options
        };
    };

    /**
     * Shortcut to framework.attribute method.
     * @see Framework#attribute
     **/
    $f.attr = _framework.attribute;

    var attributeHandler = function(Class, key, options) {

        var proto = Class.prototype;
        var privKey = '_' + key;
        proto[key] = options.defaultValue;
    };

    $f.TypeHandlers["framework.attribute"] = attributeHandler;


    (function($f, global, undefined) {

        /*
        * @function: $property
        * @description: While defining class, this function sets the member as
        * a property.
        * @param: defaultValue, the default value of property
        * @param: firePropertyChanged, if true,
        * */
        var property = function property(defaultValue) {
                return {
                    type: 'framework.property',
                    defaultValue: defaultValue,
                    readonly: false
                };
            },

            readonly = function readonly(defaultValue) {
                return {
                    type: 'framework.readonly',
                    defaultValue: defaultValue,
                    readonly: true
                };
            },

            handler = function(Class, key, options) {

                var proto = Class.prototype,
                    privKey = '_' + key;

                proto[privKey] = options.defaultValue;

                if (options.readonly == false) {

                    //Attach property change events to the proto of the Class
                    if (proto['propertyChanged'] === undefined) {
                        Class.attach({
                            propertyChanging: $f.event(),
                            propertyChanged : $f.event()
                        });
                    }
                }

                var _get = function get () {
                        return this[privKey];
                    },
                    _set = function set (v) {

                        var oldVal = this[privKey];

                        if (oldVal === v) {
                            return; //Property not changed.
                        }

                        var args = {
                            propertyName: key,
                            oldValue: oldVal,
                            newValue: v
                        };
                        this.trigger('propertyChanging', args);
                        this[privKey] = v;
                        this.trigger('propertyChanged', args);

                    },
                    _readonlySet = function readonlySet() {
                        throw new Error('You are not allowed to write to readonly attribute "' + key + '".');
                    };

                if (Object.defineProperty) {
                    if (!options.readonly) {
                        Object.defineProperty (proto, key, {
                            get: _get,
                            set: _set
                        });
                    }
                    else {
                       Object.defineProperty (proto, key, {
                            get: _get,
                            set: _readonlySet
                        });
                    }
                }
                else if (proto.__defineGetter__ !== undefined) {
                    proto.__defineGetter__(key, _get);
                    proto.__defineSetter__(key, _readonlySet);
                }
            };

        $f.TypeHandlers['framework.property'] = handler;
        $f.TypeHandlers['framework.readonly'] = handler;

        $f.property     = property;
        $f.readonly     = readonly;

    })(_framework, global);



    $f.collections = {};
    var collections = $f.collections;

    collections.ObservableList = $f.Class({

    }, Object);


    /**
     * A collection class which stores both indexes as well as keys.
     * @class framework.collection.MapList
     * @name framework.collections.MapList.prototype
     **/
    collections.MapList = $f.Class({

        /**
         * Represents total number of items in the list.
         **/
        length          : 0,

        /**
         * Key identifier in the item object.
         * @lends framework.collections.MapList
         **/
        keyName         : 'id',

        init: function() {
            this._items = [];
            this._keys = [];
            this._map = {};

            if (arguments.length > 0) {
                this.add.apply(this, arguments);
            }
        },

        /**
         * Add one or more items into the list.
         * @function MapList.add
         * @param Variable number of items to be added to the list.
         **/
        add: function() {

            var items = this._items,
                keys = this._keys,
                map = this._map,
                keyName = this.keyName,
                item, key;

            for (var i=0, len=arguments.length; i<len; i++) {
                item = arguments[i];
                //check if key available.
                if (typeof item === 'object' && item[keyName] !== undefined) {

                    key = item[keyName];

                    //TODO:verify this code
                    if (typeof key === 'function') {
                        key = key();
                    }
                    //key identified, map it.
                    if (key !== undefined) {

                        //Check  if key already exists.
                        if (map[key] !== undefined) {
                            throw new Error('Item with this key already exists.');
                        }

                        keys.push(key);
                        map[key] = item;
                    }
                }

                //Add item to an array.
                this.length = items.push(item);;
            }
            return this;
        },

        /**
         * Appends a list or an array to the current list.
         **/
        addList: function() {
            var item = arguments[0];

            if (item instanceof Array) {
                this.add.apply(this, item);
            }

            var items = [];
            for (var i=0, len = arguments.length; i<len; i++) {
                items.push(item[i].get(i));
            }
            this.add.apply(this, items);
        },

        get: function(indexOrKey){
            if (typeof indexOrKey === 'number') {
                return this._items[indexOrKey];
            }
            return this._map[indexOrKey];
        },

        replace: function(indexOrKey, item) {
            var index, key, indexKey;
            indexKey = this.findIndexKey(indexOrKey);
            index = indexKey[0];
            key = indexKey [1];
            if (index != -1) {
                this._items[index] = item;
            }
            if (key !== undefined) {
                this.map[key] = item;
            }
        },

        findIndexKey: function(indexOrKey) {
            var index, key;
            if (typeof indexOrKey === 'number') {
                index = indexOrKey;
                key = this._keys[index];
            }
            else {
                index = this._keys.indexOf(indexOrKey);
                key = indexOrKey;
            }
            if (index < 0 || index >= this.length) {
                throw new Error('Index out of range.');
            }
            return [index, key];
        },

        findIndexKeyByItem: function(item) {
            var index = this._items.indexOf(item);
            return findIndexKey(index);
        },

        remove: function(indexOrKey) {

            var indexKey = this.findIndexKey(indexOrKey),
                index = indexKey[0],
                key = indexKey [1];

            //If index found
            if (index < 0) {
                this._items.splice(index, 1); //delete array item
                this._keys.splice(index, 1); //delete key item
            }

            //Key found
            if (key !== undefined) {
                delete this._map[key]; //delete key mapping
            }

            return this;
        },

        findKeyOrIndex: function(indexOrKey) {
            if (typeof indexOrKey === 'number'){
                return this.keys[this.keyName];
            }
            return this._keys.indexOf(indexOrKey);
        },

        clear: function() {
            this._items = [];
            this._keys = [];
            this._map = {};
        },

        indexOf: function(item) {
            return this._items.indexOf(item);
        },

        toArray: function(){
            return this._items;
        },

        each: function(callback) {
            var items, i, len;
            items = this._items;
            for(i=0, len = items.length; i<len; i++){
                callback(items[i]);
            }
            return this;
        }

    }, Object);

    /**
     * Sets the value into collection
     **/
    collections.MapList.loadFromJSON = function set(colObj, value) {
        if (colObj instanceof collections.MapList === false) {
            throw new Error('Operation "set" not supported on this object.');
        }
        //Clear the collection
        colObj.clear();
        if (value instanceof Array || value instanceof collections.MapList) {
            colObj.add.apply(colObj, value);
        }
        else {
            if (value.$type !== undefined) {
            }
            colObj.add(value);
        }
    };

    collections.MapList.exportToJSON = function toJson(colObj) {
        var items = [];
        var colItems = colObj.toArray();
        for (var i=0, len=colObj.length; i<len; i++) {
            var item = colItems[i];
            items.push($f.utils.toJson(item));
        }
        return items;
    };

    collections.ObservableMapList = $f.Class({

        itemBeforeAdd   : $f.event(),
        itemAdded       : $f.event(),
        itemBeforeRemove: $f.event(),
        itemRemoved     : $f.event(),
        itemBeforeSet   : $f.event(),
        itemSet         : $f.event(),

        init: function() {
            this._list = new collections.MapList();
            _list.add.apply(_list, arguments);
        }
    }, Object);



    //$f.Register = _framework.Class({
    //
    //    init: function() {
    //        this._register = new collections.MapList();
    //    },
    //
    //    register: function (type, handler) {
    //
    //    },
    //
    //    unregister: function (type) {
    //        var register = this._register;
    //        delete register[type];
    //    },
    //
    //    get: function (type) {
    //        var register = this._register;
    //        return register[type];
    //    },
    //
    //    set: function(key, type) {
    //        var register = this._register;
    //        if (register[type] === undefined) {
    //            throw new Error('Key not found.')
    //        }
    //        register[key] = type;
    //    }
    //
    //}, Object);





//    collections.CollectionWithEvent = _framework.Class({
//
//        keyName         : $property('name'),
//
//        //TODO: On prefix to all the events
//        itemBeforeAdd   : _framework.event(),
//        itemAdded       : _framework.event(),
//        itemBeforeRemove: _framework.event(),
//        itemRemoved     : _framework.event(),
//        itemBeforeSet   : _framework.event(),
//        itemSet         : _framework.event(),
//
//        init: function() {
//            this._items = [];
//            this._keys = {};
//
//            if (arguments.length > 0) {
//                this.add.apply(this, arguments);
//            }
//        },
//
//        count: function() {
//            return this._items.length;
//        },
//
//        add: function() {
//
//            //alert(this.init);
//            var items = this._items,
//                keys = this._keys,
//                _keyName = getPrivateKey('keyName'),  keyName = this[privKey];
//
//            for (var i=0, len=arguments.length; i<len; i++) {
//
//                var item = arguments[i];
//
//                this.itemBeforeAdd.fire(this, {
//                    item: item
//                });
//
//                if (typeof item === 'object' && item[keyName] !== undefined){
//                    var key = item[keyName];
//                    if (typeof key === 'function'){
//                        key = key();
//                    }
//                    if (key !== undefined){
//                        this._keys[key] = item;
//                    }
//                }
//
//                var length = items.push(item);
//                this.itemAdded.fire(this, {
//                    item: item,
//                    index: length-1,
//                    length: length
//                });
//            }
//            return this;
//        },
//
//        getItem: function(indexOrKey){
//            if (typeof indexOrKey === 'number'){
//                return this._items[indexOrKey];
//            }
//            else if(typeof indexOrKey === 'string'){
//                return this._keys[indexOrKey];
//            }
//            throw "Invalid index or key";
//        },
//
//        setItem: function(indexOrKey, value){
//
//            //TODO: donot allow is user change the key...
//            var keyName = this.keyName();
//            if (typeof indexOrKey === 'number'){
//                var item = this._items[indexOrKey]; //validate
//                this._items[indexOrKey] = value;
//                if (item[keyName] !== undefined){
//                    var key = item[keyName];
//                    //reset the key in value if changed...
//                    //TODO: check it...
//                    value[keyName] = key;
//                    this._keys[key] = value;
//                    return this;
//                }
//            }
//            else if(typeof indexOrKey === 'string'){
//                var item = this._keys[indexOrKey];
//                if (item !== undefined){
//                    var index = this.indexOf(item);
//                    this._items[index] = value; //validate
//                    this._keys[indexOrKey] = value;
//                    return this;
//                }
//            }
//            throw "Invalid index or key";
//        },
//
//        remove: function(indexOrKey) {
//
//            var index = -1,
//                item, keyName, key;
//
//            if (typeof indexOrKey === 'number'){
//                index = indexOrKey;
//                item = this._items[index];
//            }
//            else if(typeof indexOrKey === 'string'){
//                item = this._keys[item];
//                index = this.indexOf(item);
//            }
//            else {
//                throw "Invalid index or key";
//            }
//
//            this.itemBeforeRemove.fire(this, {
//                index: index,
//                item: item
//            });
//
//            keyName = this.keyName();
//            key = item[keyName];
//            if (key === undefined){
//
//            }
//            this._items.splice(index, 1); //delete array item
//            this.itemRemoved.fire(this, {
//                item: item
//            });
//
//            return this;
//        },
//
//        indexOf: function(item) {
//            return this._items.indexOf(item);
//        },
//
//        items: function(){
//            return this._items;
//        },
//
//        toArray: function(){
//            return this._items;
//        },
//
//        each: function(callback) {
//            var items, i, len;
//
//            items = this._items;
//            for(i=0, len = items.length; i<len; i++){
//                callback(items[i]);
//            }
//            return this;
//        }
//
//    }, _framework.Component);
//
//    var styles = [];
//
//    function attachFinder(arr, keyName) {
//        var foundKey, obj;
//        arr.find = function(key, cache) {
//
//            cache = cache || true;
//
//            if (cache === true) {
//                if (arr._keys === undefined) {
//                    arr._keys = {};
//                }
//                if (arr._keys[key] === undefined) {
//                    for (var i=0; i<arr.length; i++) {
//                        if (arr[i][keyName] === key) {
//                            foundKey = key;
//                            arr._keys[foundKey] = arr[i];
//                            obj = arr[i];
//                            break;
//                        }
//                    }
//                    if (foundKey === undefined) {
//                        throw new Error('key not found.');
//                    }
//                }
//                else {
//                    obj = arr._keys[key];
//                }
//                return obj;
//            }
//            for (var i=0; i<arr.length; i++) {
//                if (arr[i][keyName] === key) {
//                    return arr[i];
//                }
//            }
//            throw new Error('key not found.');
//        };
//    }
//
//
//    styles[0] = new Style({
//        name: 'wow',
//        style: 'red'
//    });
//
//    var wow = style.find('wow');
//    styles[0] = new Style({
//        name: 'great'
//    });


    FrameworkFactory.plugin = function(fn) {
        fn.call(global, $f);
    }
    
    return FrameworkFactory;

})(this);

//$class = framework.classCreator;
//$interface = framework.interfaceCreator;
//$property = baseObject
