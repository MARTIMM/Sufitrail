/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

// =============================================================================
var SufiData = {

  // adaptor/mediator
  center:                 null,

  features:               [],

  // temporary load time measurements
  timeStart:              0,

  // ---------------------------------------------------------------------------
  init: function ( controller ) {
    this.center = controller;
    this.center.observers.subscribe( 'gpxFile', SufiData, 'loadXMLFile');
    this.center.observers.subscribe( 'infoFile', SufiData, 'loadInfoFile');
    this.center.observers.subscribe( 'track', SufiData, 'calculateBounds');
    //this.center.observers.subscribe( 'timeInterval', TrackLocation, 'show');
  },

  // ---------------------------------------------------------------------------
  loadXMLFile: function ( file ) {

    SufiData.timeStart = Date.now();
    var fileRequest = new XMLHttpRequest();
    fileRequest.onreadystatechange = function ( ) {
      if ( this.readyState === 4 ) {
        if ( this.status === 200 ) {
          SufiData.center.observers.set( 'track', this.responseXML);
        }

        else {
          console.log(
            "Not Found; Path to file or filename probably spelled wrong"
          );
        }
      }
    }

    fileRequest.open( "GET", file, true);
    fileRequest.send();
  },

  // ---------------------------------------------------------------------------
  loadInfoFile: function ( file ) {

    SufiData.timeStart = Date.now();
    var fileRequest = new XMLHttpRequest();
    fileRequest.onreadystatechange = function ( ) {
      if ( this.readyState === 4 ) {
        if ( this.status === 200 ) {
          var infoText = this.responseText;

          // remove the previous article
          var infoData = document.getElementById("info-data");
          while ( infoData.firstChild ) {
            infoData.removeChild(infoData.firstChild);
          }

          // insert new info text
          infoData.innerHTML = infoText;
        }

        else {
          console.log(
            "Not Found; Path to file or filename probably spelled wrong"
          );
        }
      }
    }

    fileRequest.open( "GET", file, true);
    fileRequest.send();
  },

  //----------------------------------------------------------------------------
  // calculate boundaries of current track
  calculateBounds: function ( xmldoc ) {

    var trackBounds = [ [ 0, 0], [ 0, 0]];

    // Find the boundaries of in the gpx trail. this is also
    // where Garmin stores its data.
    var gpxBounds = xmldoc.documentElement.querySelector('gpx metadata bounds');

    if ( gpxBounds !== null ) {
      trackBounds = [ [
          parseFloat(gpxBounds.getAttribute('minlon')),
          parseFloat(gpxBounds.getAttribute('minlat'))
        ], [
          parseFloat(gpxBounds.getAttribute('maxlon')),
          parseFloat(gpxBounds.getAttribute('maxlat'))
        ]
      ];
    }

    SufiData.center.observers.set( 'trackBounds', trackBounds);
  }
}

/*
// =============================================================================
var TrackLocation = {
  show: function ( count ) {
    console.log( 'track count: ' + count );
  }
}
*/
