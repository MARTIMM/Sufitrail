import io.github.martimm.SufiTrail.ShareUtils 0.1

import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Window 2.11

ApplicationWindow {
  id: dataContainerWindow
  objectName: "dataContainerWindow"

  onActiveChanged: {
    console.log("active");
    shareUtils.share();
  }

  property alias shareUtils: shareUtils;
  property int progressValue: 0
  ShareUtils {
    id: shareUtils
    //objectName: "shareUtils"

    onSetupProgress: {
      console.log("setup progress bar");
      //progressBar.from = from;
      //progressBar.to = to;
    }

    onReportProgress: {
      progressValue = progressValue + 1.0;
      console.log("progress: " + progressValue);
    }

    onEnableQuitButton: {
      quitButton.enabled = true;
    }
  }
/*
  Component.onCompleted: {
    shareUtils.share();
  }
*/
  visible: true

  // Sizes are not important because on mobile devices it always scales
  // to the screen width and height. For desktop I use a scaled
  // Samsung tablet size (2048 x 1536 of Samsung Galaxy Tab S2).
  width: 600
  height: 450

  title: qsTr("Sufitrail Data")

  Text {
    id: textMessage
    width: parent.width

    anchors {
      //fill: parent
      top: parent.top
      topMargin: 6
      left: parent.left
      leftMargin: 12
      right: parent.right
      rightMargin: 12
    }

    font {
      family: "ariel"
      pixelSize: 15
    }

    wrapMode: Text.WordWrap

    text: qsTr("
      <h1> The SufiTrail </h1>

      <p> Welcome to the Sufitrail data container. This installed container will
      not be the app showing you the way on your route. This is just a container
      of the tracks, maps and other information. The app <b>HikingCompanion</b>
      should start automatically if it is installed.
      </p>

      <p> Below you will find a short overview of what this app contains
      <ul>
        <li> 40 tracks comprising the route from Istanbul to Konya</li>
        <li> Notes at certain points on the track</li>
        <li> Places to stay and, when connected, make a reservation</li>
      </ul>
      </p>
      </br></br></br>
      <p>Progress of installing the hike routes and its information in the
        <b>HikingCompanion</b> application.
      </p>
    ")
  }

  property alias progressBar: progressBar
  ProgressBar {
    id: progressBar
    //objectName: "progressBar"

    height: 10

    anchors {
      top: textMessage.bottom
      left: parent.left
      leftMargin: 12
      right: parent.right
      rightMargin: 12
    }

    from: 0.0
    to: 10.0
    value: progressValue

    background: Rectangle {
      //color: "ff8800"
      border.color: "steelblue"
      border.width: 1
      radius: 3
      //implicitWidth: 200
      //implicitHeight: 24

      color: "lightsteelblue"
    }
  }

  Button {
    id: quitButton
    //objectName: "quitButton"

    anchors {
      right: parent.right
      bottom: parent.bottom

      rightMargin: 12
      bottomMargin: 12
    }

    enabled: false
    text: qsTr("Exit application")
    onClicked: {
      Qt.quit();
    }
  }
}
