/* ----------------------------------------------------------------------------
  Author: Marcel Timmerman
  License: ...
  Copyright: © Sultanstrail 2018 .. ∞
  Copyright: © Sufitrail 2018 .. ∞
  Copyright: © Marcel Timmerman 2018 .. ∞

  This is the main page where the root of the gui tree is described. This is
  mainly an empty page area wherein pages and a menu are created.
*/
import "../../Qml/Page" as HCPage
import "../../Qml/Parts" as HCParts
import "../../Qml/Button" as HCButton


import io.github.martimm.HikingCompanion.Theme 0.1
import io.github.martimm.HikingCompanion.GlobalVariables 0.1
import io.github.martimm.HikingCompanion.Config 0.3


import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Window 2.11


ApplicationWindow {
  id: root

  Component.onCompleted: {
    GlobalVariables.setApplicationWindow(this);
    GlobalVariables.setCurrentPage(mapPage);
    GlobalVariables.setMenu(menu);

    // Get the hiking companion settings for default colors and
    // to specify sizes and other properties.
    var t = config.getTheme(true);
    //console.log("style: " + t);
    Theme.changeSettings(JSON.parse(t));

    // Change colors only for specific hike when different
    t = config.getTheme(false);
    //console.log("style: " + t);
    Theme.changeColors(JSON.parse(t));

    config.setWindowSize( width, height);
  }

  Config { id: config }

  title: qsTr("Your Hiking Companion")

  visible: true

  // Sizes are not important because on mobile devices it always scales
  // to the screen width and height. For desktop I use a scaled
  // Samsung tablet size (2048 x 1536 of Samsung Galaxy Tab S2).
  width: 600
  height: 450

  // The changes are only fired in desktop apps
  onXChanged: { setWindowSize(); }
  onYChanged: { setWindowSize(); }
  onWidthChanged: { setWindowSize(); }
  onHeightChanged: { setWindowSize(); }
  function setWindowSize () {
    config.setWindowSize( width, height);
/*
    console.log("width x height in mm: "
                + config.fysLength(width) + ", " + config.fysLength(height)
                );
*/
  }

  property alias aboutPage: aboutPage
  HCPage.AboutPage { id: aboutPage }

  property alias configPage: configPage
  HCPage.ConfigPage { id: configPage }

  property alias userTrackConfigPage: userTrackConfigPage
  HCPage.UserTrackConfigPage { id: userTrackConfigPage }

  property alias exitPage: exitPage
  HCPage.ExitPage { id: exitPage }

  property alias mapPage: mapPage
  HCPage.MapPage { id: mapPage; visible: true }

  property alias tracksPage: tracksPage
  HCPage.TracksPage { id: tracksPage }

  // Menu
  HCParts.MenuColumn {
    id: menu

    property alias mapButton: mapButton
    HCButton.MenuButton {
      id: mapButton
      text: qsTr("🌍 Map")
      //      text: qsTr("Map")
      onClicked: {
        GlobalVariables.menu.menuEntryClicked(mapPage);
      }
    }

    property alias tracksButton: tracksButton
    HCButton.MenuButton {
      id: tracksButton
      text: qsTr("🚶 Tracks")
      //      text: qsTr("Tracks")
      onClicked: {
        GlobalVariables.menu.menuEntryClicked(tracksPage);
      }
    }
/*
    property alias configButton: configButton
    HCButton.MenuButton {
      id: configButton
      text: "🛠 " + qsTr("Config")
      //      text: qsTr("Config")
      onClicked: {
        GlobalVariables.menu.menuEntryClicked(configPage);
      }
    }

    property alias userTrackConfigButton: userTrackConfigButton
    HCButton.MenuButton {
      id: userTrackConfigButton
      text: qsTr("📡 Recording")
      //      text: qsTr("Recording")

      onClicked: {
        GlobalVariables.menu.menuEntryClicked(userTrackConfigPage);
      }
    }
*/
    property alias aboutButton: aboutButton
    HCButton.MenuButton {
      id: aboutButton
      text: qsTr("👥 About")
      //      text: qsTr("About")
      onClicked: {
        GlobalVariables.menu.menuEntryClicked(aboutPage);
      }
    }

    property alias exitButton: exitButton
    HCButton.MenuButton {
      Component.onCompleted: {
        if ( Qt.platform.os == "Android" ) {
          txt = "■ ";
        }

        else {
          txt = "⏻ ";
        }
        txt += qsTr("Exit");
      }

      id: exitButton
      property string txt
      text: txt
      //       text: qsTr("Exit")
      onClicked: {
        GlobalVariables.menu.menuEntryClicked(exitPage);
      }
    }
  }
}
