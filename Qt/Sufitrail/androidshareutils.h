#ifndef ANDROIDSHAREUTILS_H
#define ANDROIDSHAREUTILS_H

#include <QObject>
#include <QUrl>


// ----------------------------------------------------------------------------
class AndroidShareUtils {
public:
  AndroidShareUtils();

  Q_INVOKABLE void shareImpl(const QString text, const QUrl url);

signals:
  void shareNoAppAvailable();
};

#endif // ANDROIDSHAREUTILS_H
