#ifndef ANDROIDSHAREUTILS_H
#define ANDROIDSHAREUTILS_H

#include "worker.h"

#include <QObject>

// ----------------------------------------------------------------------------
class AndroidShareUtils : public Worker {

  Q_OBJECT

public:
  explicit AndroidShareUtils();

  void shareImpl(const QString url);

signals:

public slots:

private:

};

#endif // ANDROIDSHAREUTILS_H
