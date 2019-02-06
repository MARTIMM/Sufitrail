import "../Page" as HCPage

import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.GlobalVariables 0.1

import QtQuick 2.9
import QtQuick.Controls 2.2


Column {
  id: menu
  property alias menu: menu

  spacing: 2

  // Menu must be kept above page(1) and button rows(50)
  width: 0
  height: parent.height
  z: 100
  clip: true

  //anchors.right: parent.right
  anchors.left: parent.left

  Component.onCompleted: {
    console.info("MM Menu WH: " + width + ", " + height);
  }

  //property alias menuEntryClicked: menuEntryClicked
  function menuEntryClicked(requestPage) {
    //console.log('current: ' + GlobalVariables.currentPage + ', request: ' + requestPage);
    if ( GlobalVariables.currentPage !== requestPage ) {
      GlobalVariables.currentPage.visible = false;
      requestPage.visible = true;
      GlobalVariables.setCurrentPage(requestPage);
    }

    if ( menu.width !== 0 ) menuAnimateClose.start()
  }
  /*
    // Current page displayed.
    property HCPage.Plain currentPage
    function setCurrentPage ( newPage ) {
      currentPage = newPage;
    }

    // Map page to go to from other places
    property HCPage.MapPage mapPage
    function setMapPage ( newMapPage ) {
      mapPage = newMapPage;
    }
*/
  // Set page to home page. The home pages will not have this button.
  function setHomePage() {
    //console.log("homeButton clicked");
    //console.log('current: ' + GlobalVariables.currentPage);
    GlobalVariables.currentPage.visible = false;
    GlobalVariables.applicationWindow.mapPage.visible = true;
    GlobalVariables.setCurrentPage(GlobalVariables.applicationWindow.mapPage);
    //openMenu.visible = true
  }

  // Open and close menu animation
  property alias menuAnimateOpen: menuAnimateOpen
  SequentialAnimation {
    id: menuAnimateOpen
    NumberAnimation {
      target: GlobalVariables.menu
      property: "width"
      duration: 1000
      from: 0
      to: Theme.component.menu.width
      easing.type: Easing.OutBounce
    }
  }

  property alias menuAnimateClose: menuAnimateClose
  SequentialAnimation {
    id: menuAnimateClose
    NumberAnimation {
      target: GlobalVariables.menu
      property: "width"
      duration: 1000
      from: Theme.component.menu.width
      to: 0
      easing.type: Easing.OutBounce
    }

    /*
      onStopped: {
        currentPage.openMenu.visible = true;
      }
  */
  }
}

