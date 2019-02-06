import io.github.martimm.HikingCompanion.Theme 0.1

import QtQuick 2.8
import QtGraphicalEffects 1.0
import QtQuick.Templates 2.2 as T

T.Label {
  id: control

  width: parent.width
  height: parent.height
  anchors.fill: parent

  horizontalAlignment: Text.AlignLeft
  verticalAlignment: Text.AlignVCenter

  leftPadding: 2
  //rightPadding: 2

  font {
    bold: true
    underline: false
    pixelSize: Theme.lblPixelSize
    family: Theme.fontFamily
  }

  color: Theme.component.color.foregroundLight
  opacity: enabled ? 1 : 0.6

  background: Rectangle {
    id: btBackground

    anchors.fill: parent

    opacity: enabled ? 1 : 0.6

    color: Theme.component.color.backgroundDark
    border {
      color: "transparent" //Theme.component.color.backgroundLight
      width: 1
    }
  }
/*
  property alias textItem: textItem
  contentItem: Text {
    id: textItem
    text: control.text

    font: control.font
    opacity: enabled ? 1.0 : 0.3
    color: Theme.cmptFgColorLL
    horizontalAlignment: Text.AlignHCenter
    verticalAlignment: Text.AlignVCenter
    //elide: Text.ElideRight
*/
/*
    states: [
      State {
        name: "normal"
        when: !control.down
      },
      State {
        name: "down"
        when: control.down
        PropertyChanges {
          target: textItem
          color: Theme.cmptFgColor
        }
      }
    ]
*/
//  }
}
