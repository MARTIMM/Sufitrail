import "../Parts" as HCParts
import "../Button" as HCButton

import QtQuick 2.3
import QtQuick.Controls 1.2
import QtQuick.Dialogs 1.2

Dialog {
  property string messageText;
  property string button1Text: "Yes"
  property string button2Text: "No"
  property string titleText
  //property StandardButton buttons

  visible: false
  title: qsTr(titleText)

  //standardButtons: StandardButton.Yes | StandardButton.No

  /*
  // TODO adjust width of button
  Component.onCompleted: {
    button1Text = "Yes";
    button2Text = "No";
  }
  */

  Text {
    text: qsTr(messageText)
    color: "navy"
    anchors.centerIn: parent
    //font.pixelSize: 20
  }

/*

  contentItem: Rectangle {
    //color: "lightskyblue"
    implicitWidth: 400
    implicitHeight: 200


HCParts.PageButtonRowRectangle {
      id: pageButtonRow

      HCParts.PageButtonRow {
        anchors.bottom: parent.bottom

        HCButton.ButtonRowButton {
          text: qsTr(button1Text)
          onClicked: {
          }
        }

        HCButton.ButtonRowButton {
          text: qsTr(button2Text)
          onClicked: {
          }
        }
      }
    }
  }
*/
}
