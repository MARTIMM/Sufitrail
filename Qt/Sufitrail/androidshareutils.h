#ifndef ANDROIDSHAREUTILS_H
#define ANDROIDSHAREUTILS_H

#include <QObject>

// ----------------------------------------------------------------------------
class AndroidShareUtils {
public:
  AndroidShareUtils();

  Q_INVOKABLE void shareImpl(const QString text, const QString url);

signals:
  void shareNoAppAvailable();
};

#endif // ANDROIDSHAREUTILS_H
