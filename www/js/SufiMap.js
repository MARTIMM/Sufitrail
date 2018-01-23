/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

// =============================================================================
var SufiMap = {

  // Adaptor/mediator
  center:         null,

  viewport:       { width: 0, height: 0},

  mapElementName: null,
  mapLayers:      [],
  mapView:        null,
  mapVector:      null,
  map:            null,

  style: {
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
    )
  },

  // ---------------------------------------------------------------------------
  init: function ( controller, mapElementName ) {

    this.center = controller;
    this.mapElementName = mapElementName;

    // get the width and height of the viewport. add also an eventlistener.
    // this makes the map adaptable to device sizes as well as landscape to
    // portrait mode changes.
    this.setViewport();
    window.addEventListener(
      'resize',
      function ( e ) {
        SufiMap.setViewport();
      }
    );

    // setup several layers
    this.addLayers();

    // set view to the map
    this.setView();

    //this.addMapFeatures();

    // show the map using layers, view, etc.
    this.setMap();

    // now we can observe changes
    this.center.observers.subscribe( 'gpxFile', SufiTrack, 'loadTrack');
    this.center.observers.subscribe( 'trackBounds', SufiTrack, 'zoomOnTrack');
  },

  // ---------------------------------------------------------------------------
  setViewport: function ( ) {
    this.viewport.width = window.innerWidth;
    this.viewport.height = window.innerHeight;

    //var body = document.getElementById("SufiApp");
    document.body.style.height = this.viewport.height + "px";
    document.body.style.width = this.viewport.width + "px";
  },

  // ---------------------------------------------------------------------------
  addLayers: function ( ) {

    // Take a standard openstreetmap and a tileset  which shows raster and data
    var s1 = new ol.source.OSM();
    this.mapLayers.push(new ol.layer.Tile( { source: s1 } ));
    //this.mapLayers[0].on( 'change:visible', this.layerEvent, this);

    var s2 = new ol.source.TileDebug( {
        projection: 'EPSG:3857',
        tileGrid: s1.getTileGrid()
      }
    );
    this.mapLayers.push(new ol.layer.Tile( { source: s2 } ));
  },

  // ---------------------------------------------------------------------------
  setView: function( ) {

    // This transformation is what I'm looking for. Longitude/Latitude
    // found using Google map of our home.
    this.mapView = new ol.View( {
      center: this.transform( [ 4.632367, 52.390413]),
      zoom: 10
    } );
  },

  // ---------------------------------------------------------------------------
  // return a map control object which places a button '☰' on the map. this
  // button opens a menu.
  openMenuControl: function ( opts ) {

    // note: 'this' is the Control object! When needed use SufiMap.

    // build a control to show on map
    var options = opts || {};
    var openMenuBttn = document.createElement('button');
    openMenuBttn.innerHTML = '&#9776;';
    openMenuBttn.addEventListener(
      "click",
      function ( ) {
        SufiMap.center.menu.openNavigation();
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
    SufiMap.center.menu.closeNavigation();
    return control;
  },

  // ---------------------------------------------------------------------------
  setMap: function ( ) {

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
  },

  // ---------------------------------------------------------------------------
  transform: function ( coordinate ) {

    return ol.proj.transform( coordinate, 'EPSG:4326', 'EPSG:3857');
  },

  // ---------------------------------------------------------------------------
  loadTrack: function ( file ) {

    return SufiTrack.loadTrack(file);
  },

/*
  // ---------------------------------------------------------------------------
  zoomOnTrack: function ( boundaries ) {

    return SufiTrack.zoomOnTrack(boundaries);
  }
*/
}

// =============================================================================
var SufiTrack = {

  loadTrack: function ( file ) {

console.log('Load: ' + file);
    SufiMap.map.removeLayer(SufiMap.vector);
    SufiMap.vector = new ol.layer.Vector( {
        source: new ol.source.Vector( {
            url: file,
            format: new ol.format.GPX()
          }
        ),

        style: function ( feature ) {
          return SufiMap.style['LineString1'];
          // [feature.getGeometry().getType()];
        }
      }
    );

    SufiMap.map.addLayer(SufiMap.vector);
    //SufiCenter.loadXMLFile(file);
  },

  // ---------------------------------------------------------------------------
  // zoom in on the selected track
  zoomOnTrack: function ( boundaries ) {

//console.log("B1: " + boundaries);
    boundaries[0] = SufiMap.transform(boundaries[0]);
    boundaries[1] = SufiMap.transform(boundaries[1]);
/*
console.log("B2: " +
  boundaries[0][0] + ', ' + boundaries[0][1] + ', ' +
  boundaries[1][0] + ', ' + boundaries[1][1]
);
console.log("B3: " + SufiMap.map.getSize());
*/

    SufiMap.mapView.fit( [
        boundaries[0][0], boundaries[0][1],
        boundaries[1][0], boundaries[1][1]
      ], {
        size: SufiMap.map.getSize(),
        // easing: 1000,                     // Needs ol-deps.js and goog libs
        duration: 2000
      }
    );
  }
}

// =============================================================================
var SufiFeature = {
}
