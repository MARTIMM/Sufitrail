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
  //timeStart:              0,

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

    SufiData.center.observers.subscribe(
      'storedGpxFile', SufiData, 'updateTrackList'
    );
  },

  // ---------------------------------------------------------------------------
  // subscription from gpxFile
  loadXMLFile: function ( file ) {

    //SufiData.timeStart = Date.now();
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
  // subscription from infoFile
  loadInfoFile: function ( file ) {

    //SufiData.timeStart = Date.now();
    var fileRequest = new XMLHttpRequest();
    fileRequest.onreadystatechange = function ( ) {

      // this readystate is when ready loading
      if ( this.readyState === 4 ) {

        // and this when found
        if ( this.status === 200 ) {
          var infoText = this.responseText;

          // remove the previous article
          var infoData = SufiData.center.htmlIdList["infoData"];
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
  // subscription from track
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
  // subscription from currentLocation
  // check if hiker wandered too much away from current track
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
console.log('New cl: ' + currentLongitude + ', ' + currentLatitude);
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

      var d = this.haversine(
        closestPosition[0], closestPosition[1],
        currentLongitude, currentLatitude
      );

      console.log(
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
  },

  //----------------------------------------------------------------------------
  // variables used by tracking
  trackStarted: false,
  trackPostponed: true,
  trackBoundaries: [ [ 360, 360], [ 0, 0]], // min(lon/lat) max(lon/lat)
  trackGps: [ ],
  trackDom: null,

  //----------------------------------------------------------------------------
  doStartTrack: function ( ) {

    if( SufiData.trackStarted ) {
      //console.log("Track already started, save before starting a new one");
      SufiData.center.htmlIdList['statusMessage'].innerHTML =
        "Track already started, save before starting a new one";
    }

    else {
      SufiData.trackStarted = true;
      SufiData.trackPostponed = false;
      //console.log("Track is started");
      SufiData.center.htmlIdList['statusMessage'].innerHTML =
        "Tracking is started";

      SufiData.center.observers.subscribe(
        'currentLocation', SufiData, 'trackLocation'
      );
    }
  },

  //----------------------------------------------------------------------------
  doSaveTrack: function ( ) {

    if( SufiData.trackStarted ) {
      //console.log("Track saved");
      SufiData.trackStarted = false;
      SufiData.trackPostponed = true;

      SufiData.center.observers.unsubscribe(
        'currentLocation', SufiData, 'trackLocation'
      );

      SufiData.saveTrack();
      SufiData.center.htmlIdList['statusMessage'].innerHTML = "Track saved";
    }

    else {
      //console.log("No track started, nothing to save");
      SufiData.center.htmlIdList['statusMessage'].innerHTML =
        "Tracking not started, nothing to save";
    }
  },

  //----------------------------------------------------------------------------
  doPostponeTrack: function ( ) {

    if( SufiData.trackStarted ) {
      if( SufiData.trackPostponed ) {
        //console.log("Track is already stopped temporarely");
        SufiData.center.htmlIdList['statusMessage'].innerHTML =
          "Tracking is already postponed";
      }

      else {
        //console.log("Track temporarely stopped");
        SufiData.center.htmlIdList['statusMessage'].innerHTML =
          "Tracking is postponed";
        SufiData.trackPostponed = true;

        SufiData.center.observers.unsubscribe(
          'currentLocation', SufiData, 'trackLocation'
        );
      }
    }

    else {
      console.log("No track started, cannot stop");
      SufiData.center.htmlIdList['statusMessage'].innerHTML =
        "Tracking not started, cannot postpone";
    }
  },

  //----------------------------------------------------------------------------
  doContTrack: function ( ) {

    if( SufiData.trackStarted ) {
      if( SufiData.trackPostponed ) {
        SufiData.center.htmlIdList['statusMessage'].innerHTML =
          "Continue tracking";
        SufiData.trackPostponed = false;

        SufiData.center.observers.subscribe(
          'currentLocation', SufiData, 'trackLocation'
        );
      }

      else {
        SufiData.center.htmlIdList['statusMessage'].innerHTML =
          "Tracking already continued";
      }
    }

    else {
      SufiData.center.htmlIdList['statusMessage'].innerHTML =
        "No track started, cannot continue";
    }
  },

  //----------------------------------------------------------------------------
  // subscription from currentLocation
  trackLocation: function ( position ) {

    var lon = position.coords.longitude;
    var lat = position.coords.latitude;

console.log("Store track GPS: " + lon + ", " + lat);
    // save location
    SufiData.trackGps.push( [ lon, lat]);
//TODO add elevation as 3rd item
//TODO add time as 4th item

    // change bounding box
    if( SufiData.trackBoundaries[0][0] > lon ) {
      SufiData.trackBoundaries[0][0] = lon;
    }

    if( SufiData.trackBoundaries[0][1] > lat ) {
      SufiData.trackBoundaries[0][1] = lat;
    }

    if( SufiData.trackBoundaries[1][0] < lon ) {
      SufiData.trackBoundaries[1][0] = lon;
    }

    if( SufiData.trackBoundaries[1][1] < lat ) {
      SufiData.trackBoundaries[1][1] = lat;
    }

    // show on map
  },

  //----------------------------------------------------------------------------
  saveTrack: function ( ) {

    SufiData.mkTrackXml();

    // signal filename to key 'storedGpxFile'
    SufiData.saveTrackXml('storedGpxFile');
  },

//TODO
// Show track in layer on map
// Send to site, url with username

  //----------------------------------------------------------------------------
  // called by observer key 'storedGpxFile'
  updateTrackList: function ( absFilename ) {

    // Extend user track list
    var doc = document.implementation.createDocument( "", "", null);

    var ul = SufiData.center.htmlIdList["userTrackList"];
    var li = doc.createElement('li');
    var a = doc.createElement('a');
    a.innerHTML = "track " + filename;
    li.appendElement(a);
    ul.appendElement(li);
  },

  //----------------------------------------------------------------------------
  // convert data to xml dom tree
  mkTrackXml: function ( ) {
    var doc = document.implementation.createDocument( "", "", null);

    // root element and attributes
    var g = doc.createElement('gpx');
    doc.appendChild(g);
    g.setAttribute( 'xsi:schemaLocation', 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd');
    g.setAttribute( 'xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    g.setAttribute( 'version', '1.1');
    g.setAttribute( 'creator', 'Sufi Trail App');
    g.setAttribute( 'xmlns', 'http://www.topografix.com/GPX/1/1');

    // metadata section
    var m = doc.createElement('metadata');
    g.appendChild(m);

    var me = doc.createElement('link');
    m.appendChild(me);
    me.setAttribute( 'href', 'http://www.sufitrail.com/');
    me.innerHtml = 'Sufi Train Personal Hike';

    me = doc.createElement('keywords');
    m.appendChild(me);
    me.innerHtml = 'Istanbul,Konya,Totaal,Turkije,hike';

    me = doc.createElement('copyright');
    m.appendChild(me);
    me.innerHtml = 'Sufi Trail';

    me = doc.createElement('author');
    m.appendChild(me);
    me.innerHtml = 'Hiker';
//TODO name of user must be known

    me = doc.createElement('description');
    m.appendChild(me);
    me.innerHtml = 'Personally walked track along the Sufi Trail';

    me = doc.createElement('name');
    m.appendChild(me);
    me.innerHtml = 'Some name set to the gpx route';
//TODO some other personalization thingy

    me = doc.createElement('time');
    m.appendChild(me);
    me.innerHtml = (new Date).toISOString();

    me = doc.createElement('bounds');
    m.appendChild(me);
    me.setAttribute( 'minlon', SufiData.trackBoundaries[0][0]);
    me.setAttribute( 'minlat', SufiData.trackBoundaries[0][1]);
    me.setAttribute( 'maxlon', SufiData.trackBoundaries[1][0]);
    me.setAttribute( 'maxlat', SufiData.trackBoundaries[1][1]);

    // track segments
    var t = doc.createElement('trk');
    g.appendChild(t);
    var n = doc.createElement('name');
    t.appendChild(n);
//TODO some other personalization thingy
//TODO add tracks to the same file?
    n.innerHtml = 'Some name set to the gpx route segment';

    var ts = doc.createElement('trkseg');
    t.appendChild(ts);

    for( var i = 0; i < SufiData.trackGps.length; i++) {
      var tse = doc.createElement('trkseg');
      ts.appendChild(tse);
      tse.setAttribute( 'lon', SufiData.trackGps[i][0]);
      tse.setAttribute( 'lat', SufiData.trackGps[i][1]);
    }

    SufiData.trackDom = doc;
  },

  //----------------------------------------------------------------------------
  // save xml dom tree to storage
  // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html
  saveTrackXml: function ( observerKey ) {

    var s = new XMLSerializer();
    var xmlString = s.serializeToString(SufiData.trackDom);
/*
console.log(xmlString);
console.log(cordova.file);
console.log(cordova.file.dataDirectory);
*/

console.log("Date and time: " + Date.now.toISOString);
    var filename = "userTrack-" + Date.now.toISOString + ".gpx";
    SufiData.center.IO.writeRequest( filename, xmlString, observerKey);

    return filename;
  },
}
