#ifndef LINUX_H
#define LINUX_H

#include "utils.h"

#include <QObject>

// ----------------------------------------------------------------------------
class Linux : public Utils {

  Q_OBJECT

public:
  explicit Linux();
  void startImpl();
};

#endif // LINUX_H
