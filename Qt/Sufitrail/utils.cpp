#include "utils.h"

#include <thread>
#include <chrono>

#include <QDebug>
#include <QQmlApplicationEngine>
#include <QSettings>
#include <QDir>
#include <QFile>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
// Global variable defined in main.cpp and has loaded the Application.qml
extern QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
Utils::Utils(QObject *parent)
  : QObject(parent) {

  // Target root path where data is stored for public access
  _publicLoc = QStandardPaths::standardLocations(
        QStandardPaths::GenericDataLocation
        ).first();
  _programname = QCoreApplication::applicationName();

  _dataRootDir = _publicLoc + "/" + _programname;
  int size = _dataRootDir.length() + 1;
/*
  // Prepare the shared memory to hold the target path
  _smForPath.setKey("HikingCompanionPath");
  if ( _smForPath.isAttached() ) _smForPath.detach();
  if ( ! _smForPath.create(size) ) {
    qDebug() << "TD Not able to create sm" << _smForPath.errorString();
  }

  if ( _smForPath.isAttached() || _smForPath.attach() ) {

    qDebug() << "TD Attached to sm";
    _smForPath.lock();
    qDebug() << "TD locked";

    char *data = reinterpret_cast<char *>(_smForPath.data());
    _path = new QString(_dataRootDir);
    char *p = _path->toLatin1().data();
    strcpy( data, p);

    _smForPath.unlock();
    qDebug() << "TD unlocked";
  }

  else {
    qDebug() << "TD Not attached to sm" << _smForPath.errorString();
  }
*/
}

// ----------------------------------------------------------------------------
Utils::~Utils() {
//  _smForPath.detach();
}

// ----------------------------------------------------------------------------
QString Utils::dataRootDir() {
  return _dataRootDir;
}

// ----------------------------------------------------------------------------
bool Utils::work() {

  QObject *ro = applicationEngine->rootObjects().first();

  qDebug() << "Init worker";
  ro->setProperty( "installButtonOn", false);

  ro->setProperty( "progressFrom", 0.0);
  ro->setProperty( "progressText", "Initialize setup");

  // Cleanup before start, maybe there are some remnants left
  QDir *dd = new QDir(_dataRootDir);
  if ( dd->exists() ) dd->removeRecursively();

  QSettings *s = new QSettings(
        QString(":HikeData/hike.conf"),
        QSettings::IniFormat
        );
  qDebug() << "Fn:" << s->fileName();

  QString tracksDir = s->value("tracksdir").toString();
  dd = new QDir(":HikeData/" + tracksDir);
  QStringList tracks = dd->entryList( QDir::Files, QDir::Name);
  qDebug() << tracksDir << ",nbr tracks:" << tracks.count();

  QString photoDir = s->value("photodir").toString();
  dd = new QDir(":HikeData/" + photoDir);
  QStringList photos = dd->entryList( QDir::Files, QDir::Name);

  QString noteDir = s->value("notedir").toString();
  dd = new QDir(":HikeData/" + noteDir);
  QStringList notes = dd->entryList( QDir::Files, QDir::Name);

  QString featureDir = s->value("featuredir").toString();
  dd = new QDir(":HikeData/" + featureDir);
  QStringList features = dd->entryList( QDir::Files, QDir::Name);

  ro->setProperty(
        "progressTo",
        tracks.count() + photos.count() + notes.count() + features.count()
        + 3
        );

  int progress = 0;
  progress = _transportDataToPublicLocation( ro, "Copy track: ", progress, tracksDir, tracks);
  std::this_thread::sleep_for(std::chrono::milliseconds(300));
  progress = _transportDataToPublicLocation( ro, "Copy photo: ", progress, photoDir, photos);
  std::this_thread::sleep_for(std::chrono::milliseconds(300));
  progress = _transportDataToPublicLocation( ro, "Copy note: ", progress, noteDir, notes);
  std::this_thread::sleep_for(std::chrono::milliseconds(300));
  progress = _transportDataToPublicLocation( ro, "Copy feature: ", progress, featureDir, features);

  std::this_thread::sleep_for(std::chrono::milliseconds(600));

  ro->setProperty( "progressValue", progress++);
  QFile::copy( ":HikeData/hike.conf", _dataRootDir + "/hike.conf");

  ro->setProperty( "progressValue", progress++);
  ro->setProperty( "progressText", "Start HikingCompanion");

  qDebug() << "Copied, start sharing...";
  installImpl();
  qDebug() << "Done sharing";

  std::this_thread::sleep_for(std::chrono::milliseconds(2000));
  ro->setProperty( "progressValue", progress++);
  ro->setProperty( "progressText", "Cleanup");
  //  qDebug() << "Remove" << _dataRootDir;
  //  dd = new QDir(_dataRootDir);
  //  dd->removeRecursively();

//  _smForPath.detach();
//  qDebug() << "TD detached";

  std::this_thread::sleep_for(std::chrono::milliseconds(500));
  ro->setProperty( "progressText", "Finished");

  ro->setProperty( "quitButtonOn", true);

  return true;
}

// ----------------------------------------------------------------------------
int Utils::_transportDataToPublicLocation(
    QObject *ro, QString text, int startProgress,
    QString directory, QStringList files
    ) {

  QString destDirname = _dataRootDir + "/" + directory;
  QDir dest(destDirname);
  qDebug() << "Dest dir:" << destDirname;
  if ( !dest.exists() ) dest.mkpath(destDirname);

  for ( int fi = 0; fi < files.count(); fi++) {
    qDebug() << ":HikeData/" + directory + "/" + files[fi]
                << " --> " << destDirname + "/" + files[fi];

    QFile::copy( ":HikeData/" + directory + "/" + files[fi],
                 destDirname + "/" + files[fi]
                 );

    qDebug() << "Progress:" << startProgress + fi;
    ro->setProperty( "progressValue", startProgress + fi);
    ro->setProperty( "progressText", text + files[fi]);
  }

  return startProgress + files.count();
}
