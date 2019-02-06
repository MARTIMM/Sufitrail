/* ----------------------------------------------------------------------------
  This one is more complex. Take a copy from the sources and change that.
  Location: /opt/Sources/QT/5.11.1/gcc_64/qml/QtQuick/Controls.2
*/

import QtQuick 2.8
//import QtGraphicalEffects 1.0
import QtQuick.Templates 2.1 as T
import QtQuick.Controls.Styles 1.4
import QtQuick.Controls 2.4
import QtQuick.Controls.impl 2.4

import io.github.martimm.HikingCompanion.Theme 0.1

T.Switch {
  id: control


  implicitWidth: Math.max(background ? background.implicitWidth : 0,
                                       contentItem.implicitWidth + leftPadding + rightPadding)
  implicitHeight: Math.max(background ? background.implicitHeight : 0,
                                        Math.max(contentItem.implicitHeight,
                                                 indicator ? indicator.implicitHeight : 0) + topPadding + bottomPadding)
  baselineOffset: contentItem.y + contentItem.baselineOffset

  padding: 6
  spacing: 6

  indicator: PaddedRectangle {
    implicitWidth: 56
    implicitHeight: 28

    x: text ? (control.mirrored ? control.width - width - control.rightPadding : control.leftPadding) : control.leftPadding + (control.availableWidth - width) / 2
    y: control.topPadding + (control.availableHeight - height) / 2

    radius: 8
    leftPadding: 0
    rightPadding: 0
    padding: (height - 16) / 2
    color: control.checked ? control.palette.dark : control.palette.midlight

    Rectangle {
      x: Math.max(0, Math.min(parent.width - width, control.visualPosition * parent.width - (width / 2)))
      y: (parent.height - height) / 2
      width: 28
      height: 28
      radius: 16
      color: control.down ? control.palette.light : control.palette.window
      border.width: control.visualFocus ? 2 : 1
      border.color: control.visualFocus ? control.palette.highlight : control.enabled ? control.palette.mid : control.palette.midlight

      Behavior on x {
        enabled: !control.down
        SmoothedAnimation { velocity: 200 }
      }
    }
  }

  contentItem: CheckLabel {
    leftPadding: control.indicator && !control.mirrored ? control.indicator.width + control.spacing : 0
    rightPadding: control.indicator && control.mirrored ? control.indicator.width + control.spacing : 0

    text: control.text
    font: control.font
    color: control.palette.windowText
  }
















  /*
  width: parent.width
  height: parent.height
  anchors.fill: parent

  //horizontalAlignment: Text.AlignLeft
  //verticalAlignment: Text.AlignVCenter

  leftPadding: 2
  checked: false
  //rightPadding: 2

  font {
    bold: true
    underline: false
    pixelSize: Theme.lblPixelSize
    family: Theme.fontFamily
  }

  background: Rectangle {
    id: btBackground

    anchors.fill: parent

    opacity: enabled ? 1 : 0.7

    color: Theme.cmptBgColor
    border {
      color: Theme.cmptFgColorL
      width: 1
    }
  }

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
  }
*/
}
