import "../../Qml/Page" as HCPage
//import "../../Qml/Parts" as HCParts
//import "../../Qml/Button" as HCButton

//import io.github.martimm.HikingCompanion.Theme 0.1
//import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.9
import QtQuick.Controls 2.2
import QtQuick.Window 2.3


ApplicationWindow {
  id: root
  title: qsTr("Test Application")

  visible: true

  width: 600
  height: 450

  HCPage.UserTrackConfigPage {
    visible: true
  }
}

