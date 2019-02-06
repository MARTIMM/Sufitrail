#ifndef CACHEDATA_H
#define CACHEDATA_H

#include <QtCore>
#include <QtNetwork>
#include <QObject>
#include <QList>
#include <QLoggingCategory>

// -----------------------------------------------------------------------------
Q_DECLARE_LOGGING_CATEGORY(cachedata)

// -----------------------------------------------------------------------------
class CacheData : public QObject {

  Q_OBJECT

public:
  explicit CacheData(QObject *parent = nullptr);

  void cacheData( const QUrl &url, QString filename);
  //static QString saveFileName(const QUrl &url);

signals:

public slots:
  //void execute();

private slots:
  void _downloaded(QNetworkReply *reply);
  void _sslErrors(const QList<QSslError> &errors);

private:
  QNetworkAccessManager _manager;
  QHash<QString, QNetworkReply *> _currentDownloads;

  static bool _isHttpRedirect(QNetworkReply *reply);
  QString _saveData(const QString &filename, QIODevice *data);
};

#endif // CACHEDATA_H
