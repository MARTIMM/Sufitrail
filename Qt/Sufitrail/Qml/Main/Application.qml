import io.github.martimm.SufiTrail.ShareInterface 0.1

import QtQuick 2.11
import QtQuick.Controls 2.2
import QtQuick.Window 2.3

ApplicationWindow {
  id: dataContainerWindow
  objectName: "dataContainerWindow"

  ShareInterface { id: shareInterface }


  // Sizes are not important because on mobile devices it always scales
  // to the screen width and height. For desktop I use a scaled
  // Samsung tablet size (2048 x 1536 of Samsung Galaxy Tab S2).
  width: 600
  height: 450

  visible: true

  title: qsTr("Sufitrail Data")

  Text {
    id: textMessage
    width: parent.width

    anchors {
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

      <p> This data container app contains
      <ul>
        <li> 40 tracks comprising the route from Istanbul to Konya</li>
        <li> Notes of interesting points on the track</li>
        <li> Photo's of interesting places</li>
      </ul>
      </p>
      </br></br></br>
      <p>Progress of installing the hike routes and its information in the
        <b>HikingCompanion</b> application.
      </p>
    ")
  }

  property int progressFrom: 0.0
  property int progressTo: 0.0
  property int progressValue: 0.0
  ProgressBar {
    id: progressBar

    width: parent.width
    height: 10

    anchors {
      top: textMessage.bottom
      left: parent.left
      leftMargin: 12
      right: parent.right
      rightMargin: 12
    }

    from: progressFrom
    to: progressTo
    value: progressValue

    background: Rectangle {
      color: "lightsteelblue"
      border.color: "steelblue"
      border.width: 1
      radius: 3
    }
  }

  property string progressText
  Text {
    width: parent.width
    height: 10

    anchors {
      top: progressBar.bottom
      left: parent.left
      leftMargin: 12
      right: parent.right
      rightMargin: 12
    }

    text: progressText
  }

  property bool quitButtonOn: false
  Button {
    id: quitButton

    anchors {
      right: parent.right
      bottom: parent.bottom

      rightMargin: 12
      bottomMargin: 12
    }

    enabled: quitButtonOn
    text: qsTr("Exit application")
    onClicked: {
      Qt.quit();
    }
  }

  Button {
    id: installButton

    anchors {
      right: quitButton.left
      bottom: parent.bottom

      rightMargin: 6
      bottomMargin: 12
    }

    text: qsTr("Install hike data")
    onClicked: {
      shareInterface.share();
    }
  }
}
