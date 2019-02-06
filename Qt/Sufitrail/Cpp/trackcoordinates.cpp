#include "trackcoordinates.h"
#include "configdata.h"


// ----------------------------------------------------------------------------
void TrackCoordinates::addCoordinate( double lon, double lat, double alt) {

  Coord c;
  c.longitude = lon;
  c.latitude = lat;
  c.altitude = alt;

  _coordinates.push_back(c);
}

// ----------------------------------------------------------------------------
void TrackCoordinates::saveUserTrackNames(
    QString hikeTitle, QString hikeDesc, QString hikeKey
    ) {
  ConfigData *cd = ConfigData::instance();
  cd->saveUserTrackNames( hikeTitle, hikeDesc, hikeKey);
}

// ----------------------------------------------------------------------------
bool TrackCoordinates::saveUserTrack(
      QString hikeKey, QString trackTitle, QString trackDesc, QString trackType
      ) {
  ConfigData *cd = ConfigData::instance();
  return cd->saveUserTrack(
        hikeKey, trackTitle, trackDesc, trackType, _coordinates
        );
}
