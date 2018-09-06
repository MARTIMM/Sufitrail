#include "shareutils.h"

// ----------------------------------------------------------------------------
ShareUtils::ShareUtils(QObject *parent) : QObject(parent) {

#if defined(Q_OS_IOS)
//    _platformShareUtils = new IosShareUtils(this);
#elif defined(Q_OS_ANDROID)
    _platformShareUtils = new AndroidShareUtils(this);
#else
    _platformShareUtils = new PlatformShareUtils(this);
#endif

}

// ----------------------------------------------------------------------------
void ShareUtils::Share( const QString &text, const QUrl &url) {

  _platformShareUtils->share( text, url);
}
