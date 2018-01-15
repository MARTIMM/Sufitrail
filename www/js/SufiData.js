/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

// =============================================================================
var SufiData = {

  // Adaptor/mediator
  control:                null,

  features:               [],
  currentXMLTrack:        null,
  currentXMLTrackBounds:  [ 0, 0, 0, 0],
  timeStart:              0,

  // ---------------------------------------------------------------------------
  init: function ( controller ) {
    this.control = controller;
  },

  // ---------------------------------------------------------------------------
  loadXMLFile: function ( file ) {

    DataHandler.loadXMLFile(file);
  }
}

// =============================================================================
var Cache = {
}

// =============================================================================
var DataHandler = {

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
          SufiData.currentXMLTrack = this.responseXML;
          DataHandler.calculateBounds();
          SufiCenter.zoomOnTrack(SufiData.currentXMLTrackBounds);
console.log("Loaded after " + (Date.now() - SufiData.timeStart) + " msec");
        }

        else {
          console.log("Not Found; Path to file or filename probably spelled wrong");
        }
      }
    }

    fileRequest.open( "GET", file, true);
console.log('send... ' + file);
    fileRequest.send();
  },

  //----------------------------------------------------------------------------
  // calculate boundaries of current track
  calculateBounds: function ( ) {

    // Find the extensions in the gpx root
    var gpxExtensions = SufiData.currentXMLTrack.documentElement.querySelector(
      'gpx extensions'
    );

    // get the minima and maxima
    var bottomLeft = SufiCenter.transform( [
        parseFloat(gpxExtensions.querySelector('lon').getAttribute('min')),
        parseFloat(gpxExtensions.querySelector('lat').getAttribute('min')),
      ]
    );

    var topRight = SufiCenter.transform( [
        parseFloat(gpxExtensions.querySelector('lon').getAttribute('max')),
        parseFloat(gpxExtensions.querySelector('lat').getAttribute('max'))
      ]
    );

    SufiData.currentXMLTrackBounds = [
      bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]
    ];
  }
}
