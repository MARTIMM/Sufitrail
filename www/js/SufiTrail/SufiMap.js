/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

goog.provide('SufiTrail.SufiMap');

/** ============================================================================
  @constructor
*/
SufiTrail.SufiMap = function ( ) {

  // Adaptor/mediator
  this.center = null;
  this.track = new SufiTrail.SufiTrack();

  this.viewport = { width: 0, height: 0};

  this.mapElementName = null;
  this.mapLayers = [];
  this.mapView = null;
  this.mapFeatures = [];
  this.mapVector = null;
  this.map = null;
  this.movedOnceToCurrent = false;


  this.style = {
    'Point': new ol.style.Style( {
        image: new ol.style.Circle( {
            fill:     new ol.style.Fill(
              { color: 'rgba(255,255,0,0.4)'}
            ),
            radius:   5,
            stroke:   new ol.style.Stroke( {
                color: '#ff0',
                width: 1
              }
            )
          }
        )
      }
    ),

    'LineString1': new ol.style.Style( {
        stroke: new ol.style.Stroke( {
            color: '#a48',
            width: 4
          }
        )
      }
    ),

    'LineString2': new ol.style.Style( {
        stroke: new ol.style.Stroke( {
            color: '#0f0',
            width: 4
          }
        )
      }
    ),

    'GPSLocation': new ol.style.Style( {
        image: new ol.style.Circle( {
            radius: 9,
            //fill: new ol.style.Fill({ color: '#3399CC'}),
            //stroke: new ol.style.Stroke({ color: '#a50', width: 10})
            stroke: new ol.style.Stroke({ color: '#3399CC', width: 4})
          }
        )
      }
    ),

    'GPSLineToTrack': new ol.style.Style( {
        stroke: new ol.style.Stroke( {
            color: '#0a5',
            width: 4,
            lineDash: [8,6,2,6]
          }
        )
      }
    )
  };
}



// ---------------------------------------------------------------------------
SufiTrail.SufiMap.prototype.init = function ( controller, mapElementName ) {

  this.center = controller;
  this.mapElementName = mapElementName;

  var mapobj = this;

  // get the width and height of the viewport. add also an eventlistener.
  // this makes the map adaptable to device sizes as well as landscape to
  // portrait mode changes.
  this.setViewport();
  window.addEventListener(
    'resize',
    function ( e ) {
      mapobj.setViewport();
    }
  );

  this.track = new SufiTrail.SufiTrack();
  this.track.init( this, this.center);

  // setup features to show in a separate layer. this layer is added in
  // function addLayer() below.
  this.addMapFeatures();

  // setup several layers
  this.addLayers();

  // set view to the map
  this.setView();

  // show the map using layers, view, etc.
  this.setMap();

  // now we can observe changes
  this.center.observers.subscribe(
    'currentLocation', this, 'showLocation'
  );
}

// ---------------------------------------------------------------------------
SufiTrail.SufiMap.prototype.setViewport = function ( ) {
  this.viewport.width = window.innerWidth;
  this.viewport.height = window.innerHeight;

  //var body = document.getElementById("SufiApp");
  document.body.style.height = this.viewport.height + "px";
  document.body.style.width = this.viewport.width + "px";
}

// ---------------------------------------------------------------------------
// See also https://openlayers.org/en/latest/examples/icon-color.html
SufiTrail.SufiMap.prototype.addMapFeatures = function ( ) {

  // feature [0]: create feature to show current position
  var feature = new ol.Feature( {
      name: 'current GPS location',
      dataLocation: "This is where you are now!"
    }
  );

  feature.setStyle(this.style['GPSLocation']);
  this.mapFeatures.push(feature);


  // feature[1]: create feature to show line when off track
  feature = new ol.Feature( {
      name: 'off track line',
      dataLocation: "Off track!"
    }
  );

  feature.setStyle(this.style['GPSLineToTrack']);
  this.mapFeatures.push(feature);

  // add features to a map vector
  this.mapVector = new ol.source.Vector( { features: this.mapFeatures});
}

// ---------------------------------------------------------------------------
SufiTrail.SufiMap.prototype.addLayers = function ( ) {

  // Take a standard openstreetmap and a tileset  which shows raster and data
  var s1 = new ol.source.OSM();
  this.mapLayers.push(new ol.layer.Tile( { source: s1 } ));
  //this.mapLayers[0].on( 'change:visible', this.layerEvent, this);

  // this layer is an overlay and temporary. it helped to find the proper tile
  var s2 = new ol.source.TileDebug( {
      projection: 'EPSG:3857',
      tileGrid: s1.getTileGrid()
    }
  );
  this.mapLayers.push(new ol.layer.Tile( { source: s2 } ));

  this.mapLayers.push(new ol.layer.Vector( { source: this.mapVector } ));
}

// ---------------------------------------------------------------------------
SufiTrail.SufiMap.prototype.setView = function ( ) {

  // This transformation is what I'm looking for. Longitude/Latitude
  // found using Google map of our home.
  this.mapView = new ol.View( {
    //center: this.transform( [ 4.632367, 52.390413]),
    center: this.transform( [ 4.0, 50.0]),
    zoom: 10
  } );
}

// ---------------------------------------------------------------------------
// return a map control object which places a button '☰' on the map. this
// button opens a menu.
SufiTrail.SufiMap.prototype.openMenuControl = function ( opts ) {

  // note: 'this' is the Control object! When needed use SufiMap.
  var mapobj = this;

  // build a control to show on map
  var options = opts || {};
  var openMenuBttn = document.createElement('button');
  openMenuBttn.innerHTML = '&#9776;';
  openMenuBttn.addEventListener(
    "click",
    function ( ) {
      mapobj.center.menu.openNavigation();
    }
  );

  // ol-unselectable and ol-control are classes defined in ol.css.
  // open-menu is defined in index.html which positiones the widget
  // to the right just below the north arrow.
  var buttonContainer = document.createElement('div');
  buttonContainer.className = 'open-menu ol-unselectable ol-control';
  buttonContainer.appendChild(openMenuBttn);

  // control object needs 'this' to refer to the Control object
  var control = new ol.control.Control( {
      element: buttonContainer,
      target: options.target
    }
  );

  // let the control object be a child object of ol.control.Control class
  // does not seem to be needed ...
  ol.inherits( control, ol.control.Control);

  // be sure the menu is closed, then return control object
  mapobj.center.menu.closeNavigation();
  return control;
}

// ---------------------------------------------------------------------------
SufiTrail.SufiMap.prototype.setMap = function ( ) {

  this.map = new ol.Map( {
      target:       this.mapElementName,
      layers:       this.mapLayers,
      view:         this.mapView,
      controls:     [
        new ol.control.Zoom(),

        new ol.control.Rotate( {
            autoHide: false
          }
        ),

        new ol.control.Attribution( {
            collapsible: true,
            collapsed: false,
            label: 'O',
            collapselabel: '»'
          }
        ),

        this.openMenuControl()
      ]
    }
  );
console.log("Map drawn");
/*
  this.map.on(
    'change',
    function ( ) {
      console.log("Map change");
    }
  );
*/
}

// ---------------------------------------------------------------------------
// show current GPS location
SufiTrail.SufiMap.prototype.showLocation = function ( position ) {

/*
console.log(
'Location: lon, lat = ' + position.coords.longitude + ', ' +
 position.coords.latitude
);
*/
  var lon = position.coords.longitude;
  var lat = position.coords.latitude;
  this.mapFeatures[0].setGeometry(
    new ol.geom.Point( this.transform( [ lon, lat]) )
  );

  var box = [];
  box[0] = this.transform([ lon - 0.05, lat - 0.05]);
  box[1] = this.transform([ lon + 0.05, lat + 0.05]);
  if( !this.movedOnceToCurrent ) {
    this.movedOnceToCurrent = true;
    this.mapView.fit( [
        box[0][0], box[0][1], box[1][0], box[1][1]
      ], {
        size: this.map.getSize()
      }
    );
  }
}

// ---------------------------------------------------------------------------
SufiTrail.SufiMap.prototype.transform = function ( coordinate ) {

  return ol.proj.transform( coordinate, 'EPSG:4326', 'EPSG:3857');
}

// =============================================================================
SufiTrail.SufiTrack = function ( ) {

  this.map = null;
  this.center = null;
}

// ---------------------------------------------------------------------------
SufiTrail.SufiTrack.prototype.init = function ( map, center ) {

  this.SufiMap = map;
  this.center = center;

  this.center.observers.subscribe( 'gpxFile', this, 'loadTrack');
  this.center.observers.subscribe( 'trackBounds', this, 'zoomOnTrack');
  this.center.observers.subscribe( 'wanderedOffTrack', this, 'showOffTrack');
}

// ---------------------------------------------------------------------------
// function to display track data using ol lib
SufiTrail.SufiTrack.prototype.loadTrack = function ( file ) {

console.log('Load: ' + file);
  this.SufiMap.map.removeLayer(this.SufiMap.vector);
  this.SufiMap.vector = new ol.layer.Vector( {
      source: new ol.source.Vector( {
          url: file,
          format: new ol.format.GPX()
        }
      ),

      style: this.SufiMap.style['LineString1']
    }
  );

  this.SufiMap.map.addLayer(SufiMap.vector);
  //SufiCenter.loadXMLFile(file);
}

// ---------------------------------------------------------------------------
// zoom in on the selected track
SufiTrail.SufiTrack.prototype.zoomOnTrack = function ( boundaries ) {

  boundaries[0] = this.SufiMap.transform(boundaries[0]);
  boundaries[1] = this.SufiMap.transform(boundaries[1]);

  this.SufiMap.mapView.fit( [
      boundaries[0][0], boundaries[0][1],
      boundaries[1][0], boundaries[1][1]
    ], {
      size: this.SufiMap.map.getSize() //,
      // easing: 1000,                    // Needs ol-deps.js and goog libs
      // duration: 10000                  // Does not show map while moving
    }
  );
}


// ---------------------------------------------------------------------------
// show line from current location to track
SufiTrail.SufiTrack.prototype.showOffTrack = function ( lineCoords ) {
console.log("draw line from " + lineCoords[1] + " to " + lineCoords[0]);

  var pointOnTrack = this.SufiMap.transform(lineCoords[0]);
  var currentLocation = this.SufiMap.transform(lineCoords[1]);
//console.log("line " + currentLocation + " to " + pointOnTrack);

  this.SufiMap.mapFeatures[1].setGeometry(
    new ol.geom.LineString(
      //[ currentLocation, [pointOnTrack[0], -pointOnTrack[1]] ]
      [ currentLocation, pointOnTrack ]
    )
  );
}

// =============================================================================
SufiTrail.SufiFeature = function ( ) {

}
