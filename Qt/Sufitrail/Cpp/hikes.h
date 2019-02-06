#ifndef HIKES_H
#define HIKES_H

#include <QObject>
#include <QVariantList>
#include <QList>
#include <QGeoCoordinate>
#include <QGeoPath>
#include <QHash>
#include <QLoggingCategory>

// -----------------------------------------------------------------------------
Q_DECLARE_LOGGING_CATEGORY(hikes)

// -----------------------------------------------------------------------------
class Hikes : public QObject {

  Q_OBJECT

public:
  inline explicit Hikes(QObject *parent = nullptr) : QObject(parent) { }

  //inline QString description() { return _description; }

  inline QList<QObject *> gpxFileList() { return _gpxFileList; }
  inline QVariantList gpxTrackList() { return _gpxTrackList; }

  inline QGeoPath coordinateList() { return QGeoPath(_coordinateList); }
  inline QGeoPath boundary() { return QGeoPath(_boundary); }

  void defineHikeList();
  QStringList hikeList();
  QVariantList trackList();
  void loadCoordinates(int index);

  QHash<QString, QString> osmCacheFilenames( int minZoom, int maxZoom);
  int lon2tileX( double lon, int zoomLevel);
  int lat2tileY( double lat, int zoomLevel);
  void insertTileCoords(
      int zi, int x, int y, QHash<QString, QString> *osmCacheFilenames
      );
  void createOsmCache(QHash<QString, QString> osmCacheFilenames);

  QGeoCoordinate findClosestPointOnRoute(QGeoCoordinate c);
  static double distanceToPointOnRoute( QGeoCoordinate c1, QGeoCoordinate c2);

signals:

public slots:

private:
  //void _setGpxFiles();

  QList<QObject *> _gpxFileList;
//TODO track list not needed, remove
  QVariantList _gpxTrackList;
  QString _gpxPath;
  //QString _description;

  // title => hike table name. titles from the tables are shown in the drop
  // list and after selection it must be used to find the table.
  QStringList _hikeList;
  QVariantList _trackList;

  QList<QGeoCoordinate> _coordinateList;
  QList<QGeoCoordinate> _boundary;
};

#endif // HIKES_H
