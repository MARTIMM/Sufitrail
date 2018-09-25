#ifndef WORKER_H
#define WORKER_H

#include <QObject>
#include <QQuickItem>
#include <QSharedMemory>

// ----------------------------------------------------------------------------
class Utils : public QObject {

  Q_OBJECT

public:
  explicit Utils(QObject *parent = nullptr);
  ~Utils();

  bool work();
  virtual void installImpl() = 0;
  virtual void startImpl() = 0;

public slots:

protected:
  QString *_path;
  QString _dataRootDir;

private:
  QSharedMemory _smForPath;
  QString _publicLoc;
  QString _programname;

  int _transportDataToPublicLocation(
      QObject *ro, QString text, int startProgress, QString directory,
      QStringList files
      );
};

#endif // WORKER_H
