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
    if( SufiData.trackXML !== null ) {

      // Find the track positions in the gpx trail data.
      var points = SufiData.trackXML.documentElement.querySelectorAll(
        'gpx trk trkseg trkpt'
      );

      var currentLongitude = position.coords.longitude;
      var currentLatitude = position.coords.latitude;
      var smallestDiff = 10000;
      var closestPosition = [ ];
      for( var i = 0; i < points.length; i++) {

        var trackLong = points[i].getAttribute('lon');
        var trackLat = points[i].getAttribute('lat');

        // to get the distance on an algabraic grid one uses
        // c = sqrt(a² + b²). on a sphere it is even more complicated.
        // here for the speed only a + b is enaugh to search for the
        // closest distance. when found the distance is calculated using
        // the Haversine formula, a calculation found here
        // https://www.movable-type.co.uk/scripts/latlong.html
        var diffLong = trackLong - currentLongitude;
        var diffLat = trackLat - currentLatitude;

        if( diffLong + diffLat < smallestDiff ) {
/*
console.info(
  'long+lat diffs:' + (diffLong + diffLat) + ' + smallest: ' + smallestDiff
);
*/
          smallestDiff = diffLong + diffLat;
          closestPosition = [ trackLong, trackLat];

/*
console.info(
  'long+lat track:' + trackLong + ', ' + trackLat
);
*/
        }
      }

      if( typeof closestPosition === 'undefined' ) {
        console.warn('undefined closest position should not happen');
      }

      else {
        // use the Haversine formula to calculate the distance to the closest
        // point to the track.
        //
        // φ is latitude, λ is longitude, R is earth’s radius
        // (mean radius = 6371km);
        // note that angles need to be in radians to pass to trig functions!
        var R = 6371e3; // metres
        var φ1 = closestPosition[1] * Math.PI / 100.0;
        var φ2 = currentLatitude * Math.PI / 100.0;
        var Δφ = (closestPosition[1] - currentLatitude) * Math.PI / 100.0;
        var Δλ = (closestPosition[0] - currentLongitude) * Math.PI / 100.0;

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = R * c;

console.warn(
  "Distance between current and closest is " + (d / 1000).toFixed(3) + " km"
);

        if( d > 1000 ) {
          SufiCenter.observers.set(
            'wanderedOffTrack',
            [ closestPosition, [ currentLongitude, currentLatitude]]
          );
        }
      }
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
