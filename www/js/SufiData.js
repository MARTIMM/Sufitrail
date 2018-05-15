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

  // holder for track data
  trackXML:               null,

  // ---------------------------------------------------------------------------
  init: function ( controller ) {
    this.center = controller;
    this.center.observers.subscribe( 'gpxFile', SufiData, 'loadXMLFile');
    this.center.observers.subscribe( 'infoFile', SufiData, 'loadInfoFile');
    this.center.observers.subscribe( 'track', SufiData, 'calculateBounds');
    //this.center.observers.subscribe( 'timeInterval', TrackLocation, 'show');
    this.center.observers.subscribe(
      'currentLocation', SufiData, 'checkWanderingOffTrack'
    );
  },

  // ---------------------------------------------------------------------------
  loadXMLFile: function ( file ) {

    SufiData.timeStart = Date.now();
    var fileRequest = new XMLHttpRequest();
    fileRequest.onreadystatechange = function ( ) {

      // this readystate is when ready loading
      if ( this.readyState === 4 ) {

        // and this when found
        if ( this.status === 200 ) {
          SufiData.center.observers.set( 'track', this.responseXML);

          // save data also for later use
          SufiData.trackXML = this.responseXML;
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

      // this readystate is when ready loading
      if ( this.readyState === 4 ) {

        // and this when found
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
  },

  //----------------------------------------------------------------------------
  // check if hicker wandered too much away from current track
  checkWanderingOffTrack: function ( position ) {

    // check only if there is a track selected
    if SufiData.trackXML !== null {

      // Find the track positions in the gpx trail data.
      var points = xmldoc.documentElement.querySelectorAll(
        'gpx trk trkseg trkpt'
      );

      var currentLongitude = position.coords.longitude;
      var currentLatitude = position.coords.latitude;
      points.forEach( function ( trackPoint ) {

          var trackLong = trackPoint.getAttribute('lon');
          var trackLat = trackPoint.getAttribute('lat');
          
        }
      );

/*
console.log(
  'Location: lon, lat = ' + position.coords.longitude + ', ' +
   position.coords.latitude
 );
    SufiMap.mapFeatures[0].setGeometry(
      new ol.geom.Point(
        SufiMap.transform(
          [ position.coords.longitude, position.coords.latitude]
        )
      )
    );
*/


    }
  }
}
