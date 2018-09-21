#include "utilsinterface.h"
#include "utils.h"

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
UtilsInterface::UtilsInterface(QObject *parent) : QObject(parent) { }

// ----------------------------------------------------------------------------
extern bool setupWork() {

  Utils *utilsWorker;
  //#if defined(Q_OS_IOS)
  //  utilsWorker = new IosUtils();
  //#el
  #if defined(Q_OS_ANDROID)
    utilsWorker = new AndroidUtils();
  #else
    utilsWorker = new LinuxUtils();
  #endif

  return utilsWorker->work();
}

// ----------------------------------------------------------------------------
void UtilsInterface::installHikingData() {

  // To be able to update the interface we must start the work in a thread.
  QFuture<bool> future = QtConcurrent::run(setupWork);
}

// ----------------------------------------------------------------------------
void UtilsInterface::startHikingCompanion() {

  Utils *utilsWorker;
  //#if defined(Q_OS_IOS)
  //  utilsWorker = new IosUtils();
  //#el
  #if defined(Q_OS_ANDROID)
    utilsWorker = new AndroidUtils();
  #else
    utilsWorker = new LinuxUtils();
  #endif

  return utilsWorker->startImpl();
}
