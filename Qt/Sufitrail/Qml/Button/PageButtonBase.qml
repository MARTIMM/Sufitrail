import QtQuick 2.11
import QtQuick.Controls 2.4
//import QtQuick.Layouts 1.3

//import io.github.martimm.HikingCompanion.HCStyle 0.1
import io.github.martimm.HikingCompanion.Theme 0.1
//import "." as HCButton

Button {
//  HCButton.Base {
  id: root;

  TextMetrics {
    id: textMetrics
    font.family: root.font.family
    font.pointSize: Theme.largeButtonPointSize
    elide: Text.ElideNone
    //elideWidth: 100
    text: root.text
  }

  //width: parent.width
  //height: parent.height
  //anchors.fill: parent
  width: textMetrics.boundingRect.width + 30
  height: Theme.largeButtonHeight
  //pointSize: HCStyle.largeButtonPointSize
  //radius: HCStyle.largeButtonRadius
/*
  border {
    width: HCStyle.largeButtonBorder
    color: HCStyle.buttonBorderColor
  }
*/

  /*
  Component.onCompleted: {
    console.log("Sizes(" + root.text + "): " + width + ", " + textMetrics.boundingRect.width);
    console.log("font: " + root.font.family + ", " + textMetrics.font.family);
  }
  */
}
