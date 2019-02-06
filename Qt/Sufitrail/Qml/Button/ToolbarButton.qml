import io.github.martimm.HikingCompanion.GlobalVariables 0.1
import io.github.martimm.HikingCompanion.Theme 0.1

import QtQuick 2.9
import QtQuick.Controls 2.2

Button {

  Component.onCompleted: {
    init(GlobalVariables.component.toolbar.button.type);
  }

/*
  width: parent.height //Theme.component.toolbar.button.width
  height: parent.height //Theme.component.toolbar.button.height
  anchors {
    leftMargin: Theme.component.toolbar.button.leftMargin
    rightMargin: Theme.component.toolbar.button.rightMargin
    topMargin: Theme.component.toolbar.button.topMargin
    bottomMargin: Theme.component.toolbar.button.bottomMargin
  }

  font {
//    bold: true
//    underline: false
    pixelSize: Theme.component.toolbar.button.pixelSize
    family: Theme.fontFamily
  }
*/}
