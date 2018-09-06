#ifndef ANDROIDSHAREUTILS_H
#define ANDROIDSHAREUTILS_H

#include <QObject>


// ----------------------------------------------------------------------------
class AndroidShareUtils {
public:
  AndroidShareUtils();

  void share(const QString &text, const QUrl &url);

signals:
  void shareNoAppAvailable();
};

#endif // ANDROIDSHAREUTILS_H
