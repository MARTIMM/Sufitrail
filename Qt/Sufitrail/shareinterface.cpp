#include "shareinterface.h"
#include "worker.h"

#if defined(Q_OS_ANDROID)
  #include "androidshareutils.h"
//#elif defined(Q_OS_IOS)
//  #include "iosshareutils.h"
#else
  #include "linuxshareutils.h"
#endif

#include <QDebug>
#include <QtConcurrent>
#include <QFuture>

// ----------------------------------------------------------------------------
ShareInterface::ShareInterface(QObject *parent) : QObject(parent) { }

// ----------------------------------------------------------------------------
extern bool setupWork() {

  //Worker *worker = new Worker();
  //return worker->work();

  Worker *worker;
  //#if defined(Q_OS_IOS)
  //  _platformShareUtils = new IosShareUtils();
  //#el
  #if defined(Q_OS_ANDROID)
    worker = new AndroidShareUtils();
  #else
    worker = new LinuxShareUtils();
  #endif

  return worker->work();
}

// ----------------------------------------------------------------------------
void ShareInterface::share() {

  QFuture<bool> future = QtConcurrent::run(setupWork);
}
