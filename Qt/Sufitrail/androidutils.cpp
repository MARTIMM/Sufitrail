#include "androidutils.h"

#include <QDebug>
#include <QtAndroid>
#include <QtAndroidExtras>
#include <QAndroidJniEnvironment>

// See also http://doc.qt.io/qt-5/qandroidjniobject.html

// ----------------------------------------------------------------------------
AndroidUtils::AndroidUtils() : Utils() { }

// ----------------------------------------------------------------------------
void AndroidUtils::installImpl(const QString url) {

  QAndroidJniObject jsUrl = QAndroidJniObject::fromString(url);

  jboolean ok = QAndroidJniObject::callStaticMethod<jboolean>(
        // place to find java file and method
        "utils/TDAndroidUtils", "install",
        // java args description
        "(Ljava/lang/String;)Z",
        // arguments
        jsUrl.object()
        );

  // Catch exceptions from java
  if ( ok ) {
    qDebug() << "JNI Object available and run";
  }

  else {
    qDebug() << "Caught exception";
  }
}

// ----------------------------------------------------------------------------
void AndroidUtils::startImpl() {

  QAndroidJniEnvironment env;

  //jboolean ok =
  QAndroidJniObject::callStaticMethod<void>(
        "utils/TDAndroidUtils", "start"
        );

  // Catch exceptions from java
  if ( env->ExceptionCheck() ) {
    qDebug() << "JNI Object not available";
    env->ExceptionClear();
  }

  else {
    qDebug() << "JNI Object available and run";
  }
}