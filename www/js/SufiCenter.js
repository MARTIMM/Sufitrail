/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

// =============================================================================
var SufiCenter = {

  // Observers
  observers:        null,

  view:             SufiMap,
  model:            SufiData,

  menu:             null,

  device:           { },
  watchId:          null,

  mapElementName:   null,

  // ---------------------------------------------------------------------------
  init: function ( mapElementName, menuObject ) {

    // save the map elementname
    this.mapElementName = mapElementName;

    // initialize the observers object
    this.observers = new Observer();

    // must be set first: init's might refer to it
    this.menu = menuObject;

    // set an event on each of the tracks found in the document
    this.setTrackEvents();

    // set a counter. value is given to the interval timer when fired
    //this.count = 0;

    // now wait for the device is ready for further processing. some
    // details must come from the devices hardware.
    setTimeout(
      function () {
        document.addEventListener(
          'deviceready', SufiCenter.onDeviceReady, false
        );
      }, 9000
    );
  },

  // after device is ready get the devices state and initialize the
  // other objects.
  onDeviceReady: function ( ) {

    SufiCenter.device = device;
    SufiCenter.activateButtons();

    // do the other initializations
    SufiCenter.view.init( SufiCenter, SufiCenter.mapElementName);
    SufiCenter.model.init(SufiCenter);

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

    // Setup geolocation watcher
    SufiCenter.watchGPS();

    // Let any observers know that the device is ready
    //SufiCenter.observers.set( 'deviceReady', true);

    console.log('Initialization complete');
  },

  // ---------------------------------------------------------------------------
  // See also https://www.w3.org/TR/geolocation-API/
  watchGPS: function ( ) {

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
  },

  // ---------------------------------------------------------------------------
  // make series of tracks clickable
  setTrackEvents: function ( ) {

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
  },

  //----------------------------------------------------------------------------
  activateButtons: function ( ) {

    // button to start, stop and continue tracking, and save a track.
    var button = document.getElementById('startTrackButton');
    button.addEventListener( "click", this.model.doStartTrack, false);

    var button = document.getElementById('stopTrackButton');
    button.addEventListener( "click", this.model.doStopTrack, false);

    var button = document.getElementById('contTrackButton');
    button.addEventListener( "click", this.model.doContTrack, false);

    var button = document.getElementById('saveTrackButton');
    button.addEventListener( "click", this.model.doSaveTrack, false);

    // button to exit the application
    var button = document.getElementById('exitButton');
    button.addEventListener( "click", SufiCenter.doExitApp, false);
  },

  //----------------------------------------------------------------------------
  doExitApp: function ( ) {

    navigator.geolocation.clearWatch(SufiCenter.watchId);
    console.log('SufiTrail program stopped');
    navigator.app.exitApp();
  }
}


//------------------------------------------------------------------------------
// this way we keep dependencies only to this spot
SufiCenter.init( "SufiTrailMap", menu);
