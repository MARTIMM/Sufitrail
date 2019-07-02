import io.github.martimm.SufiTrail.UtilsInterface 0.1

import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Window 2.11

ApplicationWindow {
  id: dataContainerWindow
  objectName: "dataContainerWindow"

  UtilsInterface { id: utilsInterface }


  // Sizes are not important because on mobile devices it always scales
  // to the screen width and height. For desktop I use a scaled
  // Samsung tablet size (2048 x 1536 of Samsung Galaxy Tab S2).
  width: 600
  height: 450

  visible: true

  title: qsTr("Sufitrail Data")

  Image {
    id: backgroundImage
    source: "qrc:HikeData/Pages/Images/background.png";
    fillMode: Image.PreserveAspectCrop
    horizontalAlignment: Image.AlignHCenter
    verticalAlignment: Image.AlignVCenter
    width: parent.width
    height: parent.height
  }

  Rectangle {
    color: Qt.rgba(240,240,255,0.90)
    radius: 7

    width: parent.width
    height: parent.height

    anchors {
      top: parent.top
      topMargin: 8
      left: parent.left
      leftMargin: 8
      right: parent.right
      rightMargin: 8
      bottom: parent.bottom
      bottomMargin: 8
    }
  }

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

      <p> Welcome to the <strong>Sufitrail Hike</strong> data container. This
      is a container to hold tracks, maps and other information. This data is
      installed in the <strong>HikingCompanion</strong> environment when <strong>Install hike data</strong>
      is pressed. Then, after hitting the <strong>Exit</strong> button you can
      (re)start the <strong>HikingCompanion</strong> application and select the
      hike in the <strong>Config</strong> page.
      </p>

      <p> This data container app contains
      <ul>
        <li> 40 tracks comprising the route from Istanbul to Konya</li>
        <li> Notes of interesting points on the track</li>
        <li> Photo's of interesting places</li>
      </ul>
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
    text: qsTr("Exit")
    onClicked: {
      //utilsInterface.startHikingCompanion();
      Qt.quit();
    }
  }

  property bool installButtonOn: true
  Button {
    id: installButton

    anchors {
      right: quitButton.left
      bottom: parent.bottom

      rightMargin: 6
      bottomMargin: 12
    }

    enabled: installButtonOn
    text: qsTr("Install hike data")
    onClicked: {
      utilsInterface.installHikingData();
    }
  }
}
