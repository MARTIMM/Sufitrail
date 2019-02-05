#ifndef ANDROID_H
#define ANDROID_H

#include "utils.h"

#include <QObject>

// ----------------------------------------------------------------------------
class Android : public Utils {

  Q_OBJECT

public:
  explicit Android();
  void startImpl();
};

#endif // ANDROID_H
