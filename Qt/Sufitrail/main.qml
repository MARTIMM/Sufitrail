import QtQuick 2.11
import QtQuick.Controls 2.2
import QtQuick.Window 2.11

Window {
  visible: true

  width: 640
  height: 480

  title: qsTr("Sufitrail Data")

  Text {
    width: parent.width
    height: parent.height
    anchors {
      fill: parent
      leftMargin: 10
      rightMargin: 10
      topMargin: 10
      bottomMargin: 10
    }

    font {
      family: "ariel"
      pixelSize: 15
    }

    wrapMode: Text.WordWrap

    text: qsTr("
      <h1> The SufiTrail </h1>

      <p> Welcome to the Sufitrail application. This installed app will not be the app showing you
      the way on your route. This is just a container of the tracks, maps and other
      information. The app <b>HikingCompanion</b> should start automatically if it is
      installed.
      </p>

      <p> Below you will find a short overview of what this app contains
      <ul>
        <li> 40 tracks comprising the route from Istanbul to Konya</li>
        <li> Notes at certain points on the track</li>
        <li> Places to stay and, when connected, make a reservation</li>
      </ul>
      </p>
    ")
  }

  Button {
    anchors {
      right: parent.right
      bottom: parent.bottom

      rightMargin: 6
      bottomMargin: 6
    }

    text: qsTr("Exit application")
    onClicked: {
      Qt.quit();
    }
  }
}
