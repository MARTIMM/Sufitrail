#include "utils.h"

#include <thread>
#include <chrono>

#include <QDebug>
#include <QQmlApplicationEngine>

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
  ro->setProperty( "progressTo", 5.0);

  ro->setProperty( "progressText", "Initialize setup");
  ro->setProperty( "progressText", "Copy tracks");
  ro->setProperty( "progressText", "Copy features");
  ro->setProperty( "progressText", "Copy notes");
  ro->setProperty( "progressText", "Copy photo's");

  _transportDataToPublicLocation();

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
  installImpl();
  qDebug() << "Done sharing";

  ro->setProperty( "progressText", "Cleanup");
  ro->setProperty( "progressText", "Finished");

  ro->setProperty( "quitButtonOn", true);

  return true;
}

// ----------------------------------------------------------------------------
void Utils::_transportDataToPublicLocation() {
}
