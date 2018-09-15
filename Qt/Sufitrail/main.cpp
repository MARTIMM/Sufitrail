#include "shareinterface.h"

#include <QApplication>
#include <QQmlApplicationEngine>
#include <QDebug>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
// Define global variables
QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
int main( int argc, char *argv[]) {

  qDebug() << "App data location:" << QStandardPaths::standardLocations(QStandardPaths::AppDataLocation);
  qDebug() << "App config location:" << QStandardPaths::standardLocations(QStandardPaths::AppConfigLocation);
  qDebug() << "Generic data location:" << QStandardPaths::standardLocations(QStandardPaths::GenericDataLocation);
  qDebug() << "Download location:" << QStandardPaths::standardLocations(QStandardPaths::DownloadLocation);
  qDebug() << "Documents location:" << QStandardPaths::standardLocations(QStandardPaths::DocumentsLocation);

  QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

  QApplication app( argc, argv);

  qmlRegisterType<ShareInterface>(
        "io.github.martimm.SufiTrail.ShareInterface", 0, 1, "ShareInterface"
        );

  applicationEngine = new QQmlApplicationEngine();
  applicationEngine->load(QUrl(QStringLiteral("qrc:/Qml/Main/Application.qml")));
  if ( applicationEngine->rootObjects().isEmpty() ) return -1;

QObject *ro = applicationEngine->rootObjects().first();
qDebug() << "RO:" << ro;
qDebug() << "CH:" << ro->children();

//  ro->property("shareUtils").value<ShareUtils *>()->share();
  return app.exec();
}
