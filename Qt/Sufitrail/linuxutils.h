#ifndef LINUXUTILS_H
#define LINUXUTILS_H

#include "utils.h"

#include <QObject>

// ----------------------------------------------------------------------------
class LinuxUtils : public Utils {

  Q_OBJECT

public:
  explicit LinuxUtils();

  void installImpl(const QString path);
  void startImpl();

signals:

public slots:

private:

};

#endif // LINUXUTILS_H
