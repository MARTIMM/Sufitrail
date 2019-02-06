//import io.github.martimm.HikingCompanion.Config 0.3
import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.11
//import QtQuick.Controls 2.2
import QtLocation 5.9
//import QtPositioning 5.11

// Source of the maps
Plugin {
  id: root

  name: "osm" // "mapboxgl" // "mapbox" // "esri" //
  //required: Plugin.AnyMappingFeatures | Plugin.AnyGeocodingFeatures
  locales: [ "nl_NL", "en_US"]

  // In script above select MapType.CustomMap
  // QtCreator must have ssl support!
  PluginParameter {
    name: "osm.mapping.custom.host"
    value: "https://a.tile.opentopomap.org/"
  }

  PluginParameter {
    name: "osm.mapping.custom.mapcopyright"
    value: "<a href='http://www.opentopomap.org/'>OpenTopoMap</a>"
  }

  PluginParameter {
    name: "osm.mapping.custom.datacopyright"
    value: "<a href='http://www.openstreetmap.com/'>OpenStreetMap</a>"
  }

  PluginParameter {
    name: "osm.mapping.providersrepository.disabled"
    value: true
  }

  PluginParameter {
    name: "osm.mapping.offline.directory"
    value: "cache:Tiles"
  }

/*
  // Copy all files from <qt install>/5.11.2/Src/qtlocation/src/plugins/geoservices/osm/providers/5.8/*
  // to qrc:Assets/Providers and add to resources file. Then the api key
  // can be added to the url strings for the thunderforest site.
  // In script above select MapType.TerrainMap
  PluginParameter {
    name: "osm.mapping.providersrepository.address"
    value: "qrc:Assets/Providers"
  }
*/

  // Search for map type and set activeMapType with it
  function setMapSource ( mapType ) {

    var mainWin = GlobalVariables.applicationWindow;
    var suppMapTypes = mainWin.mapPage.hikingCompanionMap.supportedMapTypes;
    for ( var mt in suppMapTypes ) {
      /*
      console.log("---");
      console.log("name: " + supportedMapTypes[mt].name);
      console.log("descr: " + supportedMapTypes[mt].description);
      console.log("mobile: " + supportedMapTypes[mt].mobile);
      console.log("night: " + supportedMapTypes[mt].night);
      console.log("style: " + supportedMapTypes[mt].style);
*/
      /*
From MapType QML component
      MapType.NoMap - No map.
      MapType.StreetMap - A street map.
      MapType.SatelliteMapDay - A map with day-time satellite imagery.
      MapType.SatelliteMapNight - A map with night-time satellite imagery.
      MapType.TerrainMap - A terrain map.
      MapType.HybridMap - A map with satellite imagery and street information.
      MapType.GrayStreetMap - A gray-shaded street map.
      MapType.PedestrianMap - A street map suitable for pedestriants.
      MapType.CarNavigationMap - A street map suitable for car navigation.
      MapType.CycleMap - A street map suitable for cyclists.
      MapType.CustomMap - A custom map type.
*/
      if ( suppMapTypes[mt].style === mapType ) {
        mainWin.mapPage.hikingCompanionMap.activeMapType = suppMapTypes[mt];
        break;
      }
    }
  }
}

