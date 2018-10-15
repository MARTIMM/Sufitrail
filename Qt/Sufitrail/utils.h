#ifndef WORKER_H
#define WORKER_H

#include <QObject>
#include <QQuickItem>

// ----------------------------------------------------------------------------
class Utils : public QObject {

  Q_OBJECT

public:
  explicit Utils(QObject *parent = nullptr);
  ~Utils();

  bool work();
  QString dataRootDir();
  virtual void startImpl() = 0;

public slots:

protected:
  QString *_path;
  QString _dataShareDir;
  bool _HCNotInstalled = false;

  bool mkpath(QString path);

private:
  int _transportDataToPublicLocation(
      QObject *ro, QString text, int startProgress, QString directory,
      QStringList files
      );
};

#endif // WORKER_H
