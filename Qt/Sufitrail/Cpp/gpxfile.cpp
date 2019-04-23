#include "gpxfile.h"
#include "config.h"

#include <QDebug>
#include <QFile>
#include <cmath>

// ----------------------------------------------------------------------------
void GpxFile::setGpxFilename( QString gpxPath, QString gpxFilename) {

  _gpxFilename = gpxFilename;
  _gpxPath = gpxPath;
  QFile gpxFile(_gpxPath + "/" + _gpxFilename);
  _exists = gpxFile.exists();
  qDebug() << "File:" << _gpxPath + "/" + _gpxFilename << _exists;
/*
  if ( !gpxFile.open(QIODevice::ReadOnly | QIODevice::Text) ) {
//Todo error must be shown in status on screen
    qDebug() << QString("Open gpx file %1: %2").arg(_gpxFilename).arg(gpxFile.errorString());
    return; // "";
  }

  bool metaFound = false;
  bool trackFound = false;
  QXmlStreamReader xml(&gpxFile);
  while ( !xml.atEnd() && !xml.hasError() ) {
    QXmlStreamReader::TokenType token = xml.readNext();

    if ( token == QXmlStreamReader::StartDocument ) continue;

    if ( token == QXmlStreamReader::StartElement ) {
      if ( xml.name() == "metadata" ) {
        xml.readNext();
        metaFound = true;
      }

      else
      if ( xml.name() == "trk" ) {
        xml.readNext();
        _parseTrackdata(xml);
        trackFound = true;
      }

      if ( metaFound && trackFound ) break;
    }
  }

  gpxFile.close();
*/
}

/*
// ----------------------------------------------------------------------------
// process metadata in gpx file
QString GpxFile::_parseMetadata(QXmlStreamReader &xml) {

  QString description;

  while ( !( xml.tokenType() == QXmlStreamReader::EndElement &&
             xml.name() == "metadata"
           )
        ) {

    if ( xml.tokenType() == QXmlStreamReader::StartElement ) {
      if ( xml.name() == "description" ) {
        description = xml.readElementText();
        break;
      }
    }

    xml.readNext();
  }

  return description;
}
*/
/*
// ----------------------------------------------------------------------------
// process track data in gpx file to get name of the track
void GpxFile::_parseTrackdata(QXmlStreamReader &xml) {
  while ( !( xml.tokenType() == QXmlStreamReader::EndElement &&
             xml.name() == "trk"
           )
        ) {

    if ( xml.tokenType() == QXmlStreamReader::StartElement ) {
      if ( xml.name() == "name" ) {
        _name = xml.readElementText();
        break;
      }
    }

    xml.readNext();
  }
}
*/

// ----------------------------------------------------------------------------
// Read the list of coordinates from the gpx file and return the list
QList<QGeoCoordinate> GpxFile::coordinateList(QString gpxFilePath) {

  QList<QGeoCoordinate> coordinateList;
  coordinateList.clear();
  //int count = 0;

  QFile gpxFile(gpxFilePath);
  if ( !gpxFile.open(QIODevice::ReadOnly | QIODevice::Text) ) {
    //Todo error must be shown in status on screen
    qDebug() << QString("Open gpx file %1: %2").arg(gpxFilePath).arg(gpxFile.errorString());
    return coordinateList;
  }

  QXmlStreamReader xml(&gpxFile);
  QXmlStreamReader::TokenType token;
  while ( !xml.atEnd() && !xml.hasError() ) {
    token = xml.readNext();
    if ( token == QXmlStreamReader::StartElement && xml.name() == "trkpt" ) {
      QXmlStreamAttributes attr = xml.attributes();
      double lat = attr.value("lat").toDouble();
      double lon = attr.value("lon").toDouble();
      QGeoCoordinate *gc = new QGeoCoordinate();
      gc->setLatitude(lat);
      gc->setLongitude(lon);
      coordinateList.append(*gc);

      //qDebug() << "[" << count++ << "] lon: " << lon << ", lat: " << lat;
      xml.readNext();
    }
  }

  return coordinateList;
}

// ----------------------------------------------------------------------------
QList<QGeoCoordinate> GpxFile::boundary(QList<QGeoCoordinate> coordinateList) {

  QList<QGeoCoordinate> bounds;
  bounds.clear();

  double v;
  double minlon = 10000;
  double maxlon = -10000;
  double minlat = 10000;
  double maxlat = -10000;

  Config *cfg = new Config();

  //QString entryKey = cfg->hikeEntryKey();
  //QString tableName = cfg->hikeTableName(entryKey);
  int index = cfg->getSetting("General/gpxfileindex").toInt();
  //QString tracksTableName = cfg->tracksTableName( tableName, index);
  QString tracksTableName = QString("Track%1").arg(index);
  QString x = cfg->getSetting(tracksTableName + "/minlon");
/*
  if ( x == "" ) {
    qDebug() << "Calculate boundaries and store in settings";
    for ( int ci = 0; ci < coordinateList.count(); ci++) {
      QGeoCoordinate c = coordinateList.at(ci);
      if ( (v = c.longitude()) < minlon ) minlon = v;
      if ( v > maxlon ) maxlon = v;
      if ( (v = c.latitude()) < minlat ) minlat = v;
      if ( v > maxlat ) maxlat = v;
    }

    cfg->setSetting( tracksTableName + "/minlon", QString("%1").arg(minlon));
    cfg->setSetting( tracksTableName + "/maxlon", QString("%1").arg(maxlon));
    cfg->setSetting( tracksTableName + "/minlat", QString("%1").arg(minlat));
    cfg->setSetting( tracksTableName + "/maxlat", QString("%1").arg(maxlat));
  }

  else {
*/
    qDebug() << "Found boundaries in settings";
    minlon = cfg->getSetting(tracksTableName + "/minlon").toDouble();
    maxlon = cfg->getSetting(tracksTableName + "/maxlon").toDouble();
    minlat = cfg->getSetting(tracksTableName + "/minlat").toDouble();
    maxlat = cfg->getSetting(tracksTableName + "/maxlat").toDouble();
//  }

  QGeoCoordinate *gc = new QGeoCoordinate();
  gc->setLatitude(minlat);
  gc->setLongitude(minlon);
  bounds.append(*gc);

  gc = new QGeoCoordinate();
  gc->setLatitude(maxlat);
  gc->setLongitude(maxlon);
  bounds.append(*gc);

  return bounds;
}

// ----------------------------------------------------------------------------
double GpxFile::trackDistance(QList<QGeoCoordinate> coordinateList) {

  // Check for enough number of coordinates
  if ( coordinateList.count() < 2 ) return 0;

  double trackDistance = 0;
  double lon1 = coordinateList[0].longitude();
  double lat1 = coordinateList[0].latitude();
  qDebug() << "coordinate 0: " << lon1 << lat1;
  for ( int ci = 1; ci < coordinateList.count(); ci++) {
    double lon2 = coordinateList[ci].longitude();
    double lat2 = coordinateList[ci].latitude();
    trackDistance += GpxFile::geoDistance( lon1, lat1, lon2, lat2);
    if ( ci < 10 )
      qDebug() << "coordinate n + dist: " << lon2 << lat2 << trackDistance;

    // prepare for next
    lon1 = lon2;
    lat1 = lat2;
  }

  qDebug() << "Total:" << trackDistance;
  return trackDistance;
}

// ----------------------------------------------------------------------------
// Calculate distance between two points on earth using the Haversine formula.
// It returns the distance in metres.
double GpxFile::geoDistance(
    double lon1, double lat1, double lon2, double lat2
    ) {

  // φ is latitude, λ is longitude, R is earth’s radius in metres
  // (mean radius = 6371km);
  // note that angles need to be in radians to pass to trig functions!
  double R = 6371e3; // metres
  double phi1 = lat1 * M_PI / 100.0;
  double phi2 = lat2 * M_PI / 100.0;
  double deltaPhi = (lat1 - lat2) * M_PI / 100.0;
  double deltaLambda = (lon1 - lon2) * M_PI / 100.0;

  double a = sin(deltaPhi/2) * sin(deltaPhi/2) +
          cos(phi1) * cos(phi2) *
          sin(deltaLambda/2) * sin(deltaLambda/2);
  double c = 2 * atan2( sqrt(a), sqrt(1-a));

  double d = R * c;

  return d;
}
