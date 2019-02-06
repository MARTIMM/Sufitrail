import "." as HCPage
import "../Button" as HCButton
import "../Parts" as HCParts

import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.Config 0.3
import io.github.martimm.HikingCompanion.GlobalVariables 0.1
import io.github.martimm.HikingCompanion.TrackCoordinates 0.1

import QtQuick 2.11
//import QtQuick.Controls 2.4
//import QtQuick.Layouts 1.11
import QtQuick.Controls 1.4

HCPage.Plain {
  id: userTrackConfigPage

  width: parent.width
  height: parent.height
  anchors.fill: parent

  TrackCoordinates { id: trackCoordinates }
  Config { id: config }

  function addCoordinate( longitude, latitude, altitude) {

    if ( configGrid.recordingTrack === false ) return;

    console.log("Add coord: " + longitude + ", " + latitude + ", " + altitude);

    trackCoordinates.addCoordinate( longitude, latitude, altitude);

    // Show on map
    GlobalVariables.applicationWindow.mapPage.featuresMap.userTrackCourse.addCoordinate(
          longitude, latitude
          );
  }

  Component.onCompleted: {
    //console.log("UTCP");

    // Load settings this page
    hikeKey.inputText.text = config.getSetting("User/hikekey");
    hikeTitle.inputText.text = config.getSetting("User/hiketitle");
    hikeDesc.inputText.text = config.getSetting("User/hikedescr");
    trackTitle.inputText.text = config.getSetting("User/tracktitle");
    trackDesc.inputText.text = config.getSetting("User/trackdescr");
    if ( config.getSetting("User/tracktype") === "W" ) {
      trackType.rbWalk.checked = true;
    }

    else {
      trackType.rbBike.checked = true;
    }
  }

  HCParts.ToolbarRectangle {
    id: pageToolbarRow

    HCParts.ToolbarRow {
      HCButton.OpenMenu { }
      HCButton.Home { }

      Text {
        text: qsTr("User tracks configuration page")
      }
    }
  }



  property alias configGrid: configGrid
  Grid {
    id: configGrid

    columns: 2
    spacing: 2
    width: parent.width
    height: parent.height - pageToolbarRow.height - pageButtonRow.height

    anchors {
      left: parent.left
      right: parent.right
      top: pageToolbarRow.bottom
      bottom: pageButtonRow.top

      leftMargin: Theme.cfgFieldMargin
      rightMargin: Theme.cfgFieldMargin
      topMargin: 2
      bottomMargin: 2
    }

    property int labelWidth: 4.5 * parent.width / 10 - Theme.cfgFieldMargin
    property int inputWidth: 5.5 * parent.width / 10 - Theme.cfgFieldMargin
    property int configHeight: Theme.cfgRowHeight

    // Generate key when not provided using sha1 on title
    // Hike key of all tracks
    HCParts.ConfigLabel { text: qsTr("Hike key") }
    HCParts.ConfigInputText {
      id: hikeKey
      inputText.validator: RegExpValidator {
        regExp: /^[a-zA-Z0-9=_-]+$/
      }
    }

    // Hike title of all tracks
    HCParts.ConfigLabel { text: qsTr("Hike title") }
    HCParts.ConfigInputText { id: hikeTitle }

    // Short hike description
    HCParts.ConfigLabel { text: qsTr("Hike description") }
    HCParts.ConfigInputText { id: hikeDesc }

    // Track title
    HCParts.ConfigLabel { text: qsTr("Track title") }
    HCParts.ConfigInputText { id: trackTitle }

    // Short track description
    HCParts.ConfigLabel { text: qsTr("Track description") }
    HCParts.ConfigInputText { id: trackDesc }

    // Track type; walk or bike
    HCParts.ConfigLabel { text: qsTr("Type") }
    Row {
      id: trackType

      property alias rbWalk: rbWalk
      ExclusiveGroup { id: tabPositionGroup }
      RadioButton {
        id: rbWalk
        text: "Walk"
        checked: true
        exclusiveGroup: tabPositionGroup
      }

      property alias rbBike: rbBike
      RadioButton {
        id: rbBike
        text: "Bike"
        exclusiveGroup: tabPositionGroup
      }
    }

    // Recording buttons
    property bool recordingTrack: false
    HCParts.ConfigLabel { text: qsTr("Start recording") }
    Row {
      //id: recordingButtonRow

      HCButton.ButtonRowButton {
        id: startButton
        text: qsTr("Start")
        onClicked: {
          startButton.enabled = false;
          stopButton.enabled = true;
          pauseButton.enabled = true;

          // initialize coordinates
          trackCoordinates.init();
          GlobalVariables.applicationWindow.mapPage.featuresMap.userTrackCourse.init();

          // accept coordinates
          configGrid.recordingTrack = true;
        }
      }
    }

    HCParts.ConfigLabel { text: qsTr("Stop and save recording") }
    Row {
      HCButton.ButtonRowButton {
        id: stopButton
        text: qsTr("Stop")
        enabled: false
        onClicked: {
          startButton.enabled = true;
          stopButton.enabled = false;
          pauseButton.enabled = false;
          contButton.enabled = false;
          configGrid.recordingTrack = false;

          var ok = trackCoordinates.saveUserTrack(
                hikeKey.inputText.text, trackTitle.inputText.text,
                trackDesc.inputText.text, config.getSetting("User/tracktype")
                );
          if ( ok ) {
            GlobalVariables.applicationWindow.tracksPage.changeTrackList();
          }
        }
      }
    }

    HCParts.ConfigLabel { text: qsTr("Pause recording") }
    Row {
      id: pauseRecButtonRow

      HCButton.ButtonRowButton {
        id: pauseButton
        text: qsTr("Pause")
        enabled: false
        onClicked: {
          pauseButton.enabled = false;
          contButton.enabled = true;
          configGrid.recordingTrack = false;
        }
      }
    }

    HCParts.ConfigLabel { text: qsTr("Continue recording") }
    Row {
      HCButton.ButtonRowButton {
        id: contButton
        text: qsTr("Continue")
        enabled: false
        onClicked: {
          pauseButton.enabled = true;
          contButton.enabled = false;
          configGrid.recordingTrack = true;
        }
      }
    }
  }


  HCParts.PageButtonRowRectangle {
    id: pageButtonRow
    HCParts.PageButtonRow {

      anchors.bottom: parent.bottom

      HCButton.ButtonRowButton {
        text: qsTr("Save")
        onClicked: {
          // Save settings from this page
          config.setSetting( "User/hikekey", hikeKey.inputText.text);
          config.setSetting( "User/hiketitle", hikeTitle.inputText.text);
          config.setSetting( "User/hikedescr", hikeDesc.inputText.text);
          config.setSetting( "User/tracktitle", trackTitle.inputText.text);
          config.setSetting( "User/trackdescr", trackDesc.inputText.text);
          config.setSetting(
                "User/tracktype", trackType.rbWalk.checked ? "W" : "B"
                );

          trackCoordinates.saveUserTrackNames(
                hikeTitle.inputText.text, hikeDesc.inputText.text,
                hikeKey.inputText.text
                );
        }
      }
    }
  }
}
