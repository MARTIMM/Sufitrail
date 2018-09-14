#include "shareutils.h"

#include <thread>
#include <chrono>

#include <QDebug>
#include <QQmlApplicationEngine>

// ----------------------------------------------------------------------------
// Refer to global variables
extern QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
ShareUtils::ShareUtils(QObject *parent) : QObject(parent) {

#if defined(Q_OS_IOS)
//  _platformShareUtils = new IosShareUtils(this);
#elif defined(Q_OS_ANDROID)
//  _platformShareUtils = new AndroidShareUtils(this);
#else
//  _platformShareUtils = new PlatformShareUtils(this);
#endif
}

// ----------------------------------------------------------------------------
void ShareUtils::share() {

  emit setupProgress();
  for ( double progress = 0.0; progress < 10.0; progress += 1.0 ) {
    emit reportProgress();
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));
  }

  emit enableQuitButton();
/*
qDebug() << "APPEngine:" << applicationEngine;
qDebug() << "RO:" << applicationEngine->rootObjects();

  //QQuickView view;
  //view.setSource(QString("qrc:Qml/Main/Application.qml"));
  //view.show();

  //QQuickItem *rto = view.rootObject();
  _progressBar = applicationEngine->findChild<QProgressBar *>("progressBar");
  _quitButton = applicationEngine->findChild<QPushButton *>("quitButton");

qDebug() << "qb:" << _quitButton;//->property("text");// << "," << quitButton;//->property("value");
return;

  _progressBar->setProperty( "from", 0.0);
  _progressBar->setProperty( "to", 10.0);
return;

  for ( double progress = 0.0; progress < 10.0; progress += 1.0 ) {
    _progressBar->setProperty( "value", progress);
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));
  }

  _transportDataToPublicLocation();

  QString text = "";
  QUrl url("file://tmp");
  //_platformShareUtils->shareImpl( text, url);


  //_quitButton = quitButton;
  _quitButton->setProperty( "enable", true);
*/
}

// ----------------------------------------------------------------------------
void ShareUtils::_transportDataToPublicLocation() {
}
