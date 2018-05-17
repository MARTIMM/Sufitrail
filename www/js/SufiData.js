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
  trackChanged:           false,

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
          SufiData.trackChanged = true;
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
    if( SufiData.trackChanged ) {

      SufiData.trackChanged = false;

      // Find the track positions in the gpx trail data.
      var points = SufiData.trackXML.documentElement.querySelectorAll(
        'gpx trk trkseg trkpt'
      );

      // a tad larger than circumference of earth over equator
      // calculations are in metres
      var shortestLength = 41000000;
      var currentLongitude = position.coords.longitude;
      var currentLatitude = position.coords.latitude;
      var closestPosition = [ ];
      for( var i = 0; i < points.length; i++) {

        var trackLong = parseFloat(points[i].getAttribute('lon'));
        var trackLat = parseFloat(points[i].getAttribute('lat'));

        var d = this.haversine(
          trackLong, trackLat, currentLongitude, currentLatitude
        );

        if( d < shortestLength ) {
          shortestLength = d;
          closestPosition = [ trackLong, trackLat];
        }
      }

      if( typeof closestPosition === 'undefined' ) {
        console.warn('undefined closest position should not happen');
      }

      else {
        var d = this.haversine(
          closestPosition[0], closestPosition[1],
          currentLongitude, currentLatitude
        );

        console.warn(
          "Distance between current and closest is " +
          (d/1000).toFixed(3) + " km"
        );

        // if more than 1 km from closest point on the track, signal
        if( d > 1000 ) {
          SufiCenter.observers.set(
            'wanderedOffTrack',
            [ closestPosition, [ currentLongitude, currentLatitude]]
          );
        }
      }
    }
  },

  //----------------------------------------------------------------------------
  // Haversine formula to calculate the distance between points on earth
  haversine: function ( lon1, lat1, lon2, lat2 ) {

    // φ is latitude, λ is longitude, R is earth’s radius
    // (mean radius = 6371km);
    // note that angles need to be in radians to pass to trig functions!
    var R = 6371e3; // metres
    var φ1 = lat1 * Math.PI / 100.0;
    var φ2 = lat2 * Math.PI / 100.0;
    var Δφ = (lat1 - lat2) * Math.PI / 100.0;
    var Δλ = (lon1 - lon2) * Math.PI / 100.0;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    return d;
  }
}
