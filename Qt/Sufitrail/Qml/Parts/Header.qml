import QtQuick 2.11
//import QtQuick.Controls 2.4
//import QtQuick.Layouts 1.3

// row placed on top of a page
Row {
  id: header

  //property var headerRowText: qsTr("Undefined page")
  property alias headerText: headerText.text

  width: parent.width
  height: 20

  anchors.topMargin: 5
  anchors.bottomMargin: 5

  Text {
    id: headerText
    horizontalAlignment: Text.AlignHCenter
  }
}
