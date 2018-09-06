// (c) 2017 Ekkehard Gentz (ekke)
// this project is based on ideas from
// http://blog.lasconic.com/share-on-ios-and-android-using-qml/
// see github project https://github.com/lasconic/ShareUtils-QML
// also inspired by:
// https://www.androidcode.ninja/android-share-intent-example/
// https://www.calligra.org/blogs/sharing-with-qt-on-android/
// https://stackoverflow.com/questions/7156932/open-file-in-another-app
// http://www.qtcentre.org/threads/58668-How-to-use-QAndroidJniObject-for-intent-setData
// see also /COPYRIGHT and /LICENSE

// (c) 2017 Ekkehard Gentz (ekke) @ekkescorner
// my blog about Qt for mobile: http://j.mp/qt-x
// see also /COPYRIGHT and /LICENSE
//
#ifndef SHAREUTILS_H
#define SHAREUTILS_H

#if defined(Q_OS_IOS)
//  #include "iosshareutils.h"
#elif defined(Q_OS_ANDROID)
  #include "androidshareutils.h"
#else
  #include "platformshareutils.h"
#endif

#include <QObject>
#include <QDebug>


// ----------------------------------------------------------------------------
class ShareUtils : public QObject {
  Q_OBJECT
public:
  explicit ShareUtils(QObject *parent = nullptr);

  Q_INVOKABLE void Share( const QString &text, const QUrl &url);

signals:

public slots:

private:

  PlatformShareUtils *_platformShareUtils;
};

#endif // SHAREUTILS_H
