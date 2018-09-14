#ifndef SHAREUTILS_H
#define SHAREUTILS_H

#if defined(Q_OS_ANDROID)
  #include "androidshareutils.h"
#elif defined(Q_OS_IOS)
//  #include "iosshareutils.h"
#else
  #include "platformshareutils.h"
#endif

#include <QObject>
#include <QQuickItem>
#include <QProgressBar>
#include <QPushButton>

// ----------------------------------------------------------------------------
class ShareUtils : public QObject {

  Q_OBJECT

public:
  explicit ShareUtils(QObject *parent = nullptr);

  Q_INVOKABLE void share();

signals:
  void setupProgress();
  void reportProgress();
  void enableQuitButton();

public slots:

private:
  void _transportDataToPublicLocation();

  PlatformShareUtils *_platformShareUtils;
  QProgressBar *_progressBar;
  QPushButton *_quitButton;
};

#endif // SHAREUTILS_H
