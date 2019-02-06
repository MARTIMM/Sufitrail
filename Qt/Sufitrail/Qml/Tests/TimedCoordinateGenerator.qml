import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.0
import QtPositioning 5.11

// Testing position source coordinates by generating fake coordinates.
Timer {
  id: root

  property real lat: 52.3 + 0.01 * Math.random()
  property real lon: 4.5 + 0.01 * Math.random()

  running: false
  repeat: true
  interval: 5000

  Component.onCompleted: {
    var mainWin = GlobalVariables.applicationWindow;
    root.running = mainWin.mapPage.coordinateGeneratorOnForTesting;
    console.log("Timer running: " + root.running);
  }

  onTriggered: {
    var mainWin = GlobalVariables.applicationWindow;

    //if ( location.valid ) {
    //running = false;
    //console.log("test timer turned off because location is valid");
    //}

    //else {
    console.info( "Timed test coordinate: " + lon + ", " + lat);
    mainWin.mapPage.location.coord = QtPositioning.coordinate( lat, lon);
    location.processNewPosition();

    lon = lon + 0.00005 * (Math.random() - 0.2);
    lat = lat + 0.00005 * (Math.random() - 0.6);
    //}
  }
}
