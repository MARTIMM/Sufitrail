import "." as HCPage
import "../Button" as HCButton
import "../Parts" as HCParts

import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.Config 0.3
import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.9
import QtQuick.Controls 2.2

HCPage.Plain {
  id: tracksPage

  Config {
    id: config

    // Function is triggered when click event on the select button
    // calls loadCoordinates function.
    onCoordinatesReady: {
      // Get the path of coordinates and show on map
      var path = config.coordinateList();
      var mapPage = GlobalVariables.applicationWindow.mapPage;
      mapPage.featuresMap.trackCourse.setPath(path);

      // Get the boundaries of the set of coordinates to zoom in
      // on the track shown on the map. Using boundaries will zoom in until
      // the track touches the edge. To prevent this, zoom out a small bit.
      var bounds = config.boundary();
      mapPage.hikingCompanionMap.visibleRegion = bounds;
      mapPage.hikingCompanionMap.zoomLevel =
          mapPage.hikingCompanionMap.zoomLevel - 0.2;

      // For safekeeping so we can zoom on it again later
      mapPage.featuresMap.trackCourse.boundary = bounds;

      // Show a line when we wander off track
      mapPage.featuresMap.wanderOffTrackNotation.setWanderOffTrackNotation();

      // Make map visible
      GlobalVariables.menu.setHomePage();
    }
  }

  Component.onCompleted: {
    // Get the track list. Here it is prepared on startup.
    changeTrackList();
  }

  function changeTrackList() {
    // Get the track list and check if empty. If empty, the select button
    // must be disabled. If not empty, set the previous selected entry
    // in the tracklist.
    lv.model = config.trackList();
    if ( lv.model.length === 0 ) {
      lv.contentHeight = 0;
      selectButton.enabled = false;
    }

    else {
      currentIndex = config.getGpxFileIndexSetting();
      var entriesHeight = lv.model.length * 20;
      lv.contentHeight = 20 + entriesHeight;
      selectButton.enabled = true;
    }
  }

  width: parent.width
  height: parent.height
  anchors.fill: parent

  HCParts.ToolbarRectangle {
    id: pageToolbarRow

    HCParts.ToolbarRow {
      HCButton.OpenMenu { }
      HCButton.Home { }

      Text {
        text: qsTr(" Tracks page")
      }
    }
  }

  // A fixed title from the tracks description on top
  Rectangle {
    id: titleText

    anchors.top: pageToolbarRow.bottom
    width: parent.width
    height: 40
    color: GlobalVariables.setComponentBgColor(Theme.component.color)

    Text {
      anchors.centerIn: parent
      text: tracksPage.trackTitle
      color: GlobalVariables.setComponentFgColor(Theme.component.color)
      font {
        pixelSize: 20
        bold: true
      }
    }
  }

  // Set text of title via this property. Component is not yet ready
//TODO: must set yet from track loading
  property string trackTitle
  property int currentIndex
  ListView {
    id: lv
    width: parent.width
    contentWidth: parent.width

    anchors {
      top: titleText.bottom
      bottom: pageButtonRow.top
      left: parent.left
      right: parent.right
    }

    clip: true

    currentIndex: tracksPage.currentIndex

    highlightResizeDuration: 1
    highlightMoveDuration: 400
    highlight: Rectangle {
      width: parent.width

      // Must be higher than 1 otherwise highlighting will be cut outside
      // a certain range.
      z: 2

      color: GlobalVariables.setComponentBgColor(Theme.component.color)
      opacity: 0.2
      radius: 5
      border {
        width: 2
        color: GlobalVariables.setComponentFgColor(Theme.component.color)
      }
    }

    delegate: Rectangle {
      width: parent.width
      height: 20
      MouseArea {
        anchors.fill: parent
        onClicked: {
          currentIndex = index
          tracksPage.currentIndex = currentIndex;
        }
      }

      color: GlobalVariables.setComponentBgColor(Theme.component.color)

      Text {
        id: wrapperText
        anchors.fill: parent
        anchors.leftMargin: 12
        verticalAlignment: Text.AlignVCenter
        horizontalAlignment: Text.AlignLeft
        text: "[" + index + "] " + modelData
        color: GlobalVariables.setComponentFgColor(Theme.component.color)
        //font.family: Theme.fontFamily
        font.pointSize: 14
      }
    }
  }

  HCParts.PageButtonRowRectangle {
    id: pageButtonRow
    HCParts.PageButtonRow {

      anchors.bottom: parent.bottom

      HCButton.ButtonRowButton {
        id: selectButton
        text: qsTr("Select")
        onClicked: {
          config.setGpxFileIndexSetting(currentIndex);

          // Get the coordinates of the selected track and emit a
          // signal when ready. This signal is catched on the mapPage
          // where the coordinates are used.
          config.loadCoordinates(currentIndex);
        }
      }
    }
  }
}
