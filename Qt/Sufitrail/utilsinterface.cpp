#include "utilsinterface.h"

#if defined(Q_OS_ANDROID)
  #include "androidutils.h"
//#elif defined(Q_OS_IOS)
//  #include "iosutils.h"
#else
  #include "linuxutils.h"
#endif

#include <QDebug>
#include <QtConcurrent>
#include <QFuture>

// ----------------------------------------------------------------------------
// Define global variables

Utils *globalUtilsWorker = nullptr;

// ----------------------------------------------------------------------------
UtilsInterface::UtilsInterface(QObject *parent) : QObject(parent) {

  //#if defined(Q_OS_IOS)
  //  _utilsWorker = new IosUtils();
  //#el
  #if defined(Q_OS_ANDROID)
    _utilsWorker = new AndroidUtils();
  #else
    _utilsWorker = new LinuxUtils();
  #endif

  globalUtilsWorker = _utilsWorker;
}

// ----------------------------------------------------------------------------
extern bool setupWork() {

  if ( globalUtilsWorker == nullptr ) return false;
  return globalUtilsWorker->work();
}

// ----------------------------------------------------------------------------
void UtilsInterface::installHikingData() {

  // To be able to update the interface we must start the work in a thread.
  //QFuture<bool> future = QtConcurrent::run(setupWork);
  _utilsWorker->work();
}

// ----------------------------------------------------------------------------
void UtilsInterface::startHikingCompanion() {

  return _utilsWorker->startImpl();
}
