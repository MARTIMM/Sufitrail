import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.0

Rectangle {

  height: Theme.component.buttonrow.height
  width: parent.width

  // Row must be kept above page(1)
  z: 50

  anchors {
    left: parent.left
    right: parent.right
    bottom: parent.bottom

    leftMargin: Theme.component.buttonrow.leftMargin
    rightMargin: Theme.component.buttonrow.rightMargin
    topMargin: Theme.component.buttonrow.topMargin
    bottomMargin: Theme.component.buttonrow.bottomMargin
  }

  color: GlobalVariables.setComponentBgColor(Theme.component.buttonrow)

  border {
    width: Theme.component.buttonrow.border.width
    color: Theme.component.buttonrow.border.color
  }
}
