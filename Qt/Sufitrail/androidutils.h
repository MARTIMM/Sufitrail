#ifndef ANDROIDUTILS_H
#define ANDROIDUTILS_H

#include "utils.h"

#include <QObject>

// ----------------------------------------------------------------------------
class AndroidUtils : public Utils {

  Q_OBJECT

public:
  explicit AndroidUtils();

  void installImpl(const QString path);
  void startImpl();

signals:

public slots:

private:

};

#endif // ANDROIDUTILS_H
