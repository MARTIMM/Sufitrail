#include "androidshareutils.h"

#include <QtAndroid>
#include <QtAndroidExtras>

// ----------------------------------------------------------------------------
AndroidShareUtils::AndroidShareUtils() { }

// ----------------------------------------------------------------------------
void AndroidShareUtils::shareImpl(const QString text, const QUrl url) {

  QAndroidJniObject jsText = QAndroidJniObject::fromString(text);
  QAndroidJniObject jsUrl = QAndroidJniObject::fromString(url.toString());

  jboolean ok = QAndroidJniObject::callStaticMethod<jboolean>(
        // place to find java file and method
        "utils/QShareUtils", "share",
        // java args description
        "(Ljava/lang/String;Ljava/lang/String;)Z",
        // arguments
        jsText.object(), jsUrl.object()
        );

  if(!ok) {
    emit shareNoAppAvailable();
  }
}
