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
Utils::Utils(QObject *parent)
  : QObject(parent), _smForPath("HikingCompanionPath") {

  _smForPath.create(1024);
qDebug() << "Att?:" << _smForPath.isAttached();
  if ( _smForPath.isAttached() | _smForPath.attach() ) {

    qDebug() << "TD Attached to sm";
    _smForPath.lock();
    qDebug() << "TD locked";

    char *data = reinterpret_cast<char *>(_smForPath.data());
    _path = new QString("/home/marcel");
    char *p = _path->toLatin1().data();
    strcpy( data, p);

    _smForPath.unlock();
    qDebug() << "TD unlocked";
  }

  else {
    qDebug() << "TD Not attached to sm" << _smForPath.errorString();
  }
}

// ----------------------------------------------------------------------------
Utils::~Utils() {

//  QSharedMemory smForPath(QString("HikingCompanionPath"));
  _smForPath.detach();
  qDebug() << "TD detached";
}

// ----------------------------------------------------------------------------
// Global variable defined in main.cpp and has loaded the Application.qml
extern QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
bool Utils::work() {

  QObject *ro = applicationEngine->rootObjects().first();

  qDebug() << "Init worker";
  ro->setProperty( "installButtonOn", false);

  ro->setProperty( "progressFrom", 0.0);
  ro->setProperty( "progressText", "Initialize setup");

  QSettings *s = new QSettings(
        QString(":HikeData/hike.conf"),
        QSettings::IniFormat
        );
  qDebug() << "Fn:" << s->fileName();

  QString tracksDir = s->value("tracksdir").toString();
  QDir *dd = new QDir(":HikeData/" + tracksDir);
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
        );
/*
  ro->setProperty( "progressText", "Copy tracks");
  ro->setProperty( "progressText", "Copy features");
  ro->setProperty( "progressText", "Copy notes");
  ro->setProperty( "progressText", "Copy photo's");
*/
  int progress = 0;
  progress = _transportDataToPublicLocation( ro, "Copy track: ", progress, tracksDir, tracks);
  progress = _transportDataToPublicLocation( ro, "Copy photo: ", progress, photoDir, photos);
  progress = _transportDataToPublicLocation( ro, "Copy note: ", progress, noteDir, notes);
  progress = _transportDataToPublicLocation( ro, "Copy feature: ", progress, featureDir, features);
/*
  for ( double progress = 1.0; progress < 6.0; progress += 1.0 ) {
    ro->setProperty( "progressValue", progress);
    ro->setProperty(
          "progressText",
          QString("progress ") + QString::number(progress)
          );
    std::this_thread::sleep_for(std::chrono::milliseconds(600));
  }
*/
  ro->setProperty( "progressText", "Start HikingCompanion");

  qDebug() << "Copied, start sharing...";
  installImpl();
  qDebug() << "Done sharing";

  ro->setProperty( "progressText", "Cleanup");
  ro->setProperty( "progressText", "Finished");

  ro->setProperty( "quitButtonOn", true);

  return true;
}

// ----------------------------------------------------------------------------
int Utils::_transportDataToPublicLocation(
    QObject *ro,
    QString text,
    int startProgress,
    QString directory,
    QStringList files
    ) {

  QString publicLoc = QStandardPaths::standardLocations(
        QStandardPaths::GenericDataLocation
        ).first();
/*
  ro->setProperty( "progressText", text);
  ro->setProperty( "progressValue", progress);
  ro->setProperty(
        "progressText",
        QString("progress ") + QString::number(progress)
        );
  std::this_thread::sleep_for(std::chrono::milliseconds(600));
*/
  QString destDirname = publicLoc + "/" + directory;
  QDir dest(destDirname);
  if ( !dest.exists() ) dest.mkpath(destDirname);

  for ( int fi = 0; fi < files.count(); fi++) {
    QFile::copy( ":HikeData/" + directory + "/" + files[fi],
                 destDirname + "/" + files[fi]
                 );

    ro->setProperty( "progressValue", startProgress + fi);
    ro->setProperty( "progressText", text + files[fi]);
  }

  return startProgress + files.count();
}
