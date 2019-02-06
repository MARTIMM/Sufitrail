import io.github.martimm.HikingCompanion.Theme 0.1

import QtQuick 2.9
import QtQuick.Layouts 1.3

RowLayout {
  // Row must be kept above page(1)
  z: 10
  spacing: 2
  layoutDirection: Qt.RightToLeft

  // Cannot use anchors.fill or anchors.right because items in the RowLayout
  // child will be stretched or spread over its width
  anchors {
    top: parent.top
    right: parent.right
    bottom: parent.bottom
  }
}
