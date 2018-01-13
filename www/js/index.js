/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
//use strict;

//goog.provide('SufitrailMobileApp');


// Application object
var SufiTrailMobileApp = {

  // ==========================================================================
  mapLayers:      [],
  mapVector:      '',
  mapFeatures:    [],
  mapView:        '',
  map:            '',
  geolocation:    '',
  count:          0,
  viewportSize:   { width: 0, height: 0},
  openMenuBttn:   '',


  //sufiTrailTrackGpx: './tracks/zandvoort 2016-05-17_12-58_Tue.gpx',
  trackGpxDom:    null,

  // ==========================================================================
  vector: null,
  /*
  new ol.layer.Vector( {
      source: new ol.source.Vector( {
          url: './tracks/zandvoort 2016-05-17_12-58_Tue.gpx',
          format: new ol.format.GPX()
        }
      )
    }
  ),
  */

  // ==========================================================================
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
    'LineString': new ol.style.Style( {
        stroke: new ol.style.Stroke( {
            color: '#a48',
            width: 4
          }
        )
      }
    ),
    'MultiLineString': new ol.style.Style( {
        stroke: new ol.style.Stroke( {
            color: '#0f0',
            width: 4
          }
        )
      }
    )
  },

  // ==========================================================================
  exitButton: function ( e ) {

    if ( typeof cordova !== 'undefined' ) {
      // Deprecated
      if ( navigator.app ) {
        alert('exit navigator');
        navigator.app.exitApp();
      }

      // Deprecated
      else if ( navigator.device ) {
        alert('exit device');
        navigator.device.exitApp();
      }

      else if ( typeof app !== 'undefined' ) {
        alert('exit app');
        app.exitApp();
      }

      else {
/*
        goog.dom.setTextContent(
          goog.dom.getElement('message'),
          'No mobile device'
        );
*/
      }
    }
  },

/*
  // ==========================================================================
  openMenu: function ( e ) {
    console.log('open menu: ' + e );
    var menu = document.querySelector('div#tabpane ul.goog-tabpane-tabs');
    console.log(menu);

    var w = menu.offsetWidth;
    var h = menu.offsetHeight;
    var anim = new goog.fx.dom.Resize(
      menu, [ w, h], [ 200, h], 400, goog.fx.easing.easeOut
    );

    anim.play();
  },

  // ==========================================================================
  closeMenu: function ( e ) {

    var menu = document.querySelector('div#tabpane ul.goog-tabpane-tabs');
    console.log(menu);

    var w = menu.offsetWidth;
    var h = menu.offsetHeight;
    var anim = new goog.fx.dom.Resize(
      menu, [ w, h], [ 0, h], 400, goog.fx.easing.easeOut
    );

    anim.play();
  },
*/

  // ==========================================================================
  openMenuControl: function ( opts ) {

    // 'this' is the Control object! -> use SufiTrailMobileApp
    var app = SufiTrailMobileApp;

    // build a control to show on map
    var options = opts || {};
    var openMenuBttn = document.createElement('button');
    openMenuBttn.innerHTML = '<img src="images/responsive.png" />';
    openMenuBttn.addEventListener( "click", menu.openNavigation());

    // ol-unselectable and ol-control are classes defined in ol.css.
    // open-menu is defined in index.html which positiones the widget
    // to the right
    var buttonContainer = document.createElement('div');
    buttonContainer.className = 'open-menu ol-unselectable ol-control';
    buttonContainer.appendChild(openMenuBttn);

    // control object needs this
    ol.control.Control.call(
      this, {
        element: buttonContainer,
        target: options.target
      }
    );
  },

  // ==========================================================================
  makeItHappen: function() {

    // ------------------------------------------------------------------------
    // make a tabpane
    //var tabPane = new goog.ui.TabPane(
    //  document.querySelector('div#tabpane'),
    //  goog.ui.TabPane.TabLocation.RIGHT
    //);

    // ------------------------------------------------------------------------
    // get size of viewport and modify the tabpane to fit
    //TODO make it dynamic
    console.log(
      'width=' + window.innerWidth + ', height=' + window.innerHeight
    );
    //document.getElementById('tabpane').style.cssText =
    //  "width: " + window.innerWidth + 'px;' +
    //  "height: " + window.innerHeight + 'px;';

    // ------------------------------------------------------------------------
    // Activate exit button
    //var exitBttn = goog.dom.getElement('exit-bttn');
    //exitBttn.addEventListener( "click",  this.exitButton);

    //-------------------------------------------------------------------------
    // inherit menu control
    ol.inherits( this.openMenuControl, ol.control.Control);

    //-------------------------------------------------------------------------
    // listen to click on map tab
    //var maptab = document.querySelector('div#tabpane ul li');
//console.log(maptab);
    //maptab.addEventListener( "click", SufiTrailMobileApp.closeMenu,);

    // ------------------------------------------------------------------------
    // initialize layers, features and view
    this.addLayers();
    this.addMapFeatures();
    this.setView();

    // ------------------------------------------------------------------------
    // make series of tracks clickable
    var app = this;
    var gpxElement;
    var trackCount = 1;
    while ( gpxElement = document.querySelector('#track' + trackCount) ) {
      // get the filename from the data attribute
      var gpxFile = gpxElement.getAttribute('data-gpx-file');
console.log('set handler for track' + trackCount + ' ' + gpxFile);
      trackCount++;

      // Function returning a handler which show a track and focus as well as
      // fits the track on screen
      function loadTrack ( trackFile ) {
        return function ( ) {

          // create a mouse event to simulate a click on the first entry
          // of the menu. This shows the map again
          var evt = new MouseEvent(
            "click", {
              bubbles: true,
              cancelable: false,
              view: window
            }
          );

          // close menu
          app.closeMenu();

          // TODO there is only an event on the first entry, how does this work
          // to switch from one page to an other page?
          document.querySelector('div#tabpane ul li').dispatchEvent(evt);

console.log('load track from ' + trackFile);
          // center and fit on new track
          app.loadTrack(trackFile);
        };
      }

      // set a click handler on the li element to close the menu and
      // to show the map again.
      gpxElement.addEventListener( "click", loadTrack(gpxFile));
    }

    // ------------------------------------------------------------------------
    // show map
    this.map = new ol.Map( {
        target:       'sufiTrailMap',
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

          new this.openMenuControl(),
        ]
      }
    );

    // ------------------------------------------------------------------------
    // click on features
    var app = this;
    app.map.on(
      'click',
      function ( e ) {
//        console.log('event: ' + e + ', target: ', + e.target + ', map: ' + e.map);
//        var eLoc = t.map.getEventCoordinate(e);
//        console.log("e loc: " + eLoc);
        app.map.forEachFeatureAtPixel(
          e.pixel,
          function( feature, layer) {
            console.log("Feature: " + feature.get('name') + ', id: ' + feature.getId());
/*
            goog.dom.setTextContent(
              goog.dom.getElement("message"),
              feature.get('dataLocation')
            );
*/
//            app.mapView.setCenter(eLoc);
          }
        );
      },
      app
    );

    //app.loadTrack(app.sufiTrailTrackGpx);
  },

  // ==========================================================================
  setView: function( ) {

    // This transformation is what I'm looking for. Longitude/Latitude
    // found using Google map of our home.
    this.mapView = new ol.View( {
      center: this.transform( [ 4.632367, 52.390413]),
      zoom: 10
    } );
  },

  // ==========================================================================
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

  // ==========================================================================
  // See also https://openlayers.org/en/latest/examples/icon-color.html
  addMapFeatures: function ( ) {

    // dataLocation is my own added field. inherited from ol.Object. Retrieve
    // with feature.get('dataLocation')
    var iconFeature = new ol.Feature( {
      geometry: new ol.geom.Point( this.transform( [ 4.632367, 52.390413])),
      name: 'location 1',
      dataLocation: "Ons huis - Jan de Bray straat"
    } );
    this.mapFeatures.push(iconFeature);
    iconFeature.setId('currloc');

    iconFeature = new ol.Feature( {
      geometry: new ol.geom.Point( this.transform( [ 4.632374, 52.390107])),
      name: 'location 2',
      dataLocation: "Jan de Bray straat - Schotersingel"
    } );
    this.mapFeatures.push(iconFeature);

    this.mapVector = new ol.source.Vector( {
      features: this.mapFeatures
    } );

    var iconStyle = new ol.style.Style( {
      image: new ol.style.Circle( {
        radius: 8,
        fill: new ol.style.Fill( { color: '#ff8800' } )
      } )
    } );

    this.mapLayers.push( new ol.layer.Vector( {
      source: this.mapVector,
      style: iconStyle
    } ) );


    // One other feature in a new layer with other symbol
    iconFeature = new ol.Feature( {
      geometry: new ol.geom.Point( this.transform( [ 4.632572, 52.390888])),
      name: 'location 3',
      dataLocation: "Jan de Bray straat - Tetterode straat"
    } );
    this.mapFeatures.push(iconFeature);

    this.mapVector = new ol.source.Vector( {
      features: [ this.mapFeatures[2] ]
    } );

    var iconStyle = new ol.style.Style( {
      image: new ol.style.Icon( ( {
        //anchor: [ 0.5, 46],
        //anchorXUnits: 'fraction',
        //anchorYUnits: 'pixels',
        opacity: 0.9,
        src: 'images/book.png'
      } ) )
    } );

    this.mapLayers.push( new ol.layer.Vector( {
      source: this.mapVector,
      style: iconStyle
    } ) );
  },

  // ==========================================================================
  loadTrack: function ( file ) {

console.log('Load: ' + file);
    var app = this;
    app.map.removeLayer(app.vector);
    app.vector = new ol.layer.Vector( {
        source: new ol.source.Vector( {
            url: file,
            format: new ol.format.GPX()
          }
        ),
        style: function ( feature ) {
          return app.style['LineString'];     // [feature.getGeometry().getType()];
        }
      }
    );

    this.map.addLayer(this.vector);
    app.loadGpxFile(file);
  },

  // ==========================================================================
  loadGpxFile: function ( file ) {

    var app = this;
app.timeStart = Date.now();

    if ( new RegExp(/\.xz$/).test(file) ) {
/*
      var buffer = new ArrayBuffer;
console.log('set lzma file: ' + file);
      var lzma = new LZMA(file);
console.log('start decompress');
      lzma.decompress(
        buffer,
        // on finish
        function ( result, error ) {
          console.log('Result: ' + result);
          console.log('Error: ' + error);
        },
        // on progress
        function ( percent ) {
          console.log('Decompressed: ' + percent + '%');
        }
      );
*/
    }

    else {
      // https://xhr.spec.whatwg.org/
      // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
      var gpxTextReq = new XMLHttpRequest();
      gpxTextReq.onreadystatechange = function ( ) {
console.log(
  'State: ' + this.readyState
            + ', ' + this.status
            + ', ' + this.statusText
);

        // https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML
        if ( this.readyState === 4 ) {
          if ( this.status === 200 ) {
  //      var parser = new DOMParser();
  //      app.trackGpxDom = parser.parseFromString( this.responseXML, "text/xml");
            app.trackGpxDom = this.responseXML;
//console.log("RT: " + this.responseText);
console.log("Loaded after " + (Date.now() - app.timeStart) + " msec");
//console.log("Result: " + app.trackGpxDom);
//console.log(app.trackGpxDom.documentElement.nodeName);
          // https://stackoverflow.com/questions/16664205/what-is-the-difference-between-getelementsbytagname-and-getelementsbyname-in-jav
          // http://www.topografix.com/GPX/1/1/

            app.scaleAndFocus(app);
          }

          else {
            console.log("Not Found; Path to file or filename probably spelled wrong");
          }
        }
      }
/*
      gpxTextReq.addEventListener(
        "error",
        function ( e ) {
          console.log("request.error called. Error: " + gpxTextReq.statusText);
        }
      );
*//*
      gpxTextReq.onerror = function ( e ) {
        console.log("request.error called. Error: " + e);
      }
*/

      // 3rd arg must be true to have it explicitly asynchronous.
//console.log('open... ' + file);
      gpxTextReq.open( "GET", file, true);
//console.log('send... ' + file);
      gpxTextReq.send();
    }
  },

  // ==========================================================================
  scaleAndFocus: function ( app ) {

    // Find the extensions in the gpx root
    var gpxExtensions = app.trackGpxDom.documentElement.querySelector('gpx extensions');

    // get the minima and maxima
    var bottomLeft = app.transform( [
        parseFloat(gpxExtensions.querySelector('lon').getAttribute('min')),
        parseFloat(gpxExtensions.querySelector('lat').getAttribute('min')),
      ]
    );
    var topRight = app.transform( [
        parseFloat(gpxExtensions.querySelector('lon').getAttribute('max')),
        parseFloat(gpxExtensions.querySelector('lat').getAttribute('max'))
      ]
    );

/*
    var center = app.transform( [
        parseFloat(gpxExtensions.querySelector('center').getAttribute('lon')),
        parseFloat(gpxExtensions.querySelector('center').getAttribute('lat'))
      ]
    );
*/

    // Fit the track on screen with the found minima and maxima
    app.mapView.fit(
      [ bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]],
      app.map.getSize()
    );
  },

  // ==========================================================================
  transform: function ( coordinate ) {

    return ol.proj.transform( coordinate, 'EPSG:4326', 'EPSG:3857');
  },

  // ==========================================================================
  // From http://osgeo-org.1560.x6.nabble.com/Downloading-tiles-to-local-file-system-td4991005.html
  getTile: function ( x, y, zoom ) {
    // make tile object. It will hold x, y and path fields
    var tile = {};

    x = (1 + (x * Math.PI / 180)/ Math.PI)/2;

    tile.x = Math.floor(x*Math.pow(2,zoom));
    tile.y = Math.floor((1-Math.log(Math.tan(y*Math.PI/180) + 1/Math.cos(y*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
    tile.path = zoom + '/'+ tile.x + '/'+ tile.y +'.png';

    // return the object
    return tile;
  },

  // ==========================================================================
  // From http://osgeo-org.1560.x6.nabble.com/Downloading-tiles-to-local-file-system-td4991005.html
  // Get all tiles for given region and zoom level
  getTiles: function ( bounds, zoom) {
    var tile_first = this.getTile( bounds.left, bounds.top,zoom);
    var tile_last = this.getTile( bounds.right, bounds.bottom,zoom);

    var tiles = [];
    for( x = tile_first.x; x <= tile_last.x; x++) {
      for( y = tile_first.y; y <= tile_last.y; y++) {
        tiles.push({'x':x,'y':y,'path': zoom + '/'+ x + '/'+ y +'.png'});
      }
    }
  }
};

// http://thanpol.as/javascript/you-dont-need-dom-ready
// Don't wait for event ready, just place script at the end of <body>
SufiTrailMobileApp.makeItHappen();
