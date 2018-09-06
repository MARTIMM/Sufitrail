#include "androidshareutils.h"

#include <QtAndroid>
#include <QtAndroidExtras>

// ----------------------------------------------------------------------------
AndroidShareUtils::AndroidShareUtils() {

}

// ----------------------------------------------------------------------------
void AndroidShareUtils::share(const QString &text, const QUrl &url)
{
  QAndroidJniObject jsText = QAndroidJniObject::fromString(text);
  QAndroidJniObject jsUrl = QAndroidJniObject::fromString(url.toString());
  jboolean ok = QAndroidJniObject::callStaticMethod(
        "org/ekkescorner/utils/QShareUtils",
        "share",
        "(Ljava/lang/String;Ljava/lang/String;)Z", // java args description
        jsText.object(),
        jsUrl.object()
        );
  if(!ok) {
    emit shareNoAppAvailable();
  }
}
