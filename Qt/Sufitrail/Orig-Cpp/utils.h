#ifndef WORKER_H
#define WORKER_H

#include <QObject>
#include <QQuickItem>

// ----------------------------------------------------------------------------
class Utils : public QObject {

  Q_OBJECT

public:
  explicit Utils(QObject *parent = nullptr);

  bool work();
  QString dataShareDir();
  virtual void startImpl() = 0;

public slots:

protected:
  QString *_path;
  QString _dataShareDir;
  bool _HCNotInstalled = false;

  bool mkpath(QString path);

private:
  int _transportDataToPublicLocation(
      QString text, int startProgress, QString directory, QStringList files
      );
};

#endif // WORKER_H
