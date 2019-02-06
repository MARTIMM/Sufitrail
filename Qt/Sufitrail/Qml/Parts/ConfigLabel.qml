import QtQuick 2.9
import QtQuick.Controls 2.2

import io.github.martimm.HikingCompanion.Theme 0.1

Rectangle {
  id: control

  width: parent.labelWidth
  height: parent.configHeight

  property alias text: configLabel.text
  Label { id: configLabel }

  border {
    width: 1
    color: "transparent"
  }
}
