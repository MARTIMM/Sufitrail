#ifndef ANDROIDUTILS_H
#define ANDROIDUTILS_H

#include "utils.h"

#include <QObject>

// ----------------------------------------------------------------------------
class AndroidProviderClient : public Utils {

  Q_OBJECT

public:
  explicit AndroidProviderClient();

  //void installImpl();
  void startImpl();

signals:

public slots:

private:
};

#endif // ANDROIDUTILS_H
