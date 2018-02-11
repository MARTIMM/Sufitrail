/*
   Example taken from Curran on StackOverflow
   https://stackoverflow.com/questions/12308246/how-to-implement-observer-pattern-in-javascript

   Modified by: Marcel Timmerman 2018 01 23
*/
"use strict";

// =============================================================================
class Observer {

  // ---------------------------------------------------------------------------
  constructor ( ) {

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

    // Get the value
    this.get = function( key ) {
      return this.values[key];
    }

    // Sets a value on the model and invokes callbacks added for the property,
    // passing the new value into the callback.
    this.set = function ( key, value) {
      this.values[key] = value;
      if( this.callbacks[key] ) {
        this.callbacks[key].forEach(
          function ( callback ) {
console.log("Key: ", key + ', ' + callback[1]);
            callback[0][callback[1]](value);
          }
        );
      }
    }

    // Adds a callback that will listen for changes
    // to the specified property.
    this.subscribe = function( key, callbackObject, callbackToAdd ) {
      // If no callbacks were registered for the key, make first an empty array
      if ( !this.callbacks[key] ) { this.callbacks[key] = []; }
      this.callbacks[key].push( [ callbackObject, callbackToAdd]);
console.log('CB: ' + this.callbacks[key]);
    }

    // Removes a callback that listening for changes
    // to the specified property.
    this.unsubscribe = function( key, callbackObject, callbackToRemove ) {
      if ( this.callbacks[key] ) {
        this.callbacks[key] = this.callbacks[key].filter(
          function ( callback ) {
            return (
              callback[0] !== callbackObject &&
              callback[1] !== callbackToRemove
            );
          }
        );
      }
    }
  }
}
