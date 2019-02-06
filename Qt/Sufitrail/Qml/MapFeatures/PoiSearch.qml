import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.0
import QtLocation 5.9
import QtPositioning 5.11

PlaceSearchModel {
  id: root

  plugin: GlobalVariables.applicationWindow.mapPage.hikingCompanionMap.mapSourcePlugin

  searchTerm: "Pizza,Haarlem"
  searchArea: QtPositioning.circle(
                GlobalVariables.applicationWindow.mapPage.hikingCompanionMap.center
                );

  Component.onCompleted: {
    update();
  }

  onStatusChanged: {
    if ( status === Place.Ready ) {
      if ( !Place.detailsFetched ) {
        this.getDetails();
      }
    }

    else if ( status === Place.Error ) {
      console.log("Error: " + status.toString());
    }

    console.log("Status changed: " + root.status.toString());
  }

  onCountChanged: {
    console.log("pizarias: " + data);
  }
}
