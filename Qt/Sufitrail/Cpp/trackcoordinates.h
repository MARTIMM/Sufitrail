#ifndef TRACKCOORDINATES_H
#define TRACKCOORDINATES_H

#include <QObject>

class Coord {
public:
  double longitude;
  double latitude;
  double altitude;
};

class TrackCoordinates : public QObject
{
  Q_OBJECT

public:
  explicit inline TrackCoordinates(QObject *parent = nullptr) : QObject(parent) { }
  Q_INVOKABLE inline void init() { _coordinates = {}; }
  Q_INVOKABLE inline std::vector<Coord> getCoordinates() { return _coordinates; }
  Q_INVOKABLE void addCoordinate( double lon, double lat, double alt);

  Q_INVOKABLE void saveUserTrackNames(
      QString hikeTitle, QString hikeDesc, QString hikeKey
      );
  Q_INVOKABLE bool saveUserTrack(
      QString hikeKey, QString trackTitle, QString trackDesc, QString trackType
      );

signals:

public slots:

private:

  std::vector<Coord> _coordinates = {};
};

#endif // TRACKCOORDINATES_H
