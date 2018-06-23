/*
   Example taken from Curran on StackOverflow
   https://stackoverflow.com/questions/12308246/how-to-implement-observer-pattern-in-javascript

   Modified by: Marcel Timmerman 2018 01 23
   Copyright: © Sufitrail 2017, 2018
*/

/**
 * @fileoverview
 */

"use strict";

goog.provide('SufiTrail.Observer');

/** ============================================================================
  @constructor
*/
SufiTrail.Observer = function ( ) {

  // An object containing callback functions.
  //  * Keys are property names
  //  * Values are arrays of arrays of which the first element
  //    callback functions
  this.callbacks = {};

  // An object containing property values from the object to observe
  // available to the user. The values must be set by the owner of that object
  //  * Keys are property names, these are the same as for the callbacks
  //  * Values are values set on the model
  this.values = {};
}

/** ----------------------------------------------------------------------------
  Get the value
*/
SufiTrail.Observer.prototype.get = function( key ) {
  return this.values[key];
}

// Sets a value on the model and invokes callbacks added for the property,
// passing the new value into the callback.
SufiTrail.Observer.prototype.set = function ( key, value ) {
  this.values[key] = value;
  if( this.callbacks[key] ) {
    this.callbacks[key].forEach(
      function ( callback ) {
        callback[0][callback[1]](value);
      }
    );
  }
}

/** ----------------------------------------------------------------------------
  Adds a callback that will listen for changes
  to the specified property.
*/
SufiTrail.Observer.prototype.subscribe = function(
  key, callbackObject, callbackToAdd
) {
  // If no callbacks were registered for the key, make first an empty array
  if( !this.callbacks[key] ) {
    this.callbacks[key] = [];
  }

  // check if already there
  for( var i = 0; i < this.callbacks[key].length; i++) {
    if( this.callbacks[key][i][0] === callbackObject &&
        this.callbacks[key][i][1] === callbackToAdd ) {
      // nothing to do: already there
      return;
    }
  }

  this.callbacks[key].push( [ callbackObject, callbackToAdd]);
}

/** ----------------------------------------------------------------------------
  Removes a callback that listening for changes
  to the specified property.
*/
SufiTrail.Observer.prototype.unsubscribe = function(
  key, callbackObject, callbackToRemove
) {
  if ( this.callbacks[key] ) {
    this.callbacks[key] = this.callbacks[key].filter(
      function ( callback, index, array ) {
        var isCBO = callback[0] === callbackObject;
        var isCTR = callback[1] === callbackToRemove;
        return (!isCBO || !isCTR);
      }
    );
  }
}
