import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.0

Rectangle {

  height: Theme.component.toolbar.height
  width: parent.width

  // Row must be kept above page(1)
  z: 50

  anchors {
    top: parent.top
    left: parent.left
    right: parent.right

    leftMargin: Theme.component.toolbar.leftMargin
    rightMargin: Theme.component.toolbar.rightMargin
    topMargin: Theme.component.toolbar.topMargin
    bottomMargin: Theme.component.toolbar.bottomMargin
  }

  color: GlobalVariables.setComponentBgColor(Theme.component.toolbar)

  border {
    width: Theme.component.toolbar.border.width
    color: Theme.component.toolbar.border.color
  }
}
