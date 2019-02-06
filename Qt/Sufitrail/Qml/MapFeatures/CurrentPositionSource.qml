import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.0
import QtPositioning 5.11

//TODO geolocation when no gps is available but internet is there
PositionSource {
  id: location

  //preferredPositioningMethods: PositionSource.SatellitePositioningMethods
  preferredPositioningMethods: PositionSource.AllPositioningMethods
  //name: "SerialPortNmea"
  updateInterval: 1000

  // Turn it on when the MapPage is ready.
  active: false

  // Store coordinate here first, then process it. Timer testTimer can
  // now generate a series of random coordinates to test several functions
  // in this system.
  property var coord
  onPositionChanged: {
    coord = location.position.coordinate;
    processNewPosition();
  }

  function processNewPosition() {
    console.log( "Coordinate: " + coord.longitude + ", " + coord.latitude);

    // change the current location marker but do not center on it!
    currentLocationFeature.center = coord

    // Send to user track page for recording
    var mainWin = GlobalVariables.applicationWindow;
    if ( mainWin && mainWin.userTrackConfigPage ) {
      mainWin.userTrackConfigPage.addCoordinate(
            coord.longitude, coord.latitude, coord.altitude
            // , coord.timestamp, coord.speed
            );
      mainWin.mapPage.featuresMap.wanderOffTrackNotation.setWanderOffTrackNotation();
    }
  }
}
