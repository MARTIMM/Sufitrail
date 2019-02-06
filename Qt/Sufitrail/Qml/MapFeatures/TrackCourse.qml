import QtQuick 2.0
import QtLocation 5.9

MapPolyline {
  id: root
  line.width: 4
  line.color: '#c80000' //'#785a3a'
/*
  BorderImage {
    id: name
    source: "qrc:Assets/Icon/Android/xhdpi.png"
    width: 100; height: 100
    border.left: 1; border.top: 1
    border.right: 1; border.bottom: 1
  }
*/

  // Set from the TracksPage when a track is selected
  property var boundary;

  // Function to zoom in on the current selected track
  function zoomOnCurrentTrack() {
    console.log("Features map: " + featuresMap.trackCourse.boundary);
    if ( featuresMap.trackCourse.boundary ) {
      hikingCompanionMap.visibleRegion = featuresMap.trackCourse.boundary;
      hikingCompanionMap.zoomLevel = hikingCompanionMap.zoomLevel - 0.2;
    }
  }
}
