#ifndef SHAREUTILS_H
#define SHAREUTILS_H

#if defined(Q_OS_ANDROID)
  #include "androidshareutils.h"
#elif defined(Q_OS_IOS)
//  #include "iosshareutils.h"
#else
  #include "platformshareutils.h"
#endif

#include <QObject>
#include <QQuickItem>
#include <QProgressBar>
#include <QPushButton>

// ----------------------------------------------------------------------------
class ShareInterface : public QObject {

  Q_OBJECT

public:
  explicit ShareInterface(QObject *parent = nullptr);

  Q_INVOKABLE void share();

signals:

public slots:
  //void connectHikerCompanion();

private:
  //static void _workThread();
  //void _transportDataToPublicLocation();

  //PlatformShareUtils *_platformShareUtils;
  //QProgressBar *_progressBar;
  //QPushButton *_quitButton;
};


// ----------------------------------------------------------------------------
class Worker : public QObject {

  Q_OBJECT

public:
  explicit Worker(QObject *parent = nullptr);

  bool work();

public slots:

private:
  void _transportDataToPublicLocation();

  PlatformShareUtils *_platformShareUtils;
  QProgressBar *_progressBar;
  QPushButton *_quitButton;
};
#endif // SHAREUTILS_H
