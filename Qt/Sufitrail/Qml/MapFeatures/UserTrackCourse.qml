import QtQuick 2.0
import QtLocation 5.9

MapPolyline {
  id: root
  line.width: 4
  line.color: '#00ff8f'
  /*
    BorderImage {
      id: name
      source: "qrc:Assets/Icon/Android/xhdpi.png"
      width: 100; height: 100
      border.left: 1; border.top: 1
      border.right: 1; border.bottom: 1
    }
  */

  function init() {
    userTrackCourse.path = [];
  }

  function addCoordinate( longitude, latitude) {
    var path = userTrackCourse.path;
    path.push(
          { "longitude": longitude,
            "latitude": latitude
          } );
    userTrackCourse.path = path;
  }
}
