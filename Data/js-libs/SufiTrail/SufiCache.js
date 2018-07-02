/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017, 2018

   This module is generated by bin/mkCacheTileArray.pl6. Please do not
   modify because it will be overwritten in subsequent generations.
*/

// "use strict" cannot be used when goog.base() is called!;

goog.provide('SufiTrail.SufiCache');

goog.require('SufiTrail.SufiCacheData');

/** ============================================================================
  Object to cache tile and features data
  @constructor
  @extends {SufiTrail.SufiCacheData}
  @final
*/
SufiTrail.SufiCache = function ( ) {

  // initialize cache data object
  //SufiTrail.SufiCacheData.call();

}

/** ----------------------------------------------------------------------------
  establish inheritance
*/
goog.inherits( SufiTrail.SufiCache, SufiTrail.SufiCacheData);

/** ----------------------------------------------------------------------------
  @public
  @param {SufiTrail.SufiCenter} center SufiTrail core object
*/
SufiTrail.SufiCache.prototype.init = function ( center ) {

  // call superclass init to initialize the tile data
  goog.base( this, 'init', center);

  // subscribe to on/offline of network
  this.center.observers.subscribe( 'networkState', this, 'network');
}

/** ----------------------------------------------------------------------------
  @private
  @param {string} state network is on or off, can be wifi, none, ...
*/
SufiTrail.SufiCache.prototype.network = function ( state ) {

//console.log('Network state: ' + state);

  var self = this;
  if ( state === 'wifi' ) {
    self.center.waitUntil(
      function ( ) {
/*
        console.log(
          'SufiIO defined: ' + typeof self.center.SufiIO
        );
*/
        return (
          self.center.SufiIO !== null &&
          self.center.SufiIO.urls !== null &&
          self.center.SufiIO.urls["tileDirEntry"] !== null
        );
      },

      function ( ) {
        self.startCaching();
      },

      200, 2000
    );
  }
}

/** ----------------------------------------------------------------------------
  @private
*/
SufiTrail.SufiCache.prototype.startCaching = function ( ) {

//TODO timeout if there is no or slow input
  // start caching
/*
  console.log('class: ' + ({}).toString.call(this.center));
  console.log('class: ' + ({}).toString.call(this.center.SufiIO));
  console.log('SufiIO defined: ' + this.center.SufiIO);
*/
  var SufiIO = this.center.SufiIO;
  var tileDirEntry = SufiIO.urls["tileDirEntry"];
/*
  console.log('SufiIO urls tiles defined: ' + ({}).toString.call(tileDirEntry));
  console.log('SufiIO entries: ' + SufiIO.urls["tileDirEntry"]);
*/
  SufiIO.getDirectory(
    tileDirEntry, 'map',
    function ( mapDirEntry ) {
console.log("MDE: " + mapDirEntry.fullPath);
    }
  );
}
