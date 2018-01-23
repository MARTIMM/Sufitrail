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
    this.center.observers.subscribe( 'track', SufiData, 'calculateBounds');
  },

  // ---------------------------------------------------------------------------
  loadXMLFile: function ( file ) {

    SufiData.timeStart = Date.now();
    var fileRequest = new XMLHttpRequest();
    fileRequest.onreadystatechange = function ( ) {
console.log(
  'State: ' + this.readyState + ', ' + this.status + ', ' + this.statusText
);

      if ( this.readyState === 4 ) {
        if ( this.status === 200 ) {
          //SufiData.currentXMLTrack = this.responseXML;
          SufiData.center.observers.set( 'track', this.responseXML);
          //DataHandler.calculateBounds();
          //SufiCenter.zoomOnTrack(SufiData.currentXMLTrackBounds);
//console.log("Loaded after " + (Date.now() - SufiData.timeStart) + " msec");
        }

        else {
          console.log(
            "Not Found; Path to file or filename probably spelled wrong"
          );
        }
      }
    }

    fileRequest.open( "GET", file, true);
//console.log('send... ' + file);
    fileRequest.send();
  },

  //----------------------------------------------------------------------------
  // calculate boundaries of current track
  calculateBounds: function ( xmldoc ) {

    var trackBounds = [ [ 0, 0], [ 0, 0]];

    // Find the boundaries of in the gpx trail. first the Garmin way.
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

    // try to look elsewhere.
    // TODO: program needs adjustments to set the boundaries the same way as
    // for Garmin
    else {
      // Find the extensions in the gpx root
      gpxBounds = xmldoc.documentElement.querySelector('gpx extensions');

      if ( gpxBounds !== null ) {

        trackBounds = [ [
            parseFloat(gpxBounds.querySelector('lon').getAttribute('min')),
            parseFloat(gpxBounds.querySelector('lat').getAttribute('min'))
          ], [
            parseFloat(gpxBounds.querySelector('lon').getAttribute('max')),
            parseFloat(gpxBounds.querySelector('lat').getAttribute('max'))
          ]
        ];
      }
    }
/*
console.log("gpx bounds: " + gpxBounds);
console.log("gpx CXT: " + trackBounds);
*/
    SufiData.center.observers.set( 'trackBounds', trackBounds);
  }
}
