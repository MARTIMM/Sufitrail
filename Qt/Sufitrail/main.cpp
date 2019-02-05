#include "utilsinterface.h"

#if defined(Q_OS_ANDROID)
#include <QtAndroid>
#endif

#include <QApplication>
#include <QQmlApplicationEngine>
#include <QDebug>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
// Define global variables
QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
int main( int argc, char *argv[]) {

#if defined(Q_OS_ANDROID)
  // On android, we must request the user of the application for the following
  // permissions to create data and access devices
  QStringList permissions = {
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.READ_EXTERNAL_STORAGE"
  };
  QtAndroid::PermissionResultMap rpm = QtAndroid::requestPermissionsSync(
        permissions
        );

  QStringList keys = rpm.keys();
  for ( int rpmi = 0; rpmi < keys.count(); rpmi++) {
    qDebug() << keys[rpmi] << (rpm[keys[rpmi]] == QtAndroid::PermissionResult::Granted ? "ok" : "denied");
  }
#endif

  QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

  // Settings used by QSettings to set a location to store its data
  QCoreApplication::setOrganizationName("martimm");
  QCoreApplication::setOrganizationDomain("io.github.martimm");
  QCoreApplication::setApplicationName("SufiTrail");

  QApplication app( argc, argv);
  // Set version also in hike.conf == programVersion
  app.setApplicationVersion("0.5.2");
  app.setApplicationDisplayName("SufiTrail");
  // App data location
  // android:
  //   /data/user/0/io.martimm.github.SufiTrail/files
  //   /storage/emulated/0/Android/data/io.martimm.github.SufiTrail/files
  //qDebug() << "App data location:" << QStandardPaths::standardLocations(QStandardPaths::AppDataLocation);

  // App config location
  // android:
  //   /data/user/0/io.martimm.github.SufiTrail/files/settings
  //qDebug() << "App config location:" << QStandardPaths::standardLocations(QStandardPaths::AppConfigLocation);

  // Generic data location
  // android:
  //   /storage/emulated/0
  //qDebug() << "Generic data location:" << QStandardPaths::standardLocations(QStandardPaths::GenericDataLocation);
  //qDebug() << "Download location:" << QStandardPaths::standardLocations(QStandardPaths::DownloadLocation);
  //qDebug() << "Documents location:" << QStandardPaths::standardLocations(QStandardPaths::DocumentsLocation);
/**/

  qmlRegisterType<UtilsInterface>(
        "io.github.martimm.SufiTrail.UtilsInterface", 0, 1, "UtilsInterface"
        );

  applicationEngine = new QQmlApplicationEngine();
  applicationEngine->load(QUrl(QStringLiteral("qrc:/Qml/Main/Application.qml")));
  if ( applicationEngine->rootObjects().isEmpty() ) return -1;

  return app.exec();
}

// ============================================================================
/*
#if defined(Q_OS_ANDROID)

//extern "C" {

#include "androidproviderclient.h"
#include <QtAndroid>
#include <QAndroidJniObject>

//#include <QAndroidActivityResultReceiver>
//#include <QtAndroidExtras>
//#include <QAndroidJniEnvironment>
//#include <jni.h>

//#define Q_QDOC true
//} // extern "C"
#endif
*/
