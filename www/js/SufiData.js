/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

// =============================================================================
var SufiData = {

  // Adaptor/mediator
  control:      null,

  features:     [],
  tracks:       [],

  // ---------------------------------------------------------------------------
  init: function ( controller ) {
    this.control = controller;
  }

  // ---------------------------------------------------------------------------

}

// =============================================================================
var Cache = {
}

// =============================================================================
var SufiTrack = {

  // ---------------------------------------------------------------------------
  loadFile: function ( filename ) {

    var gpxTextReq = new XMLHttpRequest();
    gpxTextReq.onreadystatechange = function ( ) {
console.log(
  'State: ' + this.readyState
            + ', ' + this.status
            + ', ' + this.statusText
);

      if ( this.readyState === 4 ) {
        if ( this.status === 200 ) {
          app.trackGpxDom = this.responseXML;
  console.log("Loaded after " + (Date.now() - app.timeStart) + " msec");

          app.scaleAndFocus(app);
        }

        else {
          console.log("Not Found; Path to file or filename probably spelled wrong");
        }
      }
    }

    gpxTextReq.open( "GET", file, true);
console.log('send... ' + file);
    gpxTextReq.send();

  }
}

// =============================================================================
var SufiFeature = {
}
