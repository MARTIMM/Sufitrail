#ifndef WORKER_H
#define WORKER_H

#include <QObject>
#include <QQuickItem>
#include <QProgressBar>
#include <QPushButton>

// ----------------------------------------------------------------------------
class Utils : public QObject {

  Q_OBJECT

public:
  explicit Utils(QObject *parent = nullptr);

  bool work();
  virtual void installImpl(const QString path) = 0;
  virtual void startImpl() = 0;

public slots:

private:
  void _transportDataToPublicLocation();

  QProgressBar *_progressBar;
  QPushButton *_quitButton;
};

#endif // WORKER_H
