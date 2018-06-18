/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017, 2018
*/
"use strict";

goog.provide('SufiTrail.SufiCenter');

goog.require('SufiTrail.Observer');
goog.require('SufiTrail.SufiMap');

/** ============================================================================
  @constructor
*/
SufiTrail.SufiCenter = function ( ) {
  /** @private (un)subscribe observers and send receive data via this object */
  this.observers = null;

  /** @private part of model and view where the controller is this object */
  this.view = new SufiTrail.SufiMap();
  this.model = SufiData;

  // read, write files and send receive usig urls
  this.IO = SufiIO;

  // menu generated by sxml package when compiling index.html
  this.menu = null;

  this.device = { };
  this.watchId = null;
  this.progressValue = 0;

  // dependencies of html file
  this.mapElementName = "sufiTrailMap";
  this.htmlIdList = {
    progressBar:          null,
    splashProgress:       null,
    splashScreen:         null,

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
*/
SufiTrail.SufiCenter.prototype.init = function ( ) {

  // initialize the observers object
  this.observers = this.externalObjects["observer"];

  // must be set first: init's might refer to it
  this.menu = this.externalObjects["menuObject"];

  // initialization steps
  this.observers.subscribe( 'initStep', SufiCenter, 'displayProgress');


  // elements can be processed from document because scripts are at the end of
  // the document. So, when scripts are running the documents must be there.

  // now wait for the device is ready for further processing. some
  // details must come from the devices hardware.
  setTimeout(
    function () {
      document.addEventListener(
        'deviceready', SufiCenter.onDeviceReady, false
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
  for( var k in SufiCenter.htmlIdList ) {
    // use hasOwnProperty to filter out keys from the Object.prototype
    if( SufiCenter.htmlIdList.hasOwnProperty(k) ) {
      SufiCenter.htmlIdList[k] = document.getElementById(k);
      console.log( "K: " + k + ', ' + SufiCenter.htmlIdList[k]);
    }

    SufiCenter.observers.set( 'displayProgress', 0);
  }


  // which device are we working with
  SufiCenter.device = device;

  // set an event on each of the tracks found in the document
  SufiCenter.setTrackEvents();
  SufiCenter.observers.set( 'displayProgress', 0);

  // make the buttons active
  SufiCenter.activateButtons();
  SufiCenter.observers.set( 'displayProgress', 0);

  // do the other initializations
  SufiCenter.IO.init(SufiCenter);
  SufiCenter.observers.set( 'displayProgress', 0);
  SufiCenter.view.init( SufiCenter, SufiCenter.mapElementName);
  SufiCenter.observers.set( 'displayProgress', 0);
  SufiCenter.model.init(SufiCenter);
  SufiCenter.observers.set( 'displayProgress', 0);

  // check for networking offline/online
  SufiCenter.observers.set( 'networkState', navigator.onLine);
  window.addEventListener(
    'offline', function ( ) {
// TODO needs some extra work to be accurate
      SufiCenter.observers.set( 'networkState', navigator.onLine);
    }
  );
  window.addEventListener(
    'online', function ( ) {
      SufiCenter.observers.set( 'networkState', navigator.onLine);
    }
  );
  SufiCenter.observers.set( 'displayProgress', 0);

  // Setup geolocation watcher
  SufiCenter.watchGPS();
  SufiCenter.observers.set( 'displayProgress', 0);

  // Let any observers know that the device is ready
  //SufiCenter.observers.set( 'deviceReady', true);

  console.log('Initialization complete');

  // show map after splash start screen
  //SufiCenter.menu.showPage('map-page');
  var parent = SufiCenter.htmlIdList["splashScreen"].parentElement;
  parent.removeChild(SufiCenter.htmlIdList["splashScreen"]);
}

// ---------------------------------------------------------------------------
// display initialisation progress
SufiTrail.SufiCenter.prototype.displayProgress = function ( ) {
  var el = SufiCenter.htmlIdList["progressBar"];
  if( typeof el !== 'undefined' ) {
    SufiCenter.progressValue += 1;
//console.log("init value: " + SufiCenter.progressValue);
    //el.value = SufiCenter.progressValue.toString();
    var id = setInterval( frame, 10);
    function frame( ) {
      clearInterval(id);
      el.style.width = SufiCenter.progressValue.toString() + '%';
    }
  }
}

// ---------------------------------------------------------------------------
// See also https://www.w3.org/TR/geolocation-API/
SufiTrail.SufiCenter.prototype.watchGPS = function ( ) {

  // listen to changes in position
  SufiCenter.watchId = navigator.geolocation.watchPosition(
    // on success
    function(position) {
//console.log('location changed: ' + position);
      // Let any observers know that the device is ready
      SufiCenter.observers.set( 'currentLocation', position);
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
    SufiCenter.observers.set( 'displayProgress', 0);

    // define a function returning a handler which shows a track and
    // focus as well as fits the track on screen
    function loadTrack ( trackFile, trackInfo ) {
      return function ( ) {

        // show map again
        SufiCenter.menu.showPage('map-page');

console.log('load track from ' + trackFile);
console.log('load info from ' + trackInfo);
        // sent a hint that the filenames are ready to process
        SufiCenter.observers.set( 'gpxFile', trackFile);
        SufiCenter.observers.set( 'infoFile', trackInfo);
      };
    }

    // set a click handler on the li element to close the menu and
    // to show the map again.
    gpxElement.addEventListener( "click", loadTrack( gpxFile, infoFile));
  }
}

//----------------------------------------------------------------------------
SufiTrail.SufiCenter.prototype.activateButtons = function ( ) {

  // button to start, postpone and continue tracking, and save a track.
  SufiCenter.htmlIdList['startTrackButton'].addEventListener(
    "click", this.model.doStartTrack, false
  );
  SufiCenter.observers.set( 'displayProgress', 0);

  SufiCenter.htmlIdList['postponeTrackButton'].addEventListener(
    "click", this.model.doPostponeTrack, false
  );
  SufiCenter.observers.set( 'displayProgress', 0);

  SufiCenter.htmlIdList['contTrackButton'].addEventListener(
    "click", this.model.doContTrack, false
  );
  SufiCenter.observers.set( 'displayProgress', 0);

  SufiCenter.htmlIdList['saveTrackButton'].addEventListener(
    "click", this.model.doSaveTrack, false
  );
  SufiCenter.observers.set( 'displayProgress', 0);

  // button to exit the application
  SufiCenter.htmlIdList['exitButton'].addEventListener(
    "click", SufiCenter.doExitApp, false
  );
  SufiCenter.observers.set( 'displayProgress', 0);
}

//----------------------------------------------------------------------------
SufiTrail.SufiCenter.prototype.doExitApp = function ( ) {

  navigator.geolocation.clearWatch(SufiCenter.watchId);
  console.log('SufiTrail program stopped');
  navigator.app.exitApp();
}
