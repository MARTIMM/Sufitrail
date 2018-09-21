#include "utils.h"

#include <thread>
#include <chrono>

#include <QDebug>
#include <QQmlApplicationEngine>

// ----------------------------------------------------------------------------
Utils::Utils(QObject *parent) : QObject(parent) { }

// ----------------------------------------------------------------------------
// Global variable defined in main.cpp and has loaded the Application.qml
extern QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
bool Utils::work() {

  QObject *ro = applicationEngine->rootObjects().first();

  qDebug() << "Init worker";
  ro->setProperty( "installButtonOn", false);

  ro->setProperty( "progressFrom", 0.0);
  ro->setProperty( "progressTo", 5.0);

  ro->setProperty( "progressText", "Initialize setup");
  ro->setProperty( "progressText", "Copy tracks");
  ro->setProperty( "progressText", "Copy features");
  ro->setProperty( "progressText", "Copy notes");
  ro->setProperty( "progressText", "Copy photo's");
//  _transportDataToPublicLocation();
  for ( double progress = 1.0; progress < 6.0; progress += 1.0 ) {
    ro->setProperty( "progressValue", progress);
    ro->setProperty(
          "progressText",
          QString("progress ") + QString::number(progress)
          );
    std::this_thread::sleep_for(std::chrono::milliseconds(600));
  }

  ro->setProperty( "progressText", "Start HikingCompanion");

  qDebug() << "Copied, start sharing...";
  installImpl(QString("/home/marcel"));
  qDebug() << "Done sharing";

  ro->setProperty( "progressText", "Cleanup");
  ro->setProperty( "progressText", "Finished");

  ro->setProperty( "quitButtonOn", true);

  return true;
}

// ----------------------------------------------------------------------------
void Utils::_transportDataToPublicLocation() {
}
