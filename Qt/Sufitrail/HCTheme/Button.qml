import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.GlobalVariables 0.1
import io.github.martimm.HikingCompanion.Config 0.3

import QtQuick 2.9
import QtGraphicalEffects 1.0
import QtQuick.Templates 2.1 as T
import QtQuick.Layouts 1.3

T.Button {
  id: control

  Config { id: config }

  // Initialization function to keep the buttons as simple as possible.
  // The function is called with a type which is declared in GlobalVariables.
  // When pushed to the extreme, the buttons are very clean and Types import
  // will not be necessary anymore in those modules.
  function init ( type ) {
    //console.log("Fn init(" + type + ")");
    if ( type === GlobalVariables.component.toolbar.button.type ) {
      font.pixelSize = Theme.component.toolbar.button.pixelSize;
      font.family = Theme.fontFamily;

      Layout.preferredWidth = parent.height -
          Theme.component.toolbar.button.leftMargin -
          Theme.component.toolbar.button.rightMargin;
      Layout.preferredHeight = parent.height -
          Theme.component.toolbar.button.topMargin -
          Theme.component.toolbar.button.bottomMargin;

      Layout.minimumWidth = Layout.preferredWidth;
      Layout.minimumHeight = Layout.preferredHeight;

      Layout.alignment = Qt.AlignVCenter | Qt.AlignLeft;
      Layout.fillWidth = false;
      Layout.fillHeight = false;

      btBackground.color = GlobalVariables.setComponentBgColor(Theme.component.toolbar.button);
      textItem.color = GlobalVariables.setComponentFgColor(Theme.component.toolbar.button);
      btBackground.radius = Theme.component.toolbar.button.radius;
      btBackground.border.color = Theme.component.toolbar.button.border.color;
      btBackground.border.width = Theme.component.toolbar.button.border.width;
    }

    else if ( type === GlobalVariables.component.buttonrow.button.type ) {
      font.pixelSize = Theme.component.buttonrow.button.pixelSize;
      font.family = Theme.fontFamily;
/*
      width = textMetrics.boundingRect.width + 20;
      height = Theme.component.buttonrow.button.height;
      anchors.leftMargin = Theme.component.buttonrow.button.leftMargin;
      anchors.rightMargin = Theme.component.buttonrow.button.rightMargin;
      anchors.topMargin = Theme.component.buttonrow.button.topMargin;
      anchors.bottomMargin = Theme.component.buttonrow.button.bottomMargin;
*/
      Layout.preferredWidth = textMetrics.boundingRect.width + config.pixels(parseFloat(0.5));
      Layout.preferredHeight = parent.height -
          Theme.component.toolbar.button.topMargin -
          Theme.component.toolbar.button.bottomMargin;

      Layout.minimumWidth = Layout.preferredWidth;
      Layout.minimumHeight = Layout.preferredHeight;

      Layout.alignment = Qt.AlignVCenter | Qt.AlignLeft;
      Layout.fillWidth = false;
      Layout.fillHeight = false;

      btBackground.color = GlobalVariables.setComponentBgColor(Theme.component.buttonrow.button);
      textItem.color = GlobalVariables.setComponentFgColor(Theme.component.buttonrow.button);
      btBackground.radius = Theme.component.buttonrow.button.radius;
      btBackground.border.color = Theme.component.buttonrow.button.border.color;
      btBackground.border.width = Theme.component.buttonrow.button.border.width;
    }

    else if ( type === GlobalVariables.component.menu.button.type ) {
      font.pixelSize = Theme.component.menu.button.pixelSize;
      font.family = Theme.fontFamily;

      width = Theme.component.menu.button.width;
      height = Theme.component.menu.button.height;
      anchors.left = parent.left;
      anchors.leftMargin = Theme.component.menu.button.leftMargin;
      anchors.rightMargin = Theme.component.menu.button.rightMargin;
      anchors.topMargin = Theme.component.menu.button.topMargin;
      anchors.bottomMargin = Theme.component.menu.button.bottomMargin;
      textItem.horizontalAlignment = Text.AlignLeft
      textItem.verticalAlignment = Text.AlignVCenter

      btBackground.color = GlobalVariables.setComponentBgColor(Theme.component.menu.button);
      textItem.color = GlobalVariables.setComponentFgColor(Theme.component.menu.button);
      btBackground.radius = Theme.component.menu.button.radius;
      btBackground.border.color = Theme.component.menu.button.border.color;
      btBackground.border.width = Theme.component.menu.button.border.width;
    }
  }

  font {
    bold: true
    underline: false
    //pixelSize: 14
    //pointSize: Theme.largeBtPointSize
    //family: Theme.fontFamily
  }


/*
  leftPadding: 2
  rightPadding: 2
  topPadding: 2
  bottomPadding: 2
*/

  property alias btBackground: btBackground
  background: Rectangle {
    id: btBackground

    anchors.fill: parent
    opacity: enabled ? 1 : 0.7

/*
    layer.effect: DropShadow {
      horizontalOffset: 15
      verticalOffset: 20
      color: Theme.component.color.backgroundDark //control.visualFocus ? "#330066ff" : "#aaaaaa"
      samples: 17
      radius: 8
      spread: 0.5
    }
*/
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
        PropertyChanges {
          target: btBackground
          color: Theme.component.color.background
        }

        PropertyChanges {
          target: g0
          color: Theme.component.color.backgroundDark
        }
        PropertyChanges {
          target: g1
          color: Theme.component.color.backgroundLight
        }

      }
    ]
*/
}

  property alias textMetrics: textMetrics
  TextMetrics {
    id: textMetrics
    //font.family: root.font.family
    //font.pointSize: Theme.largeBtPointSize
    font: control.font
    elide: Text.ElideNone
    //elideWidth: 100
    text: control.text
  }

  property color txtColor: Theme.component.color.foregroundLight
  property alias textItem: textItem
  contentItem: Text {
    id: textItem
    text: control.text

    font: control.font
    opacity: enabled ? 1.0 : 0.3
    //color: GlobalVariables.setComponentFgColor(Theme.component.toolbar.button);
    //Theme.component.color.foregroundLight
    horizontalAlignment: Text.AlignHCenter
    verticalAlignment: Text.AlignVCenter
    //elide: Text.ElideRight
    textFormat: Text.RichText
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
  }
}
