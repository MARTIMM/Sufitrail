#include "androidutils.h"

#include <QDebug>
#include <QtAndroid>
#include <QtAndroidExtras>
#include <QAndroidJniEnvironment>


// ----------------------------------------------------------------------------
AndroidUtils::AndroidUtils() : Utils() { }

// ----------------------------------------------------------------------------
void AndroidUtils::installImpl() {

  QString url = _path;

  QAndroidJniEnvironment env;

  //jboolean ok =
  QAndroidJniObject::callStaticMethod<void>(
        "utils/TDAndroidUtils", "install"
        );

  // Catch exceptions from java
  if ( env->ExceptionCheck() ) {
    qDebug() << "JNI Object not available";
    env->ExceptionClear();
  }

  else {
    qDebug() << "JNI Object available and run";
  }


/*
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
*/
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
