import io.github.martimm.HikingCompanion.Theme 0.1

import QtQuick 2.8
import QtGraphicalEffects 1.0
import QtQuick.Templates 2.2 as T

T.TextField {
  id: control

  width: parent.width
  height: parent.height
  anchors.fill: parent

  horizontalAlignment: Text.AlignLeft
  verticalAlignment: Text.AlignVCenter

  leftPadding: 2
  rightPadding: 2
  opacity: enabled ? 1 : 0.6

  font {
    bold: true
    underline: false
    pixelSize: Theme.txtfPixelSize
    //pointSize: Theme.largeBtPointSize
    family: Theme.fontFamily
  }

  background: Rectangle {
    id: btBackground

    anchors.fill: parent

    opacity: enabled ? 1 : 0.6

    color: Theme.component.color.background
    border {
      color: "transparent" //Theme.component.color.foregroundLight
      width: 1
    }
    //radius: Theme.component.rounding
/**/
    // radius doesn't work with gradients
//    radius: Theme.cmptRdng
/*
    states: [
      State {
        name: "normal"
        when: !control.down
        PropertyChanges { target: btBackground}
      },

      State {
        name: "down"
        when: control.down
        PropertyChanges { target: btBackground; color: Theme.cmptBgColor}
      }
    ]
*/
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
