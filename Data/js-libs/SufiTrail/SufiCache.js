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

console.log("SufiCache");

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
return;

  console.log('Network state: ' + state);
//TODO timeout if there is no or slow input
  if( state === 'wifi' ) {
    // start caching
    var SufiIO = this.center.SufiIO;
    var tileDirEntry = SufiIO.tileDirEntry;
    SufiIO.getDirectory(
      tileDirEntry, 'map',
      function ( mapDirEntry ) {
console.log("MDE: " + mapDirEntry.fullPath);
      }
    );
  }
}
