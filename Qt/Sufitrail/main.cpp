#include "utilsinterface.h"

#include <QApplication>
#include <QQmlApplicationEngine>
#include <QDebug>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
// Define global variables
QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
int main( int argc, char *argv[]) {

  QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

  // Settings used by QSettings to set a location to store its data
  QCoreApplication::setOrganizationName("martimm");
  QCoreApplication::setOrganizationDomain("io.github.martimm");
  QCoreApplication::setApplicationName("SufiTrail");

  QApplication app( argc, argv);
  app.setApplicationVersion("0.3.0");
  app.setApplicationDisplayName("SufiTrail");

  qDebug() << "App data location:" << QStandardPaths::standardLocations(QStandardPaths::AppDataLocation);
  qDebug() << "App config location:" << QStandardPaths::standardLocations(QStandardPaths::AppConfigLocation);
  qDebug() << "Generic data location:" << QStandardPaths::standardLocations(QStandardPaths::GenericDataLocation);
  //qDebug() << "Download location:" << QStandardPaths::standardLocations(QStandardPaths::DownloadLocation);
  //qDebug() << "Documents location:" << QStandardPaths::standardLocations(QStandardPaths::DocumentsLocation);

  qDebug() << "qApp argc:" << argc;
  for ( int i = 0; i < argc; i++) {
    qDebug() << QString("qApp [%1]").arg(i) << argv[i];
  }

  qmlRegisterType<UtilsInterface>(
        "io.github.martimm.SufiTrail.UtilsInterface", 0, 1, "UtilsInterface"
        );

  applicationEngine = new QQmlApplicationEngine();
  applicationEngine->load(QUrl(QStringLiteral("qrc:/Qml/Main/Application.qml")));
  if ( applicationEngine->rootObjects().isEmpty() ) return -1;

  return app.exec();
}
