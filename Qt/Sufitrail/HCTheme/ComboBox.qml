/* ----------------------------------------------------------------------------
  This one is more complex. Take a copy from the sources and change that.
  Location: /opt/Sources/QT/5.11.1/gcc_64/qml/QtQuick/Controls.2
*/

import QtQuick 2.8
import QtQuick.Window 2.3
import QtQuick.Controls 2.4
import QtQuick.Controls.impl 2.4
//import QtGraphicalEffects 1.0
import QtQuick.Templates 2.1 as T

import io.github.martimm.HikingCompanion.Theme 0.1

T.ComboBox {
  id: control

  Component.onCompleted: {
    console.log("CBX completed: " + model[0] + ", " + width + ", " + height);
  }

  implicitWidth: Math.max(background ? background.implicitWidth : 0,
                                       contentItem.implicitWidth + leftPadding + rightPadding)
  implicitHeight: Math.max(background ? background.implicitHeight : 0,
                                        Math.max(contentItem.implicitHeight,
                                                 indicator ? indicator.implicitHeight : 0) + topPadding + bottomPadding)
  baselineOffset: contentItem.y + contentItem.baselineOffset

  leftPadding: padding + (!control.mirrored || !indicator || !indicator.visible ? 0 : indicator.width + spacing)
  rightPadding: padding + (control.mirrored || !indicator || !indicator.visible ? 0 : indicator.width + spacing)

  delegate: ItemDelegate {
    width: parent.width
    text: control.textRole ? (Array.isArray(control.model) ? modelData[control.textRole] : model[control.textRole]) : modelData
    font.weight: control.currentIndex === index ? Font.DemiBold : Font.Normal
    highlighted: control.highlightedIndex === index
    hoverEnabled: control.hoverEnabled
  }

  indicator: ColorImage {
    x: control.mirrored ? control.padding : control.width - width - control.padding
    y: control.topPadding + (control.availableHeight - height) / 2
    color: control.palette.dark
    defaultColor: "#353637"
    source: "qrc:/qt-project.org/imports/QtQuick/Controls.2/images/double-arrow.png"
    opacity: enabled ? 1 : 0.3
  }

  contentItem: T.TextField {
    leftPadding: !control.mirrored ? 12 : control.editable && activeFocus ? 3 : 1
    rightPadding: control.mirrored ? 12 : control.editable && activeFocus ? 3 : 1
    topPadding: 6 - control.padding
    bottomPadding: 6 - control.padding

    text: control.editable ? control.editText : control.displayText

    enabled: control.editable
    autoScroll: control.editable
    readOnly: control.down
    inputMethodHints: control.inputMethodHints
    validator: control.validator

    font: control.font
    color: control.editable ? control.palette.text : control.palette.buttonText
    selectionColor: Theme.component.color.selectionText //control.palette.highlight
    selectedTextColor: Theme.component.color.selectedText //control.palette.highlightedText
    verticalAlignment: Text.AlignVCenter

    background: Rectangle {
      visible: control.enabled && control.editable && !control.flat
      border.width: parent && parent.activeFocus ? 2 : 1
      border.color: parent && parent.activeFocus ? control.palette.highlight : control.palette.button
      color: control.palette.base
    }
  }

  background: Rectangle {
    implicitWidth: 140
    implicitHeight: 40

    color: control.down ? control.palette.mid : control.palette.button
    border.color: control.palette.highlight
    border.width: !control.editable && control.visualFocus ? 2 : 0
    visible: !control.flat || control.down
  }

  popup: T.Popup {
    y: control.height
    width: control.width
    height: Math.min(contentItem.implicitHeight, control.Window.height - topMargin - bottomMargin)
    topMargin: 6
    bottomMargin: 6

    contentItem: ListView {
      clip: true
      implicitHeight: contentHeight
      model: control.delegateModel
      currentIndex: control.highlightedIndex
      highlightMoveDuration: 0

      Rectangle {
        z: 10
        width: parent.width
        height: parent.height
        color: "transparent"
        border.color: control.palette.mid
      }

      T.ScrollIndicator.vertical: ScrollIndicator { }
    }

    background: Rectangle { }
  }










  //width: parent.width
  //height: Theme.largeButtonHeight
  //anchors.fill: parent

  //opacity: enabled ? 1 : 0.7

  //padding: 1
  //z: 50
  /*
  font {
    bold: true
    underline: false
    //pixelSize: 14
    //pointSize: Theme.largeBtPointSize
    family: Theme.fontFamily
    pixelSize: Theme.cfgTextPixelSize
  }

  background: Rectangle {
    //color: "#00000000"
    color: Theme.cmptBgColor
    border {
      color: Theme.cmptFgColorL
      width: 1
    }
  }
*/
  //flat: false
  /*
  contentItem: Text {
    text: control.textRole
    color: Theme.cmptFgColorL
    font {
      family: Theme.fontFamily
      bold: true
      underline: false
      pixelSize: Theme.cbxPixelSize
    }
  }
*/
  /*
  style: ComboBoxStyle {
    //control: selectItems
    textColor: HCStyle.textColor
    selectedTextColor: HCStyle.selectedTextColor
    selectionColor: HCStyle.selectionTextColor
  }
*/
  /*
  background: Rectangle {
    color: "#00000000"
  }
*/
  /**/
}
