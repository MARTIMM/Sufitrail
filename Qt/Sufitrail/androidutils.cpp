#include "androidutils.h"

#include <QDebug>
#include <QtAndroid>
#include <QtAndroidExtras>
#include <QAndroidJniEnvironment>
//#include <QAndroidActivityResultReceiver>

// ----------------------------------------------------------------------------
AndroidUtils::AndroidUtils() : Utils() { }

// ----------------------------------------------------------------------------
void AndroidUtils::installImpl() {

  qDebug() << "Install on android";

  QAndroidJniObject jsPath = QAndroidJniObject::fromString(_dataRootDir);
  jboolean ok = QAndroidJniObject::callStaticMethod<jboolean>(
        // place to find java file and method
        "utils/TDAndroidUtils", "install",
        // java args description
        "(Ljava/lang/String;)Z",
        // arguments
        jsPath.object()
        );

  // Catch exceptions from java
  if ( ok ) {
    qDebug() << "JNI Object available and run";
  }

  else {
    qDebug() << "JNI Object not available";
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

  qDebug() << "Start on android";

  jboolean ok = QAndroidJniObject::callStaticMethod<jboolean>(
        "utils/TDAndroidUtils", "start"
        );

  // Catch exceptions from java
  if ( ok ) {
    qDebug() << "JNI Object available and run";
  }

  else {
    qDebug() << "JNI Object not available";
  }
}
