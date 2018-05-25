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

      if( typeof closestPosition === 'undefined' ) {
        console.log('undefined closest position: should not happen');
      }

      else {
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
  trackTempStopped: true,
  trackBoundaries: [ [ 360, 360], [ 0, 0]], // min(lon/lat) max(lon/lat)
  trackGps: [ ],
  trackDom: null,

  //----------------------------------------------------------------------------
  doStartTrack: function ( ) {

    if( SufiData.trackStarted ) {
      console.log("Track already started, save before starting a new one");
    }

    else {
      SufiData.trackStarted = true;
      SufiData.trackTempStopped = false;
      console.log("Track is started");

      SufiData.center.observers.subscribe(
        'currentLocation', SufiData, 'trackLocation'
      );
    }
  },

  //----------------------------------------------------------------------------
  doSaveTrack: function ( ) {

    if( SufiData.trackStarted ) {
      console.log("Track saved");
      SufiData.trackStarted = false;
      SufiData.trackTempStopped = true;

      SufiData.center.observers.unsubscribe(
        'currentLocation', SufiData, 'trackLocation'
      );

      SufiData.saveTrack();
    }

    else {
      console.log("No track started, nothing to save");
    }
  },

  //----------------------------------------------------------------------------
  doStopTrack: function ( ) {

    if( SufiData.trackStarted ) {
      if( SufiData.trackTempStopped ) {
        console.log("Track is already stopped temporarely");
      }

      else {
        console.log("Track temporarely stopped");
        SufiData.trackTempStopped = true;

        SufiData.center.observers.unsubscribe(
          'currentLocation', SufiData, 'trackLocation'
        );
      }
    }

    else {
      console.log("No track started, cannot stop");
    }
  },

  //----------------------------------------------------------------------------
  doContTrack: function ( ) {

    if( SufiData.trackStarted ) {
      if( SufiData.trackTempStopped ) {
        console.log("Continue tracking");
        SufiData.trackTempStopped = false;

        SufiData.center.observers.subscribe(
          'currentLocation', SufiData, 'trackLocation'
        );
      }

      else {
        console.log("Tracking already continued");
      }
    }

    else {
      console.log("No track started, cannot continue");
    }
  },

  //----------------------------------------------------------------------------
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
    SufiData.saveTrackXml();

    // Send to site, url with username
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
  // save xml dom tree to
  // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html
  saveTrackXml: function ( ) {

    var s = new XMLSerializer();
    var xmlString = s.serializeToString(SufiData.trackDom);
console.log(xmlString);
console.log(cordova.file);
console.log(cordova.file.dataDirectory);



    window.requestFileSystem(
      LocalFileSystem.PERSISTENT,
      0,
      function ( fs ) {
console.log('file system open: ' + fs.name);
        fs.root.getFile(
          "u.gpx",
          { create: true, exclusive: false },
          function ( fileEntry ) {
console.log("fileEntry is file?: " + fileEntry.isFile.toString());
            // fileEntry.name == 'someFile.txt'
            // fileEntry.fullPath == '/someFile.txt'
console.log("full path: " + fileEntry.fullPath);
            SufiData.writeFile( fileEntry, xmlString);

          },
          // onErrorCreateFile
          function ( e ) {
            console.log("ECF: " + e.keys() + ', ' + e.toString());
          }
        );

      },
      // onErrorLoadFs
      function ( e ) {
        console.log("ELF: " + e.keys() + ', ' + e.toString());
      }
    );


/*
    var file = new File(
      [xmlString], "./user-tracks/u.gpx", {type: "application/gpx+xml"}
    );

console.log('File: ' + file.keys);
*/
/*
    window.resolveLocalFileSystemURL(
      'file:///Downloads',
      function( dir ) {
console.log("got main dir: " + dir);
  		  dir.getFile(
          '/u.gpx',
          {create: true},
          function ( file ) {
console.log("got the file" + file);
            file.createWriter(
              function ( fileWriter ) {
                var blob = new Blob(
                  [xmlString],
                  {type: 'application/gpx+xml'}
                );

                fileWriter.write(blob);
console.log("GPX text written");
              }, fail
            );
          }
        );
      }
    );
*/
/*
    var file = new File(
      [xmlString], "./user-tracks/u.gpx", {type: "application/gpx+xml"}
    );
    var stream = nsIScriptableIO.newOutputStream( file, "text");
    stream.writeString(xmlString);
    stream.close();
*/
  },

  //----------------------------------------------------------------------------
  writeFile: function ( fileEntry, dataText ) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter( function (fileWriter) {
        fileWriter.onwriteend = function() {
          console.log("Successful file write...");
          SufiData.readFile(fileEntry);
        };

        fileWriter.onerror = function (e) {
          console.log("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if( dataText ) {
          dataText = new Blob(
            [ dataText ],
            { type: 'text/plain' }
          );
        }

        else {
          dataText = new Blob(
            ['some file data'],
            { type: 'text/plain' }
          );
        }

        fileWriter.write(dataText);
      }
    );
  },

  //----------------------------------------------------------------------------
  readFile: function ( fileEntry ) {

    fileEntry.file( function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
          console.log("Successful file read: " + this.result);
          console.log(fileEntry.fullPath + ": " + this.result);
        };

        reader.readAsText(file);

      },

      // onErrorReadFile
      function ( e ) { console.log(e.toString); }
    );
  }
}
