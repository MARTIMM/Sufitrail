#ifndef GPXFILE_H
#define GPXFILE_H

#include <QObject>
#include <QXmlStreamReader>
#include <QGeoCoordinate>

// ----------------------------------------------------------------------------
class GpxFile : public QObject {

  Q_OBJECT
  Q_PROPERTY( QString name READ name CONSTANT)

public:
  explicit GpxFile(QObject *parent = nullptr) : QObject(parent) { }

  inline QString name() { return _name; }
  inline QString gpxFilename() { return _gpxFilename; }
  inline QString gpxPath() { return _gpxPath; }
  inline QString gpxFilePath() {
    return QString("%1/%2").arg(_gpxPath).arg(_gpxFilename);
  }

  inline QList<QGeoCoordinate> coordinateList() {
    return GpxFile::coordinateList(_gpxPath + "/" + _gpxFilename);
  }

  inline QList<QGeoCoordinate> boundary() {
    return GpxFile::boundary(
          GpxFile::coordinateList(_gpxPath + "/" + _gpxFilename)
          );
  }


  void setGpxFilename( QString gpxPath, QString gpxFilename);

  static QList<QGeoCoordinate> coordinateList(QString gpxFilePath);
  static QList<QGeoCoordinate> boundary(QList<QGeoCoordinate> coordinateList);

  static double geoDistance( double lon1, double lat1, double lon2, double lat2);
  static double trackDistance(QList<QGeoCoordinate> coordinateList);

signals:

public slots:

private:

  //QString _parseMetadata(QXmlStreamReader &xml);
  void _parseTrackdata(QXmlStreamReader &xml);

  QString _name;

  QString _gpxFilename;
  QString _gpxPath;
  bool _exists;
};

#endif // GPXFILE_H
