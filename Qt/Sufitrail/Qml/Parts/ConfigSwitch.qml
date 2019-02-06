import QtQuick 2.9
import QtQuick.Controls 2.2

import io.github.martimm.HikingCompanion.Theme 0.1

Rectangle {
  id: root

  width: parent.width
  height: Theme.largeButtonHeight

  color: Theme.component.color.background

  property var controlObjects: []
  property bool checked;
  onCheckedChanged: {
    switchText.checked = checked;
  }

  property alias text: switchText.text
  Switch {
    id: switchText

    width: 40
    height: parent.height
    anchors {
      right: parent.right
      rightMargin: 6
    }

    scale: 0.8

    text: ""
    background: Rectangle {
      width: 1
      color: "transparent"
    }

    contentItem: Text {
      id: textItem
      text: switchText.text
      horizontalAlignment: Text.AlignRight
    }

    onClicked: {
      root.checked = switchText.checked;
      switchIt();
    }

    Component.onCompleted: { switchIt(); }

    function switchIt ( ) {
      for ( var ci = 0; ci < controlObjects.length; ci ++) {
        if ( consent.checked ) {
          controlObjects[ci].enabled = true;
        }

        else {
          controlObjects[ci].enabled = false;
        }
      }
    }
  }
}
