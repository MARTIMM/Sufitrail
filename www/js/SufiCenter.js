/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

// =============================================================================
var SufiCenter = {

  view:             SufiMap,
  model:            SufiData,

  menu:             null,
  networkOnline:    false,

  // ---------------------------------------------------------------------------
  init: function ( mapElementName, menuObject ) {

    // must be set first: init's might refer to it
    this.menu = menuObject;

    // check for online
    this.checkNetworkState();
    window.addEventListener(
      'offline', function ( ) { SufiCenter.checkNetworkState(); }
    );
    window.addEventListener(
      'online', function ( ) { SufiCenter.checkNetworkState(); }
    );

    // set an event on each of the tracks found in the document
    this.setTrackEvents();

//console.log(this.networkOnline);
    // do te other initializations
    this.view.init( this, mapElementName);
    this.model.init(this);
  },

  // ---------------------------------------------------------------------------
  checkNetworkState: function ( ) {
    this.networkOnline = navigator.onLine;
  },

  // ---------------------------------------------------------------------------
  // make series of tracks clickable
  setTrackEvents: function ( ) {

    var gpxElement;
    var trackCount = 1;

    // each track filename is stored in the data-gpx-file attribute of a 'li'
    // element. This element can be found through its id starting with track
    // followed by a number. E.g. track1.
    while ( gpxElement = document.querySelector('#track' + trackCount) ) {

      // get the filename from the data attribute
      var gpxFile = gpxElement.getAttribute('data-gpx-file');
console.log('set handler for track' + trackCount + ' ' + gpxFile);
      trackCount++;

      // define a function returning a handler which shows a track and
      // focus as well as fits the track on screen
      function loadTrack ( trackFile ) {
        return function ( ) {
/*
          // create a mouse event to simulate a click on the first entry
          // of the menu. This shows the map again
          var evt = new MouseEvent(
            "click", {
              bubbles: true,
              cancelable: false,
              view: window
            }
          );

          // close menu
          //SufiCenter.menu.closeNavigator();
*/
          // show map again
          SufiCenter.menu.showPage('map-page');

          // TODO there is only an event on the first entry, how does this work
          // to switch from one page to an other page?
//          document.querySelector('div#tabpane ul li').dispatchEvent(evt);

console.log('load track from ' + trackFile);
          // use the defined function to center and fit on this particular file
          SufiCenter.view.loadTrack(trackFile);
        };
      }

      // set a click handler on the li element to close the menu and
      // to show the map again.
      gpxElement.addEventListener( "click", loadTrack(gpxFile));
    }
  },

  // ---------------------------------------------------------------------------
  // direct request to SufiData
  loadXMLFile: function ( file ) {

    SufiData.loadXMLFile(file);
  },

  // ---------------------------------------------------------------------------
  // direct request to SufiMap
  zoomOnTrack: function ( boundaries ) {

    SufiMap.zoomOnTrack(boundaries);
  },
}

// this way we keep dependencies only to this spot
SufiCenter.init( "SufiTrailMap", menu);
