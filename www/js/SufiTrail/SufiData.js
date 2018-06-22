/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017, 2018
*/

/**
 * @fileoverview
 */

"use strict";

goog.provide('SufiTrail.SufiData');

/** ============================================================================
  @constructor
*/
SufiTrail.SufiData = function ( ) {

  // adaptor/mediator
  this.center = null;

  this.features = [];

  // holder for track data
  this.trackXML = null;
  this.trackChanged = false;

  // variables used by tracking
  this.trackStarted = false;
  this.trackPostponed = true;

  // min(lon/lat) max(lon/lat)
  this.trackBoundaries = [ [ 360, 360], [ 0, 0]];
  this.trackGps = [ ];
  this.trackDom = null;
}

// ---------------------------------------------------------------------------
SufiTrail.SufiData.prototype.init = function ( center ) {

  this.center = center;
  this.center.observers.subscribe( 'gpxFile', this, 'loadXMLFile');
  this.center.observers.subscribe( 'infoFile', this, 'loadInfoFile');
  this.center.observers.subscribe( 'track', this, 'calculateBounds');
  //this.center.observers.subscribe( 'timeInterval', TrackLocation, 'show');

  this.center.observers.subscribe(
    'currentLocation', this, 'checkWanderingOffTrack'
  );

  this.center.observers.subscribe( 'storedGpxFile', this, 'updateTrackList');
}

// ---------------------------------------------------------------------------
// subscription from gpxFile
SufiTrail.SufiData.prototype.loadXMLFile = function ( file ) {

  var dataobj = this;
  var fileRequest = new XMLHttpRequest();
  fileRequest.onreadystatechange = function ( ) {

    // this readystate is when ready loading
    if ( this.readyState === 4 ) {

      // and this when found
      if ( this.status === 200 ) {
        dataobj.center.observers.set( 'track', this.responseXML);

        // save data also for later use
        dataobj.trackXML = this.responseXML;
        dataobj.trackChanged = true;
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
}

// ---------------------------------------------------------------------------
// subscription from infoFile
SufiTrail.SufiData.prototype.loadInfoFile = function ( file ) {

  var dataobj = this;
  var fileRequest = new XMLHttpRequest();
  fileRequest.onreadystatechange = function ( ) {

    // this readystate is when ready loading
    if ( this.readyState === 4 ) {

      // and this when found
      if ( this.status === 200 ) {
        var infoText = this.responseText;

        // remove the previous article
        var infoData = dataobj.center.htmlIdList["infoData"];
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
}

//----------------------------------------------------------------------------
// subscription from track
// calculate boundaries of current track
SufiTrail.SufiData.prototype.calculateBounds = function ( xmldoc ) {

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

  this.center.observers.set( 'trackBounds', trackBounds);
}

//----------------------------------------------------------------------------
// subscription from currentLocation
// check if hiker wandered too much away from current track
SufiTrail.SufiData.prototype.checkWanderingOffTrack = function ( position ) {

  // check only if there is a track selected
  if( this.trackChanged ) {

    this.trackChanged = false;

    // Find the track positions in the gpx trail data.
    var points = this.trackXML.documentElement.querySelectorAll(
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
}

//----------------------------------------------------------------------------
// Haversine formula to calculate the distance between points on earth
SufiTrail.SufiData.prototype.haversine = function ( lon1, lat1, lon2, lat2 ) {

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

//----------------------------------------------------------------------------
SufiTrail.SufiData.prototype.doStartTrack = function ( ) {

  if( this.trackStarted ) {
    //console.log("Track already started, save before starting a new one");
    this.center.htmlIdList['statusMessage'].innerHTML =
      "Track already started, save before starting a new one";
  }

  else {
    this.trackStarted = true;
    this.trackPostponed = false;
    //console.log("Track is started");
    this.center.htmlIdList['statusMessage'].innerHTML =
      "Tracking is started";

    this.center.observers.subscribe( 'currentLocation', this, 'trackLocation');
  }
}

//----------------------------------------------------------------------------
SufiTrail.SufiData.prototype.doSaveTrack = function ( ) {

  if( this.trackStarted ) {
    //console.log("Track saved");
    this.trackStarted = false;
    this.trackPostponed = true;

    this.center.observers.unsubscribe(
      'currentLocation', this, 'trackLocation'
    );

    this.saveTrack();
    this.center.htmlIdList['statusMessage'].innerHTML = "Track saved";
  }

  else {
    //console.log("No track started, nothing to save");
    this.center.htmlIdList['statusMessage'].innerHTML =
      "Tracking not started, nothing to save";
  }
}

//----------------------------------------------------------------------------
SufiTrail.SufiData.prototype.doPostponeTrack = function ( ) {

  if( this.trackStarted ) {
    if( this.trackPostponed ) {
      //console.log("Track is already stopped temporarely");
      this.center.htmlIdList['statusMessage'].innerHTML =
        "Tracking is already postponed";
    }

    else {
      //console.log("Track temporarely stopped");
      this.center.htmlIdList['statusMessage'].innerHTML =
        "Tracking is postponed";
      this.trackPostponed = true;

      this.center.observers.unsubscribe(
        'currentLocation', this, 'trackLocation'
      );
    }
  }

  else {
    console.log("No track started, cannot stop");
    this.center.htmlIdList['statusMessage'].innerHTML =
      "Tracking not started, cannot postpone";
  }
}

//----------------------------------------------------------------------------
SufiTrail.SufiData.prototype.doContTrack = function ( ) {

  if( this.trackStarted ) {
    if( this.trackPostponed ) {
      this.center.htmlIdList['statusMessage'].innerHTML =
        "Continue tracking";
      this.trackPostponed = false;

      this.center.observers.subscribe(
        'currentLocation', this, 'trackLocation'
      );
    }

    else {
      this.center.htmlIdList['statusMessage'].innerHTML =
        "Tracking already continued";
    }
  }

  else {
    this.center.htmlIdList['statusMessage'].innerHTML =
      "No track started, cannot continue";
  }
}

//----------------------------------------------------------------------------
// subscription from currentLocation
SufiTrail.SufiData.prototype.trackLocation = function ( position ) {

  var lon = position.coords.longitude;
  var lat = position.coords.latitude;

console.log("Store track GPS: " + lon + ", " + lat);
  // save location
  this.trackGps.push( [ lon, lat]);
//TODO add elevation as 3rd item
//TODO add time as 4th item

  // change bounding box
  if( this.trackBoundaries[0][0] > lon ) {
    this.trackBoundaries[0][0] = lon;
  }

  if( this.trackBoundaries[0][1] > lat ) {
    this.trackBoundaries[0][1] = lat;
  }

  if( this.trackBoundaries[1][0] < lon ) {
    this.trackBoundaries[1][0] = lon;
  }

  if( this.trackBoundaries[1][1] < lat ) {
    this.trackBoundaries[1][1] = lat;
  }

  // show on map
}

//----------------------------------------------------------------------------
SufiTrail.SufiData.prototype.saveTrack = function ( ) {

  this.mkTrackXml();

  // signal filename to key 'storedGpxFile'
  this.saveTrackXml('storedGpxFile');
}

//TODO
// Show track in layer on map
// Send to site, url with username

//----------------------------------------------------------------------------
// called by observer key 'storedGpxFile'
SufiTrail.SufiData.prototype.updateTrackList = function ( absFilename ) {

  // Extend user track list
  var doc = document.implementation.createDocument( "", "", null);

  var ul = this.center.htmlIdList["userTrackList"];
  var li = doc.createElement('li');
  var a = doc.createElement('a');
  a.innerHTML = "track " + filename;
  li.appendElement(a);
  ul.appendElement(li);
}

//----------------------------------------------------------------------------
// convert data to xml dom tree
SufiTrail.SufiData.prototype.mkTrackXml = function ( ) {
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
  me.setAttribute( 'minlon', this.trackBoundaries[0][0]);
  me.setAttribute( 'minlat', this.trackBoundaries[0][1]);
  me.setAttribute( 'maxlon', this.trackBoundaries[1][0]);
  me.setAttribute( 'maxlat', this.trackBoundaries[1][1]);

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

  for( var i = 0; i < this.trackGps.length; i++) {
    var tse = doc.createElement('trkseg');
    ts.appendChild(tse);
    tse.setAttribute( 'lon', this.trackGps[i][0]);
    tse.setAttribute( 'lat', this.trackGps[i][1]);
  }

  this.trackDom = doc;
}

//----------------------------------------------------------------------------
// save xml dom tree to storage
// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html
SufiTrail.SufiData.prototype.saveTrackXml = function ( observerKey ) {

  var s = new XMLSerializer();
  var xmlString = s.serializeToString(this.trackDom);
/*
console.log(xmlString);
console.log(cordova.file);
console.log(cordova.file.dataDirectory);
*/

console.log("Date and time: " + Date.now.toISOString);
  var filename = "userTrack-" + Date.now.toISOString + ".gpx";
  this.center.SufiIO.writeRequest( filename, xmlString, observerKey);

  return filename;
}
