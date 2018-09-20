#ifndef WORKER_H
#define WORKER_H

#include <QObject>
#include <QQuickItem>
#include <QProgressBar>
#include <QPushButton>

// ----------------------------------------------------------------------------
class Worker : public QObject {

  Q_OBJECT

public:
  explicit Worker(QObject *parent = nullptr);

  bool work();
  virtual void shareImpl(QString path) = 0;

public slots:

private:
  void _transportDataToPublicLocation();

  QProgressBar *_progressBar;
  QPushButton *_quitButton;
};

#endif // WORKER_H
