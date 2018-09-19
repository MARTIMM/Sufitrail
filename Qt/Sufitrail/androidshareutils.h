#ifndef ANDROIDSHAREUTILS_H
#define ANDROIDSHAREUTILS_H

#include <QObject>

// ----------------------------------------------------------------------------
class AndroidShareUtils {
public:
  AndroidShareUtils();

  void shareImpl(const QString url);

signals:
  void shareNoAppAvailable();
};

#endif // ANDROIDSHAREUTILS_H
