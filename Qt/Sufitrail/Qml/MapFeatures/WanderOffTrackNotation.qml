import QtQuick 2.0
import QtLocation 5.9

MapPolyline {
  id: wanderOffTrackNotation
  line.width: 4
  line.color: '#dfffff'
  /*
  property alias mpl: mpl
  path: Path {
    id: mpl
    startX: currentLocationFeature.center.longitude
    startY: currentLocationFeature.center.latitude

    property alias psvg: psvg
    PathLine { id: psvg }
  }
*/

  // Draw a line when the current location is too far away from the
  // currently selected track. It shows as a light line from the current
  // location to the closest point on the track.
  function setWanderOffTrackNotation() {
    //console.log("Calculate dist from route");
    var closestPointOnRoute = config.findClosestPointOnRoute(
          currentLocationFeature.center
          );
    var dist = config.distanceToPointOnRoute(
          closestPointOnRoute,
          currentLocationFeature.center
          );
    //console.log("cp: " + closestPointOnRoute + ", dist: " + dist);

    var path = [];
    // Check if we are further than 500 meters away
    if ( dist > 500 ) {
      //console.log("Path: " + path.length + ", " + path + ", " + currentLocationFeature.center.longitude);
      path.push(
            { "longitude": currentLocationFeature.center.longitude,
              "latitude": currentLocationFeature.center.latitude
            } );
      path.push(
            { "longitude": closestPointOnRoute.longitude,
              "latitude": closestPointOnRoute.latitude
            } );
      wanderOffTrackNotation.path = path;
    }

    else {
      // Clear the line using an empty array
      wanderOffTrackNotation.path = path;
    }
  }
}
