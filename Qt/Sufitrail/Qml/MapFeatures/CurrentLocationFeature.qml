import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.0
import QtLocation 5.9

MapCircle {
  id: root

  radius: 8.0
  color: 'transparent'  // or #00000000 with alpha to zero
  //opacity: 0.7
  border.width: 4
  border.color: 'blue'

  Component.onCompleted: {
    // Initialize circle on top of the current map center.
    var mainWin = GlobalVariables.applicationWindow;
    if ( mainWin && mainWin.mapPage ) {
      root.center = mainWin.mapPage.hikingCompanionMap.center;
    }
  }

  // Function to zoom in on the current location
  function zoomOnCurrentLocation() {
    hikingCompanionMap.center = currentLocationFeature.center;
    hikingCompanionMap.zoomLevel = 16;
  }
}
