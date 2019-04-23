#ifndef CONFIG_H
#define CONFIG_H

#include "configdata.h"
#include "trackcoordinates.h"
//#include <QObject>
//#include <QSettings>

class Config : public QObject {

  Q_OBJECT

public:
  inline Config(QObject *parent = nullptr) : QObject(parent) {
    _configData = ConfigData::instance();
  }

  Q_INVOKABLE inline QString dataDir() { return _configData->dataDir(); }
  Q_INVOKABLE inline QString tileCacheDir() { return _configData->tileCacheDir(); }
  Q_INVOKABLE inline QString featureCacheDir() { return _configData->featureCacheDir(); }
  Q_INVOKABLE inline QString dataShareDir() { return _configData->dataShareDir(); }

  //Q_INVOKABLE inline void checkForNewHikeData() {
  //  _configData->checkForNewHikeData();
  //}
  //Q_INVOKABLE inline void cleanupTracks() { _configData->cleanupTracks(); }
  //Q_INVOKABLE inline void cleanupHike() { _configData->cleanupHike(); }


  Q_INVOKABLE inline void setSetting( QString name, QString value) {
    _configData->setSetting( name, value);
  }
  Q_INVOKABLE inline void setSetting( QString name, int value) {
    _configData->setSetting( name, value);
  }
  Q_INVOKABLE inline QString getSetting(QString name, QSettings *s = nullptr) {
    return _configData->getSetting( name, s);
  }

  QStringList inline readKeys( QString group, QSettings *s = nullptr) {
    return _configData->readKeys( group, s);
  }
  //QString inline hikeEntryKey() { return _configData->hikeEntryKey(); }
  QString inline hikeTableName(QString hikeEntryKey) {
    return _configData->hikeTableName(hikeEntryKey);
  }
  QString inline tracksTableName( QString hikeTableName, int trackCount) {
    return _configData->tracksTableName( hikeTableName, trackCount);
  }

  Q_INVOKABLE inline void setGpxFileIndexSetting(int currentIndex) {
    _configData->setGpxFileIndexSetting(currentIndex);
  }
  Q_INVOKABLE inline int getGpxFileIndexSetting() {
    return _configData->getGpxFileIndexSetting();
  }

  Q_INVOKABLE inline QString getHtmlPageFilename( QString pageName) {
    return _configData->getHtmlPageFilename(pageName);
  }

  Q_INVOKABLE inline QString getTheme( bool takeHCSettings ) {
    return _configData->getTheme(takeHCSettings); }

/*
  Q_INVOKABLE inline QString getHCVersion() {
    return _configData->getHCVersion();
  }
*/
  Q_INVOKABLE inline QStringList getHikeVersions() {
    return _configData->getHikeVersions();
  }
  Q_INVOKABLE inline QStringList getVersions() {
    return _configData->getVersions();
  }
/*
  Q_INVOKABLE inline void defineHikeList() {
    _configData->defineHikeList();
    emit hikeListDefined();
  }
*/
  //Q_INVOKABLE inline QStringList hikeList() { return _configData->hikeList(); }
  Q_INVOKABLE inline QVariantList trackList() { return _configData->trackList(); }

  //inline QString description() { return _configData->description(); }

  Q_INVOKABLE inline QList<QObject *> gpxFileList() { return _configData->gpxFileList(); }
  Q_INVOKABLE inline QVariantList gpxTrackList() { return _configData->gpxTrackList(); }

  Q_INVOKABLE inline QGeoPath coordinateList() { return _configData->coordinateList(); }
  Q_INVOKABLE inline QGeoPath boundary() { return _configData->boundary(); }

  Q_INVOKABLE inline void loadCoordinates(int index) {
    _configData->loadCoordinates(index);
    emit coordinatesReady();
  }

  Q_INVOKABLE inline QGeoCoordinate findClosestPointOnRoute(QGeoCoordinate c) {
    return _configData->findClosestPointOnRoute(c);
  }

  Q_INVOKABLE inline double distanceToPointOnRoute(
      QGeoCoordinate c1, QGeoCoordinate c2
      ) {
    return _configData->distanceToPointOnRoute( c1, c2);
  }

  Q_INVOKABLE inline int windowWidth() {
    return _configData->windowWidth();
  }
  Q_INVOKABLE inline int windowHeight() {
    return _configData->windowHeight();
  }

  Q_INVOKABLE inline void setWindowSize( int w, int h) {
    _configData->setWindowSize( w, h);
  }
  Q_INVOKABLE inline double fysLength( int pixels ) {
    return _configData->fysLength(pixels);
  }
  Q_INVOKABLE inline int pixels( double fysLength ) {
    return _configData->pixels(fysLength);
  }

signals:
  //void hikeListDefined();
  void coordinatesReady();

public slots:

private:
  ConfigData *_configData;
};

#endif // CONFIG_H
