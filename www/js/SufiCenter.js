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

  // ---------------------------------------------------------------------------
  init: function ( mapElementName, menuObject ) {

    // initialize the observers object
    this.observers = new Observer();

    // must be set first: init's might refer to it
    this.menu = menuObject;

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

    // set an event on each of the tracks found in the document
    this.setTrackEvents();

    // do the other initializations
    this.view.init( this, mapElementName);
    this.model.init(this);
  },

  // ---------------------------------------------------------------------------
  // make series of tracks clickable
  setTrackEvents: function ( ) {

    var gpxElement;
    var trackCount = 1;

// TODO generate the html from a directory list
    // each track filename is stored in the data-gpx-file attribute of a 'li'
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
  }
}

// this way we keep dependencies only to this spot
SufiCenter.init( "SufiTrailMap", menu);
