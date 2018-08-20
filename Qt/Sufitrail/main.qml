import QtQuick 2.11
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

    text: "
      <h1>The SufiTrail</h1>

      <p>Welcome to the Sufitrail application. This installed app is not the app showing you
      the way on your route. This is just a container of the tracks, information and other
      information. The app <b>HikingCompanion</b> should start automatically if it is
      installed.
      </p>
    "
  }
}
