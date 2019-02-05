#include "android.h"

#include <QDebug>
#include <QAndroidJniObject>

// ----------------------------------------------------------------------------
Android::Android() : Utils() { }

// ----------------------------------------------------------------------------
void Android::startImpl() {

  if ( _HCNotInstalled ) return;

  qDebug() << "Start on android";

  jboolean ok = QAndroidJniObject::callStaticMethod<jboolean>(
        "utils/Android", "start"
        );

  // Catch exceptions from java
  if ( ok ) {
    qDebug() << "JNI Object available and run";
  }

  else {
    qDebug() << "JNI Object not available";
  }
}
