import QtQuick 2.0
import QtQuick.Controls 2.2
import QtQuick.Controls.Styles 1.4

/*
import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.Config 0.2
*/

Item {
  id: root

  width: parent.width
  height: Theme.largeButtonHeight

  property alias selectItems: selectItems
  property alias model: selectItems.model
  property alias currentText: selectItems.currentText
  property alias currentIndex: selectItems.currentIndex

  ComboBox {
    id: selectItems

    Component.onCompleted: {
      console.log("CBX config: " + width + ", " + height);
    }

  }
}
