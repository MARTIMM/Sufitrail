/*
    Author: Marcel Timmerman
    License: ...
    Copyright: © Sufitrail 2017, 2018
*/
"use strict";

/**
 * @fileoverview
 */

goog.provide('SufiTrail.SufiCenter');

goog.require('SufiTrail.Observer');
goog.require('SufiTrail.SufiMap');
goog.require('SufiTrail.SufiData');
goog.require('SufiTrail.SufiIO');

/** ============================================================================
  Object performing controller function

  @final
  @constructor
*/
SufiTrail.SufiCenter = function ( ) {
  /** @private (un)subscribe observers and send receive data via this object */
  this.observers = null;

  /** @private part of model and view where the controller is this object */
  this.SufiMap = new SufiTrail.SufiMap();
  this.SufiData = new SufiTrail.SufiData();

  // read, write files and send receive usig urls
  this.SufiIO = new SufiTrail.SufiIO();

  // menu generated by sxml package when compiling index.html
  this.menu = null;

  this.device = { };
  this.watchId = null;
  this.progressValue = 0;
  this.pbElement = null;

  // dependencies of html file
  this.mapElementName = "sufiTrailMap";
  this.htmlIdList = {
    splashScreen:         null,
    blossomdiv:           null,
    poppetjediv:          null,

    sufiTrailMap:         null,

    infoData:             null,

    statusMessage:        null,
    userTrackList:        null,
    startTrackButton:     null,
    postponeTrackButton:  null,
    contTrackButton:      null,
    saveTrackButton:      null,

    exitButton:           null
  };

  this.externalObjects = {
    menuObject:           menu,
    observer:             new SufiTrail.Observer()
  };
}

/** ----------------------------------------------------------------------------
  @function
*/
SufiTrail.SufiCenter.prototype.init = function ( ) {

  // initialize the observers object
  this.observers = this.externalObjects["observer"];

  // must be set first: init's might refer to it
  this.menu = this.externalObjects["menuObject"];

  // elements can be processed from document because scripts are at the end of
  // the document. So, when scripts are running the documents must be there.

  // now wait for the device is ready for further processing. some
  // details must come from the devices hardware.
  var centerobj = this;
  setTimeout(
    function () {
      document.addEventListener(
        'deviceready', function ( ) { centerobj.onDeviceReady( ) }, false
      );
    }, 9000
  );
}

/** ----------------------------------------------------------------------------
  after device is ready get the devices state and initialize the
  other objects.
*/
SufiTrail.SufiCenter.prototype.onDeviceReady = function ( ) {

  // find the html element objects by its id from the id list
  for( var k in this.htmlIdList ) {
    // use hasOwnProperty to filter out keys from the Object.prototype
    if( this.htmlIdList.hasOwnProperty(k) ) {
      this.htmlIdList[k] = document.getElementById(k);
console.log( "K: " + k + ', ' + this.htmlIdList[k]);
    }
  }


  // which device are we working with
  this.device = device;

  // set an event on each of the tracks found in the document
  this.setTrackEvents();

  // make the buttons active
  this.activateButtons();

  // do the other initializations
  this.SufiIO.init(this);
  this.SufiMap.init( this, this.mapElementName);
  this.SufiData.init(this);
  this.SufiIO.init(this);

  // check for networking offline/online
  this.observers.set( 'networkState', navigator.onLine);
  var centerobj = this;
  goog.global.addEventListener(
    'offline', function ( ) {
// TODO needs some extra work to be accurate
      centerobj.observers.set( 'networkState', navigator.onLine);
    }
  );
  goog.global.addEventListener(
    'online', function ( ) {
      centerobj.observers.set( 'networkState', navigator.onLine);
    }
  );

  // Setup geolocation watcher
  this.watchGPS();

  console.log('Initialization complete');

  // show map after splash start screen
  //this.menu.showPage('map-page');
  var parent = this.htmlIdList["blossomdiv"].parentElement;
  parent.removeChild(this.htmlIdList["blossomdiv"]);
  parent.removeChild(this.htmlIdList["poppetjediv"]);
  parent = this.htmlIdList["splashScreen"].parentElement;
  parent.removeChild(this.htmlIdList["splashScreen"]);
}

// ---------------------------------------------------------------------------
// See also https://www.w3.org/TR/geolocation-API/
SufiTrail.SufiCenter.prototype.watchGPS = function ( ) {

  var centerobj = this;

  // listen to changes in position
  this.watchId = navigator.geolocation.watchPosition(
    // on success
    function(position) {
//console.log('location changed: ' + position);
      // Let any observers know that the device is ready
      centerobj.observers.set( 'currentLocation', position);
    },

    // on error
    function(error) {
console.log('locator error: ' + error.code + ', ' + error.message);
    },

    // options
    { enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 600000
    }
  );
}

// ---------------------------------------------------------------------------
// make series of tracks clickable
SufiTrail.SufiCenter.prototype.setTrackEvents = function ( ) {

  var centerobj = this;
  var gpxElement;
  var trackCount = 1;

// TODO generate the html from a directory list
  // each track filename is stored in the data-gpx-file attribute of an 'li'
  // element. This element can be found through its id starting with track
  // followed by a number. E.g. track1. Also info data is found using the
  // data-info-file attribute.
  while ( gpxElement = document.querySelector('#track' + trackCount) ) {

    // get the filename from the data attribute
    var gpxFile = gpxElement.getAttribute('data-gpx-file');
    var infoFile = gpxElement.getAttribute('data-info-file');
    trackCount++;

    // define a function returning a handler which shows a track and
    // focus as well as fits the track on screen
    function loadTrack ( trackFile, trackInfo ) {
      return function ( ) {

        // show map again
        centerobj.menu.showPage('map-page');

console.log('load track from ' + trackFile);
console.log('load info from ' + trackInfo);
        // sent a hint that the filenames are ready to process
        centerobj.observers.set( 'gpxFile', trackFile);
        centerobj.observers.set( 'infoFile', trackInfo);
      };
    }

    // set a click handler on the li element to close the menu and
    // to show the map again.
    gpxElement.addEventListener( "click", loadTrack( gpxFile, infoFile));
  }
}

//----------------------------------------------------------------------------
SufiTrail.SufiCenter.prototype.activateButtons = function ( ) {

  var centerobj = this;
  // button to start, postpone and continue tracking, and save a track.
  this.htmlIdList['startTrackButton'].addEventListener(
    "click", function ( ) { centerobj.SufiData.doStartTrack() }, false
  );

  this.htmlIdList['postponeTrackButton'].addEventListener(
    "click", function ( ) { centerobj.SufiData.doPostponeTrack() }, false
  );

  this.htmlIdList['contTrackButton'].addEventListener(
    "click", function ( ) { centerobj.SufiData.doContTrack() }, false
  );

  this.htmlIdList['saveTrackButton'].addEventListener(
    "click", function ( ) { centerobj.SufiData.doSaveTrack() }, false
  );

  // button to exit the application
  this.htmlIdList['exitButton'].addEventListener(
    "click", function ( ) { centerobj.doExitApp() }, false
  );
}

//----------------------------------------------------------------------------
SufiTrail.SufiCenter.prototype.doExitApp = function ( ) {

  navigator.geolocation.clearWatch(this.watchId);
  console.log('SufiTrail program stopped');
  navigator.app.exitApp();
}
