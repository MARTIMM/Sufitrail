#include "androidshareutils.h"

#include <QDebug>
#include <QtAndroid>
#include <QtAndroidExtras>

// ----------------------------------------------------------------------------
AndroidShareUtils::AndroidShareUtils() { }

// ----------------------------------------------------------------------------
void AndroidShareUtils::shareImpl(const QString url) {

  QAndroidJniObject jsUrl = QAndroidJniObject::fromString(url);

  jboolean ok = QAndroidJniObject::callStaticMethod<jboolean>(
        // place to find java file and method
        "utils/AndroidShareUtils", "share",
        // java args description
        "(Ljava/lang/String;)Z",
        // arguments
        jsUrl.object()
        );

  if(!ok) {
    qDebug() << "JNI Object not available";
  }
}
