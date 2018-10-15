#include "androidproviderclient.h"

#include <QDebug>
#include <QAndroidJniObject>
//#include <QtAndroid>
//#include <QtAndroidExtras>
//#include <QAndroidJniEnvironment>
//#include <QAndroidActivityResultReceiver>

// ----------------------------------------------------------------------------
AndroidProviderClient::AndroidProviderClient() : Utils() { }

// ----------------------------------------------------------------------------
/*
void AndroidProviderClient::installImpl() {

  if ( _HCNotInstalled ) return;

  qDebug() << "Install on android";
/ *
  QAndroidJniObject jsPath = QAndroidJniObject::fromString(_dataShareDir);
  jboolean ok = QAndroidJniObject::callStaticMethod<jboolean>(
        // place to find java file and method
        "utils/AndroidProviderClient", "install",
        // java args description
        "(Ljava/lang/String;Landroid/content/Context;)Z",
        // arguments
        jsPath.object(), QtAndroid::androidContext().object()
        );

  // Catch exceptions from java
  if ( ok ) {
    qDebug() << "JNI Object available and run";
  }

  else {
    qDebug() << "JNI Object not available";
  }
* /
}
*/

// ----------------------------------------------------------------------------
void AndroidProviderClient::startImpl() {

  if ( _HCNotInstalled ) return;

  qDebug() << "Start on android";

  jboolean ok = QAndroidJniObject::callStaticMethod<jboolean>(
        "utils/AndroidProviderClient", "start"
        );

  // Catch exceptions from java
  if ( ok ) {
    qDebug() << "JNI Object available and run";
  }

  else {
    qDebug() << "JNI Object not available";
  }
}
