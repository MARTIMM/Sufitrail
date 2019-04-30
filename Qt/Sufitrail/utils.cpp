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
Utils::Utils(QObject *parent) : QObject(parent) {

  QString hcid = "io.github.martimm.HikingCompanion";
  qDebug() << "HC id: " << hcid;

  // Prepare for data sharing location. Check if root exists. If not, the
  // HikingCompanion app is not installed
  // linux:     /home/marcel/.local/share/io.github.martimm.HikingCompanion
  // Android:   /storage/emulated/0/Android/Data/io.github.martimm.HikingCompanion
  QString publicLoc = QStandardPaths::standardLocations(
        QStandardPaths::GenericDataLocation
        ).first();

#if defined(Q_OS_ANDROID)
  publicLoc += "/Android/Data/" + hcid;
#elif defined(Q_OS_LINUX)
  publicLoc += "/" + hcid;
#endif

  QDir *dd = new QDir(publicLoc);
  if ( !dd->exists() ) {
    qDebug() << "HikingCompanion application is not installed";
    _HCNotInstalled = true;
  }

  else {
    _dataShareDir = publicLoc + "/newHikeData";
    this->mkpath(_dataShareDir);
  }
}

/*
// ----------------------------------------------------------------------------
QString Utils::dataShareDir() {
  return _dataShareDir;
}
*/

// ----------------------------------------------------------------------------
bool Utils::work() {

  QObject *ro = applicationEngine->rootObjects().first();

  if ( _HCNotInstalled ) {
    ro->setProperty( "progressText", "HikingCompanion application is not installed");
    ro->setProperty( "installButtonOn", false);
    ro->setProperty( "quitButtonOn", true);

    return false;
  }

  qDebug() << "Init worker";
  ro->setProperty( "installButtonOn", false);

  ro->setProperty( "progressFrom", 0.0);
  ro->setProperty( "progressText", "Initialize setup");

  // Cleanup before start, maybe there are some remnants left
  QDir *dd = new QDir(_dataShareDir);
  if ( dd->exists() ) dd->removeRecursively();
  this->mkpath(_dataShareDir);

  // Build the exportable data in the newHikeData dir
  // get the config file
  QSettings *s = new QSettings(
        QString(":HikeData/hike.conf"),
        QSettings::IniFormat
        );
  qDebug() << "Fn:" << s->fileName();

  // Gather exportable items
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

  // Pages
  QString textPagesDir = s->value("pagesdir").toString();
  dd = new QDir(":HikeData/" + textPagesDir);
  QStringList textPages = dd->entryList( QDir::Files, QDir::Name);

  // Page style files
  QString textPagesCssDir = s->value("pagecss").toString();
  dd = new QDir(":HikeData/" + textPagesCssDir);
  QStringList textPagesCss = dd->entryList( QDir::Files, QDir::Name);

  // Page images
  QString textPagesImgDir = s->value("pageimages").toString();
  dd = new QDir(":HikeData/" + textPagesImgDir);
  QStringList textPagesImg = dd->entryList( QDir::Files, QDir::Name);

  // Calculate progressbar ticks
  int totalTicks = tracks.count() + photos.count() + notes.count() +
      features.count() + textPages.count() + 3;

  //int totalTicks = tracks.count() + photos.count() + notes.count() + 3;
  ro->setProperty( "progressTo", totalTicks);
  int progress = 0;
  progress = _transportDataToPublicLocation(
        "Copy track: ", progress, tracksDir, tracks
        );

  int nbrSleepMS = 400;
  std::this_thread::sleep_for(std::chrono::milliseconds(nbrSleepMS));

  progress = _transportDataToPublicLocation(
        "Copy photo: ", progress, photoDir, photos
        );
  std::this_thread::sleep_for(std::chrono::milliseconds(nbrSleepMS));

  progress = _transportDataToPublicLocation(
        "Copy note: ", progress, noteDir, notes
        );
  std::this_thread::sleep_for(std::chrono::milliseconds(nbrSleepMS));

  progress = _transportDataToPublicLocation(
        "Copy feature: ", progress, featureDir, features
        );
  std::this_thread::sleep_for(std::chrono::milliseconds(nbrSleepMS));

  progress = _transportDataToPublicLocation(
        "Copy page: ", progress, textPagesDir, textPages
        );
  std::this_thread::sleep_for(std::chrono::milliseconds(nbrSleepMS));

  progress = _transportDataToPublicLocation(
        "Copy page: ", progress, textPagesCssDir, textPagesCss
        );
  std::this_thread::sleep_for(std::chrono::milliseconds(nbrSleepMS));

  progress = _transportDataToPublicLocation(
        "Copy page: ", progress, textPagesImgDir, textPagesImg
        );
  std::this_thread::sleep_for(std::chrono::milliseconds(nbrSleepMS));

  std::this_thread::sleep_for(std::chrono::milliseconds(nbrSleepMS));

  ro->setProperty( "progressValue", progress++);
  QFile::copy( ":HikeData/hike.conf", _dataShareDir + "/hike.conf");
  QFile::copy(
        ":HikeData/SufiTrailTheme.json",
        _dataShareDir + "/SufiTrailTheme.json"
        );

  ro->setProperty( "progressValue", progress++);
/*
  ro->setProperty( "progressText", "Start HikingCompanion");

  qDebug() << "Copied, start sharing...";
  installImpl();
  qDebug() << "Done sharing";

  //  qDebug() << "Remove" << _dataShareDir;
  //  dd = new QDir(_dataShareDir);
  //  dd->removeRecursively();
*/
  std::this_thread::sleep_for(std::chrono::milliseconds(nbrSleepMS));
  ro->setProperty( "progressValue", progress++);
  ro->setProperty( "progressText", "Finished");

  ro->setProperty( "quitButtonOn", true);

  return true;
}

// ----------------------------------------------------------------------------
int Utils::_transportDataToPublicLocation(
    QString text, int startProgress,
    QString directory, QStringList files
    ) {

  //QObject *ro = applicationEngine->rootObjects().first();

  QString destDirname = _dataShareDir + "/" + directory;
  QDir dest(destDirname);
  qDebug() << "Dest dir:" << destDirname;
  bool ok = this->mkpath(destDirname);
  if ( !ok ) {
    qDebug() << "Creating path" << destDirname << "not ok";
    //ro->setProperty( "progressText", "path " + destDirname + " failed to create");
    return startProgress;
  }

  for ( int fi = 0; fi < files.count(); fi++) {
    qDebug() << ":HikeData/" + directory + "/" + files[fi]
                << " --> " << destDirname + "/" + files[fi];

    if ( QFile::copy( ":HikeData/" + directory + "/" + files[fi],
                 destDirname + "/" + files[fi]
                 ) ) {
      qDebug() << "File" << ":HikeData/" + directory + "/" + files[fi] <<
                  "copied to" << destDirname + "/" + files[fi];
    }
    else {
      qDebug() << "File" << ":HikeData/" + directory + "/" + files[fi] <<
                  "not copied to" << destDirname + "/" + files[fi];
    }


    qDebug() << "Progress:" << startProgress + fi;
    //following crashes the program because changing values in another thread
    //this goes for all changes in work() and call from there.
    //ro->setProperty( "progressValue", startProgress + fi);
    //ro->setProperty( "progressText", text + files[fi]);
  }

  return startProgress + files.count();
}

// ----------------------------------------------------------------------------
bool Utils::mkpath(QString path) {

  bool ok = true;
  QString p = "/";
  QDir *dd;

  QStringList parts = path.split( '/', QString::SkipEmptyParts);
  for ( int pi = 0; pi < parts.count(); pi++) {
    dd = new QDir(p);
    if ( dd->exists(parts[pi]) ) {
      //qDebug() << p << parts[pi] << "exists -> next";
    }

    else if ( dd->mkdir(parts[pi]) ) {
      //qDebug() << p << parts[pi] << "ok";
    }

    else {
      qDebug() << p << parts[pi] << "fails";
      ok = false;
      break;
    }

    if ( pi == 0 ) {
      p += parts[pi];
    }

    else {
      p += "/" + parts[pi];
    }
  }

  //qDebug() << path << "ok:" << ok;
  return ok;
}
