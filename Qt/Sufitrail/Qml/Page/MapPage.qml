import "../Tests" as HCTest
import "." as HCPage
import "../Button" as HCButton
import "../MapFeatures" as HCMapFeatures
import "../Parts" as HCParts

import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.GlobalVariables 0.1
import io.github.martimm.HikingCompanion.Config 0.3

import QtQuick 2.11
import QtQuick.Controls 2.4
import QtLocation 5.9
import QtPositioning 5.8

HCPage.Plain {
  id: mapPage

  // Disable (false) when coordinate (gpx) tests are not needed
  property bool coordinateGeneratorOnForTesting: false
  HCTest.TimedCoordinateGenerator { id: generateCoordinates }

  width: parent.width
  height: parent.height
  anchors.fill: parent

  Config { id: config }
  Component.onCompleted: {
    // Turn on the gps coordinate gathering
    location.active = true;
    //location.start();

    hikingCompanionMap.center = location.coordinate
        ? location.coordinate
          //: QtPositioning.coordinate( 59.91, 10.75) // Oslo
        : QtPositioning.coordinate(  52.381543, 4.635727) // Haarlem, grote markt

    hikingCompanionMap.clearData();

    console.log("Map set to " + hikingCompanionMap.activeMapType.description);

    hikingCompanionMap.zoomLevel = Theme.mapParameters.startZoomLevel;
  }

  HCParts.ToolbarRectangle {
    id: pageToolbarRow
    color: "transparent"

    HCParts.ToolbarRow {
      HCButton.OpenMenu { }
      HCButton.CurrentLocationButton { }
      HCButton.CurrentTrackButton { }

      //TODO North button
      //TODO Reset tilt
      //TODO Camera button to make a picture
      //TODO Note button to make a note
    }
  }

  property alias location: location
  HCMapFeatures.CurrentPositionSource { id: location }


  // https://doc-snapshots.qt.io/qt5-5.9/location-plugin-osm.html#
  property alias hikingCompanionMap: hikingCompanionMap
  Map {
    id: hikingCompanionMap
    width: parent.width
    height: parent.height
    anchors.fill: parent
    gesture.enabled: true
    z: parent.z + 1
    //zoomLevel: 15
    minimumZoomLevel: Theme.mapParameters.minZoomLevel
    maximumZoomLevel: Theme.mapParameters.maxZoomLevel
    onZoomLevelChanged: { console.info("Zoom level: " + zoomLevel); }

    property alias mapSourcePlugin: mapSourcePlugin
    plugin: HCMapFeatures.MapSourcePlugin { id: mapSourcePlugin }

    Component.onCompleted: {
      mapSourcePlugin.setMapSource(MapType.CustomMap);
      // mapSourcePlugin.tileCache.value = config.tileCacheDir();
      //console.info("pp cache: " + mapSourcePlugin.tileCache.value);
    }
  }

  // See also https://doc-snapshots.qt.io/qt5-5.9/location-plugin-itemsoverlay.html
  property alias featuresMap: featuresMap
  //property alias currentLocationFeature: featuresMap.currentLocationFeature
  Map {
    id: featuresMap

    //width: parent.width
    //height: parent.height
    anchors.fill: parent
    plugin: Plugin { name: "itemsoverlay" }
    gesture.enabled: false


    center: hikingCompanionMap.center
    color: 'transparent' // Necessary to make this map transparent
    //opacity: 1 //0.6

    minimumFieldOfView: hikingCompanionMap.minimumFieldOfView
    maximumFieldOfView: hikingCompanionMap.maximumFieldOfView
    minimumTilt: hikingCompanionMap.minimumTilt
    maximumTilt: hikingCompanionMap.maximumTilt
    minimumZoomLevel: hikingCompanionMap.minimumZoomLevel
    maximumZoomLevel: hikingCompanionMap.maximumZoomLevel
    zoomLevel: hikingCompanionMap.zoomLevel
    tilt: hikingCompanionMap.tilt;
    bearing: hikingCompanionMap.bearing
    fieldOfView: hikingCompanionMap.fieldOfView
    z: hikingCompanionMap.z + 1

    // The code below enables SSAA
    layer.enabled: true
    layer.smooth: true
    property int w : hikingCompanionMap.width
    property int h : hikingCompanionMap.height
    //property int pr: Screen.devicePixelRatio
    //layer.textureSize: Qt.size( w  * 2 * pr, h * 2 * pr)


    property alias currentLocationFeature: currentLocationFeature
    HCMapFeatures.CurrentLocationFeature { id: currentLocationFeature }

    // This object is set from the tracksPage after selecting a track.
    property alias trackCourse: trackCourse
    HCMapFeatures.TrackCourse { id: trackCourse }

    // This object is set each time when a new coordinate comes in from GPS
    // and the user has tracking enabled. Later when ready, it is stored and
    // then selectable from the hike table and is made visible in the
    // trackCourse object
    property alias userTrackCourse: userTrackCourse
    HCMapFeatures.UserTrackCourse { id: userTrackCourse }

    property alias wanderOffTrackNotation: wanderOffTrackNotation
    HCMapFeatures.WanderOffTrackNotation { id: wanderOffTrackNotation }
  }


  // See also https://doc-snapshots.qt.io/qt5-5.9/location-plugin-itemsoverlay.html
  property alias poiMap: poiMap
  Map {
    id: poiMap

    //width: parent.width
    //height: parent.height
    anchors.fill: parent
    plugin: Plugin { name: "itemsoverlay" }
    gesture.enabled: false

    center: hikingCompanionMap.center
    color: 'transparent' // Necessary to make this map transparent
    //opacity: 1 //0.6

    minimumFieldOfView: hikingCompanionMap.minimumFieldOfView
    maximumFieldOfView: hikingCompanionMap.maximumFieldOfView
    minimumTilt: hikingCompanionMap.minimumTilt
    maximumTilt: hikingCompanionMap.maximumTilt
    minimumZoomLevel: hikingCompanionMap.minimumZoomLevel
    maximumZoomLevel: hikingCompanionMap.maximumZoomLevel
    zoomLevel: hikingCompanionMap.zoomLevel
    tilt: hikingCompanionMap.tilt;
    bearing: hikingCompanionMap.bearing
    fieldOfView: hikingCompanionMap.fieldOfView
    z: hikingCompanionMap.z + 1

    property alias searchPoi: searchPoi
    HCMapFeatures.PoiSearch { id: searchPoi }
    property alias poiModel: poiModel
    HCMapFeatures.PoiModel { id: poiModel }

    // The code below enables SSAA
    layer.enabled: true
    layer.smooth: true
    property int w : hikingCompanionMap.width
    property int h : hikingCompanionMap.height
    //property int pr: Screen.devicePixelRatio
    //layer.textureSize: Qt.size( w  * 2 * pr, h * 2 * pr)
  }
}

