/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017, 2018
*/
"use strict";

// =============================================================================
var SufiCenter = {

  // Observers
  observers:        null,

  view:             SufiMap,
  model:            SufiData,
  IO:               SufiIO,

  menu:             null,

  device:           { },
  watchId:          null,
  progressValue:    0,

  // dependencies of html file
  mapElementName:   "sufiTrailMap",
  htmlIdList:       {
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
  },

  externalObjects:  {
    menuObject:           menu,
    observer:             new Observer()
  },

  // ---------------------------------------------------------------------------
  init: function ( ) {

    // initialize the observers object
    this.observers = this.externalObjects["observer"];

    // must be set first: init's might refer to it
    this.menu = this.externalObjects["menuObject"];

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
  },

  // ---------------------------------------------------------------------------
  // after device is ready get the devices state and initialize the
  // other objects.
  onDeviceReady: function ( ) {

    // find the html element objects by its id from the id list
    for( var k in SufiCenter.htmlIdList ) {
      // use hasOwnProperty to filter out keys from the Object.prototype
      if( SufiCenter.htmlIdList.hasOwnProperty(k) ) {
        SufiCenter.htmlIdList[k] = document.getElementById(k);
        console.log( "K: " + k + ', ' + SufiCenter.htmlIdList[k]);
      }

      SufiCenter.displayProgress();
    }


    // which device are we working with
    SufiCenter.device = device;

    // set an event on each of the tracks found in the document
    SufiCenter.setTrackEvents();
    SufiCenter.displayProgress();

    // make the buttons active
    SufiCenter.activateButtons();
    SufiCenter.displayProgress();

    // do the other initializations
    SufiCenter.IO.init(SufiCenter);
    SufiCenter.displayProgress();
    SufiCenter.view.init( SufiCenter, SufiCenter.mapElementName);
    SufiCenter.displayProgress();
    SufiCenter.model.init(SufiCenter);
    SufiCenter.displayProgress();

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
    SufiCenter.displayProgress();

    // Setup geolocation watcher
    SufiCenter.watchGPS();
    SufiCenter.displayProgress();

    // Let any observers know that the device is ready
    //SufiCenter.observers.set( 'deviceReady', true);

    console.log('Initialization complete');

    // show map after splash start screen
    //SufiCenter.menu.showPage('map-page');
    var parent = SufiCenter.htmlIdList["splashScreen"].parentElement;
    parent.removeChild(SufiCenter.htmlIdList["splashScreen"]);
  },

  // ---------------------------------------------------------------------------
  // display initialisation progress
  displayProgress: function ( ) {
    var el = SufiCenter.htmlIdList["progressBar"];
    if( typeof el !== 'undefined' ) {
      SufiCenter.progressValue += 1;
console.log("init value: " + SufiCenter.progressValue);
      //el.value = SufiCenter.progressValue.toString();
      el.style.width = SufiCenter.progressValue.toString() + '%';
    }
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
      SufiCenter.displayProgress();

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

    // button to start, postpone and continue tracking, and save a track.
    SufiCenter.htmlIdList['startTrackButton'].addEventListener(
      "click", this.model.doStartTrack, false
    );
    SufiCenter.displayProgress();

    SufiCenter.htmlIdList['postponeTrackButton'].addEventListener(
      "click", this.model.doPostponeTrack, false
    );
    SufiCenter.displayProgress();

    SufiCenter.htmlIdList['contTrackButton'].addEventListener(
      "click", this.model.doContTrack, false
    );
    SufiCenter.displayProgress();

    SufiCenter.htmlIdList['saveTrackButton'].addEventListener(
      "click", this.model.doSaveTrack, false
    );
    SufiCenter.displayProgress();

    // button to exit the application
    SufiCenter.htmlIdList['exitButton'].addEventListener(
      "click", SufiCenter.doExitApp, false
    );
    SufiCenter.displayProgress();
  },

  //----------------------------------------------------------------------------
  doExitApp: function ( ) {

    navigator.geolocation.clearWatch(SufiCenter.watchId);
    console.log('SufiTrail program stopped');
    navigator.app.exitApp();
  }
}


//------------------------------------------------------------------------------
// start the show
SufiCenter.init();
