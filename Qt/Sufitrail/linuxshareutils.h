#ifndef LINUXSHAREUTILS_H
#define LINUXSHAREUTILS_H

#include "worker.h"

#include <QObject>

// ----------------------------------------------------------------------------
class LinuxShareUtils : public Worker {

  Q_OBJECT

public:
  explicit LinuxShareUtils();

  void shareImpl(const QString url);

signals:

public slots:

private:

};

#endif // LINUXSHAREUTILS_H
