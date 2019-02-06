import "." as HCPage
import "../Button" as HCButton
import "../Parts" as HCParts

import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.Textload 0.1

import QtQuick 2.9
import QtQuick.Controls 2.2
import QtQuick.Layouts 1.3

HCPage.Plain {
  id: exitPage
//  objectName: "exitPage"

  width: parent.width
  height: parent.height
  anchors.fill: parent

  HCParts.ToolbarRectangle {
    id: pageToolbarRow

    HCParts.ToolbarRow {
      HCButton.OpenMenu { }
      HCButton.Home { }

      Text {
        text: qsTr(" Exit page")
      }
    }
  }

  HCParts.InfoArea {
    id: exitText

    width: parent.width
    height: parent.height
    //anchors.fill: parent

    anchors {
      left: parent.left
      right: parent.right
      top: pageToolbarRow.bottom
      bottom: pageButtonRow.top
    }

    TextLoad {
      id: exitTextData
      filename: ":Assets/Pages/exitText.html"
    }

    text: exitTextData.text
  }

  HCParts.PageButtonRowRectangle {
    id: pageButtonRow
    HCParts.PageButtonRow {

      anchors.bottom: parent.bottom

      HCButton.ButtonRowButton {
        //id: exitBttn
        text: qsTr("Exit")
        onClicked: {
          console.log("Exit click");
          Qt.exit(0);
        }
      }

      HCButton.ButtonRowButton {
        text: qsTr("Save Track")
        enabled: false
      }
    }
  }
}
