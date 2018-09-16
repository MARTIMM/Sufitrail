#include "shareinterface.h"

#include <thread>
#include <chrono>

#include <QDebug>
#include <QQmlApplicationEngine>
#include <QtConcurrent>
#include <QFuture>
#include <QFutureWatcher>

// ----------------------------------------------------------------------------
// Global variable defined in main.cpp and has loaded the Application.qml
extern QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
ShareInterface::ShareInterface(QObject *parent) : QObject(parent) {
/*
#if defined(Q_OS_IOS)
//  _platformShareUtils = new IosShareUtils(this);
#elif defined(Q_OS_ANDROID)
//  _platformShareUtils = new AndroidShareUtils(this);
#else
//  _platformShareUtils = new PlatformShareUtils(this);
#endif
*/
}

// ----------------------------------------------------------------------------
extern bool setupWork() {

  Worker *worker = new Worker();
  return worker->work();
}

// ----------------------------------------------------------------------------
/*
void ShareInterface::connectHikerCompanion() {
  qDebug() << "finished work";
}
*/

// ----------------------------------------------------------------------------
void ShareInterface::share() {

  //QFutureWatcher<bool> watcher;
  //connect( &watcher, SIGNAL(finished()), this, SLOT(connectHikerCompanion()));
  QFuture<bool> future = QtConcurrent::run(setupWork);
  //watcher.setFuture(future);
  //qDebug() << "thread started:" << watcher.isStarted();
}

// ----------------------------------------------------------------------------
Worker::Worker(QObject *parent) : QObject(parent) {

#if defined(Q_OS_IOS)
//  _platformShareUtils = new IosShareUtils(this);
#elif defined(Q_OS_ANDROID)
//  _platformShareUtils = new AndroidShareUtils(this);
#else
  _platformShareUtils = new PlatformShareUtils(this);
#endif
}

// ----------------------------------------------------------------------------
bool Worker::work() {

  QObject *ro = applicationEngine->rootObjects().first();
  qDebug() << "WRO:" << ro;
  qDebug() << "WCH:" << ro->children();

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
  _platformShareUtils->shareImpl("/home/marcel");

  ro->setProperty( "progressText", "Cleanup");
  ro->setProperty( "progressText", "Finished");

  ro->setProperty( "quitButtonOn", true);

  return true;
}

// ----------------------------------------------------------------------------
void Worker::_transportDataToPublicLocation() {
}
