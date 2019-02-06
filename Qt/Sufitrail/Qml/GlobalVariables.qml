/*
  Most variables are set from the application window where everything
  resides. This is an alternative way for having everything singleton.
  Also no components can be creaed when set as a singleton.
*/

pragma Singleton

import io.github.martimm.HikingCompanion.Theme 0.1

import "Button" as HCButton
import "Page" as HCPage

import QtQuick 2.9

QtObject {
  property QtObject component: QtObject {
    property QtObject toolbar: QtObject {
      property QtObject button: QtObject {
        property int type:        0
      }
    }

    property QtObject buttonrow: QtObject {
      property QtObject button: QtObject {
        property int type:        1
      }
    }

    property QtObject menu: QtObject {
      property QtObject button: QtObject {
        property int type:        2
      }
    }
  }

  // Currently displayed page.
  property HCPage.Plain currentPage
  function setCurrentPage ( newPage ) {
    currentPage = newPage;
  }

  property var applicationWindow
  function setApplicationWindow ( appWindow ) {
    applicationWindow = appWindow;
  }

  // Open menu button
  property HCButton.OpenMenu openMenu
  function setOpenMenu ( newOpenMenu ) {
    openMenu = newOpenMenu;
  }

  property Column menu
  function setMenu ( newMenu ) {
    menu = newMenu;
  }

  function setComponentFgColor( component ) {
    var fg = component.foreground;
    var clr;
    if ( component.foregroundDark !== fg ) {
      clr = component.foregroundDark;
    }
    else if ( component.foregroundLight !== fg ) {
      clr = component.foregroundLight;
    }
    else {
      clr = fg;
    }

    return clr;
  }

  function setComponentBgColor( component ) {
    var bg = component.background;
    var clr;
    if ( component.backgroundDark !== bg ) {
      clr = component.backgroundDark;
    }
    else if ( component.backgroundLight !== bg ) {
      clr = component.backgroundLight;
    }
    else {
      clr = bg;
    }

    return clr;
  }
}

