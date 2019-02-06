/*
  see also
    https://wiki.qt.io/Qml_Styling
    https://doc.qt.io/qt-5/qtquick-controls-styles-qmlmodule.html
    https://doc.qt.io/qt-5/qml-qtquick-controls-styles-buttonstyle.html
*/
pragma Singleton

import io.github.martimm.HikingCompanion.Config 0.3

import QtQuick 2.8
import QtGraphicalEffects 1.0

Item {
  id: themeControl

  Config { id: config }

  // Called from Config to set colors only
  function changeColors ( c ) {
    console.info("Set colors");
    setSubFields(
          c.component,
          [ "foreground", "foregroundLight", "foregroundDark",
            "background", "backgroundLight", "backgroundDark",
            "okText", "notOkText", "selectedText", "selectionText"
          ],
          component.color
          );

    setSubFields(
          c.toolbar,
          [ "background", "backgroundLight", "backgroundDark"],
          component.toolbar
          );
    setSubFields( c.toolbar.border, ["color"], component.toolbar.border);
    setSubFields(
          c.toolbar.button,
          [ "foreground", "foregroundLight", "foregroundDark",
            "background", "backgroundLight", "backgroundDark"
          ],
          component.toolbar.button
          );
    setSubFields(
          c.toolbar.button.border,
          ["color"],
          component.toolbar.button.border
          );

    setSubFields(
          c.buttonrow,
          [ "background", "backgroundLight", "backgroundDark"],
          component.buttonrow
          );
    setSubFields( c.buttonrow.border, ["color"], component.buttonrow.border);
    setSubFields(
          c.buttonrow.button,
          [ "foreground", "foregroundLight", "foregroundDark",
           "background", "backgroundLight", "backgroundDark"
          ],
          component.buttonrow.button
          );
    setSubFields(
          c.buttonrow.button.border,
          ["color"],
          component.buttonrow.button.border
          );

    // Menu
    setSubFields(
          c.menu,
          ["background", "backgroundLight", "backgroundDark"],
          component.menu
          );

    setSubFields(
          c.menu.button,
          [ "foreground", "foregroundLight", "foregroundDark",
           "background", "backgroundLight", "backgroundDark"
          ],
          component.menu.button
          );

    setSubFields( c.menu.button.border, ["color"], component.menu.button.border);
  }

  // Called once from application window to set all modifiable settings
  function changeSettings ( c ) {
    console.info("Set colors and sizes");
    setSubFields(
          c.component,
          [ "foreground", "foregroundLight", "foregroundDark",
            "background", "backgroundLight", "backgroundDark",
            "okText", "notOkText", "selectedText", "selectionText"
          ],
          component.color
          );

    // Toolbar
    setSubFields(
          c.toolbar, [ "background", "backgroundLight", "backgroundDark"],
          component.toolbar
          );
    setSubFieldSizes(
          c.toolbar,
          [ "leftMargin", "rightMargin", "topMargin", "bottomMargin", "height"],
          component.toolbar
          );

    setSubFieldSizes( c.toolbar.border, [ "width"], component.toolbar.border);
    setSubFields( c.toolbar.border, [ "color"], component.toolbar.border);

    setSubFieldSizes(
          c.toolbar.button,
          [ "width", "height", "pixelSize", "radius",
            "leftMargin", "rightMargin", "topMargin", "bottomMargin"
          ],
          component.toolbar.button
          );

    setSubFields(
          c.toolbar.button,
          [ "foreground", "foregroundLight", "foregroundDark",
            "background", "backgroundLight", "backgroundDark"
          ],
          component.toolbar.button
          );

    setSubFieldSizes(
          c.toolbar.button.border,
          [ "width"],
          component.toolbar.button.border
          );

    setSubFields(
          c.toolbar.button.border,
          [ "color"],
          component.toolbar.button.border
          );

    // Button row
    setSubFields(
          c.buttonrow,
          [ "background", "backgroundLight", "backgroundDark"],
          component.buttonrow
          );
    setSubFieldSizes(
          c.buttonrow,
          [ "leftMargin", "rightMargin", "topMargin", "bottomMargin", "height"],
          component.buttonrow
          );

    setSubFieldSizes( c.buttonrow.border, [ "width"], component.buttonrow.border);
    setSubFields( c.buttonrow.border, [ "color"], component.buttonrow.border);

    setSubFieldSizes(
          c.buttonrow.button,
          [ "width", "height", "pixelSize", "radius",
            "leftMargin", "rightMargin", "topMargin", "bottomMargin"
          ],
          component.buttonrow.button
          );

    setSubFields(
          c.buttonrow.button,
          [ "foreground", "foregroundLight", "foregroundDark",
            "background", "backgroundLight", "backgroundDark"
          ],
          component.buttonrow.button
          );

    setSubFieldSizes(
          c.buttonrow.button.border,
          [ "width"],
          component.buttonrow.button.border
          );

    setSubFields(
          c.buttonrow.button.border,
          [ "color"],
          component.buttonrow.button.border
          );

    // Menu
    setSubFields(
          c.menu,
          ["background", "backgroundLight", "backgroundDark"],
          component.menu
          );
    setSubFieldSizes( c.menu, [ "width", "height"], component.menu);

    setSubFieldSizes(
          c.menu.button,
          [ "width", "height", "pixelSize", "radius",
            "leftMargin", "rightMargin", "topMargin", "bottomMargin"
          ],
          component.menu.button
          );

    setSubFields(
          c.menu.button,
          [ "foreground", "foregroundLight", "foregroundDark",
            "background", "backgroundLight", "backgroundDark"
          ],
          component.menu.button
          );

    setSubFieldSizes( c.menu.button.border, ["width"], component.menu.button.border);
    setSubFields( c.menu.button.border, ["color"], component.menu.button.border);
  }

  function setSubFields ( source, fields, destination) {
    for ( var fi = 0; fi < fields.length; fi++) {
      //console.log("Field length of " + fi + ": " + fields[fi].length);
      if ( typeof source[fields[fi]] !== "undefined" ) {
        console.log("Field " + fields[fi] + " set to " + source[fields[fi]]);
        if ( fields[fi] === "foregroundLight" ) {
          // 0.0 - 1.0 is like darker and < 0.0 is undefined
          if ( parseFloat(source[fields[fi]]) <= 1.0 ) {
            destination[fields[fi]] = destination["foreground"];
          }
          else {
            destination[fields[fi]] = Qt.lighter(
                  destination["foreground"], parseFloat(source[fields[fi]])
                  );
          }
        }

        else if ( fields[fi] === "foregroundDark" ) {
          if ( parseFloat(source[fields[fi]]) <= 1.0 ) {
            destination[fields[fi]] = destination["foreground"];
          }
          else {
            destination[fields[fi]] = Qt.darker(
                  destination["foreground"], parseFloat(source[fields[fi]])
                  );
          }
        }

        else if ( fields[fi] === "backgroundLight" ) {
          if ( parseFloat(source[fields[fi]]) <= 1.0 ) {
            destination[fields[fi]] = destination["background"];
          }
          else {
            destination[fields[fi]] = Qt.lighter(
                  destination["background"], parseFloat(source[fields[fi]])
                  );
          }
        }

        else if ( fields[fi] === "backgroundDark" ) {
          if ( parseFloat(source[fields[fi]]) <= 1.0 ) {
            destination[fields[fi]] = destination["background"];
          }
          else {
            destination[fields[fi]] = Qt.darker(
                  destination["background"], parseFloat(source[fields[fi]])
                  );
          }
        }

        else {
          destination[fields[fi]] = source[fields[fi]];
        }
      }
/*
      else if ( fields[fi].length > 1 ) {

      }
*/
      else {
        console.warn("Field " + fields[fi] + " not set");
      }
    }
  }

  function setSubFieldSizes ( source, fields, destination) {
    for ( var fi = 0; fi < fields.length; fi++) {
      if ( typeof source[fields[fi]] !== "undefined" ) {
        console.log("Field size " + fields[fi] + ": " + source[fields[fi]]
                     + " mm set to "
                     + config.pixels(parseFloat(source[fields[fi]])) + " pixels"
                     );
        destination[fields[fi]] = config.pixels(parseFloat(source[fields[fi]]));
      }
      else {
        console.warn("Field " + fields[fi] + " not set");
      }
    }
  }

  // General components
  property QtObject component: QtObject {
    property QtObject color: QtObject {
      property color foreground
      property color foregroundLight
      property color foregroundDark

      property color background
      property color backgroundLight
      property color backgroundDark

      property color okText
      property color notOkText

      property color selectedText
      property color selectionText
    }

    property QtObject toolbar: QtObject {
      property color background
      property color backgroundLight
      property color backgroundDark

      property real topMargin
      property real bottomMargin
      property real leftMargin
      property real rightMargin

      property real height

      property QtObject border: QtObject {
        property int width
        property color color
      }

      property QtObject button: QtObject {
        property int width
        property int height
        property int pixelSize
        property int radius

        property color foreground
        property color foregroundLight
        property color foregroundDark
        property color background
        property color backgroundLight
        property color backgroundDark

        property real topMargin
        property real bottomMargin
        property real leftMargin
        property real rightMargin

        property QtObject border: QtObject {
          property int width
          property color color
        }
      }
    }

    property QtObject buttonrow: QtObject {
      property color background
      property color backgroundLight
      property color backgroundDark

      property real topMargin
      property real bottomMargin
      property real leftMargin
      property real rightMargin

      property real height

      property QtObject border: QtObject {
        property int width
        property color color
      }

      property QtObject button: QtObject {
        property int width
        property int height
        property int pixelSize
        property int radius

        property color foreground
        property color foregroundLight
        property color foregroundDark
        property color background
        property color backgroundLight
        property color backgroundDark

        property real topMargin
        property real bottomMargin
        property real leftMargin
        property real rightMargin

        property QtObject border: QtObject {
          property int width
          property color color
        }
      }
    }

    property QtObject menu: QtObject {
      property int width
      property int height

      property color background
      property color backgroundLight
      property color backgroundDark

      property real topMargin
      property real bottomMargin
      property real leftMargin
      property real rightMargin

      property QtObject border: QtObject {
        property int width
        property color color
      }

      property QtObject button: QtObject {
        property int width
        property int height
        property int pixelSize
        property int radius

        property color foreground
        property color foregroundLight
        property color foregroundDark
        property color background
        property color backgroundLight
        property color backgroundDark

        property real topMargin
        property real bottomMargin
        property real leftMargin
        property real rightMargin

        property QtObject border: QtObject {
          property int width
          property color color
        }
      }
    }
/*
    // Menu properties
    property int mnWidth: 210

    // Menu button properties
    property int mnBtWidth: mnWidth - 5
    property int mnBtHeight: 50
    property int mnBtPixelSize: 40

  property int menuButtonWidth: 100
  property int menuButtonHeight: 50
  property int menuButtonPointSize: 23
*/
  }

  property QtObject pageGradient: QtObject {
/*
    property color g1: Qt.lighter( component.color.foreground, 0.50) //"#be50e0"
    property color g2: Qt.lighter( component.color.foreground, 0.99) //"#fef0f8"
    property color g3: Qt.lighter( component.color.foreground, 0.50) //"#be50e0"
    property color g4: Qt.lighter( component.color.foreground, 0.21) //"#6f305f"
    property color g5: Qt.lighter( component.color.foreground, 0.11) //"#300040"
*/
    property color g1: component.color.foreground //"#be50e0"
    property color g2: Qt.lighter( component.color.foreground, 2.0) //"#fef0f8"
    property color g3: component.color.foreground //"#be50e0"
    property color g4: Qt.darker( component.color.foreground, 1.50) //"#6f305f"
    property color g5: Qt.darker( component.color.foreground, 2.00) //"#300040"

    property real p1:  0.0
    property real p2:  0.02
    property real p3:  0.05
    property real p4:  0.5
    property real p5:  1.0
  }

  property QtObject mapParameters: QtObject {
    property real startZoomLevel: 15
    property real minZoomLevel: 6
    property real maxZoomLevel: 17
  }

  // Grid config measures
  property int cfgFieldMargin: 6
  property int cfgRowHeight: 35

  // Combobox
  property int cbxPixelSize: 35
  //property int cfgtxtPointSize: 16
  //property int cfgtxtHeight: 20

  // Label config properties
  property int lblPixelSize: 20
  property int lblFieldMargin: 6

  // TextField config properties
  property int txtfPixelSize: 20
  property int txtfFieldMargin: 6



  property int baseSize: 10
  readonly property int smallSize: 10
  readonly property int largeSize: 16
/*
  // Areas
  property color appBackgroundColor: "#500040"

  property color compBackgroundColor: "#8f0070"
  property int compRounding: 25

  // Buttons
  property color buttonBackgroundColor: "#af1098"
  property color buttonBorderColor: "#fff0fa"
*/
/*
  // Buttons
  property int smallBtWidth: 35
  property int smallBtHeight: 35
  property int smallBtPointSize: 15
  property int smallBtRadius: 10
  property int smallBtBorder: 1

  property int largeBtWidth: 100
  property int largeBtHeight: 40
  property int largeBtPointSize: 20
  property int largeBtRadius: 20
  property int largeBtBorder: 2
*/
/*
  property font smallBtFont: {
    bold: true
    underline: false
    //pixelSize: 14
    pointSize: smallBtPointSize
    family: Theme.fontFamily
  }
*/

/*
  property font largeBtFont: {
    bold: true
    underline: false
    //pixelSize: 14
    pointSize: 100
    family: Theme.fontFamily
  }
*/


  // Text
  property string fontFamily: "Symbola"
  //property color txtColor: "#fff0fa"
  //property color oktxtColor: "#a0ffa0"
  //property color noktxtColor: "#ffa0a0"
  property color selectedtxtColor: "#efa0ca"
  property color selectiontxtColor: "#efbfcf"
  property int txtPointSize: 18

  //property int cfgtxtPointSize: 16
  //property int cfgtxtHeight: 20

  property int sbWidth: 10
}
