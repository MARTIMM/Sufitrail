#include "utilsinterface.h"

#if defined(Q_OS_ANDROID)
  #include "android.h"
//#elif defined(Q_OS_IOS)
//  #include "iosutils.h"
#else
  #include "linux.h"
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
  //  _utilsWorker = new Ios();
  //#el
  #if defined(Q_OS_ANDROID)
    _utilsWorker = new Android();
  #else
    _utilsWorker = new Linux();
  #endif

  globalUtilsWorker = _utilsWorker;
}

// ----------------------------------------------------------------------------
// must be a function and cannot be a method. Therefore we need a global where
// this object is stored in and be able to use that object here.
extern bool setupWork() {

  if ( globalUtilsWorker == nullptr ) return false;
  return globalUtilsWorker->work();
}

// ----------------------------------------------------------------------------
void UtilsInterface::installHikingData() {

  // To be able to update the interface we must start the work in a thread.
  QFuture<bool> future = QtConcurrent::run(setupWork);
}

// ----------------------------------------------------------------------------
void UtilsInterface::startHikingCompanion() {

  return _utilsWorker->startImpl();
}
