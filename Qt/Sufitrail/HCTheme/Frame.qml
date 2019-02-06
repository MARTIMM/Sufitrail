import QtQuick 2.11
import QtGraphicalEffects 1.0
import QtQuick.Templates 2.2 as T

import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.GlobalVariables 0.1

T.Frame {
  id: control

  width: parent.width
  height: parent.height
  anchors.fill: parent

  background: Rectangle {
    color: GlobalVariables.setComponentBgColor(Theme.component.color)
    anchors.fill: parent
  }
}
