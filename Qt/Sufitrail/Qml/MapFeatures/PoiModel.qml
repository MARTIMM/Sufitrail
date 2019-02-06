import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.0
import QtLocation 5.9

MapItemView {
  id: root

  model: GlobalVariables.applicationWindow.mapPage.poiMap.searchPoi
  delegate: MapQuickItem {
    coordinate: place.location.coordinate
    onCoordinateChanged: {
      console.info(
            "Coordinate found: " +
            place.location.coordinate + ", " +
            place.location.address.text
            );
    }

    anchorPoint.x: image.width * 0.5
    anchorPoint.y: image.height
    zoomLevel: GlobalVariables.applicationWindow.mapPage.hikingCompanionMap.zoomLevel

    sourceItem: Column {
      id: poiArea
      spacing: 2

      Component.onCompleted: {
        if ( Qt.platform.os === "linux" ) {
          image.mouseArea.hoverEnabled = true;
        }
      }

      property alias image: image
      Image {
        id: image
        //source: place.icon
        source: "qrc:Assets/Images/Icon/Poi/FoodSleep/restaurant_italian.png"
        fillMode: Image.PreserveAspectFit

        property alias mouseArea: mouseArea
        MouseArea {
          id: mouseArea

          anchors.fill: parent
          hoverEnabled: false

          onEntered: {
            console.log("entered");
            if ( Qt.platform.os === "android" ) {
              tt1Rct.visible = !tt1Rct.visible;
            }
            else if ( Qt.platform.os === "linux" ) {
              tt1Rct.visible = true;
            }
          }

          onExited: {
            console.log("exited");
            if ( Qt.platform.os === "linux" ) {
              tt1Rct.visible = false;
            }
          }
        }
      }

      Rectangle {
        id: tt1Rct

        visible: false

        width: tt1cw
        height: tt1ch

        color: "white"
        opacity: 0.8

        property real tt1cw: tt1.contentWidth
        property real tt1ch: tt1.contentHeight
        Text {
          id: tt1
          text: title
          font.bold: true
          font.pointSize: 10
        }
      }
/*
      Rectangle {
        id: tt2Rct

        width: tt2cw
        height: tt2ch

        color: "white"
        opacity: 0.8

        property real tt2cw: tt2.contentWidth
        property real tt2ch: tt2.contentHeight
        Text {
          id: tt2
          text: place.location.address.text
          font.bold: true
          font.pointSize: 10
        }
      }
*/
    }
  }
}

