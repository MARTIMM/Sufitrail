#include "cachedata.h"
//#include "configdata.h"

// -----------------------------------------------------------------------------
Q_LOGGING_CATEGORY( cachedata, "hc.cachedata")

class QSslError;

// -----------------------------------------------------------------------------
CacheData::CacheData(QObject *parent) : QObject(parent) {

  // Call _downloaded() when data is arrived
  connect( &_manager, SIGNAL(finished(QNetworkReply *)),
           SLOT(_downloaded(QNetworkReply *))
           );
}

// -----------------------------------------------------------------------------
void CacheData::cacheData( const QUrl &url, QString filename) {

  QFile f(filename);
  if ( f.exists() ) {
    qCDebug(cachedata) << "File " << filename << "exists, no download";
    return;

    //TODO test if tile is newer than stored: use header only request
  }

  QNetworkRequest request(url);
  QNetworkReply *reply = _manager.get(request);

#if QT_CONFIG(ssl)
  connect( reply, SIGNAL(sslErrors(QList<QSslError>)),
           SLOT(_sslErrors(QList<QSslError>))
           );
#endif

  _currentDownloads[filename] = reply;
}

// -----------------------------------------------------------------------------
bool CacheData::_isHttpRedirect(QNetworkReply *reply) {
  int statusCode = reply->attribute(
        QNetworkRequest::HttpStatusCodeAttribute
        ).toInt();

  qCDebug(cachedata) << "Status return:" << statusCode;

  //return statusCode == 301 || statusCode == 302 || statusCode == 303
  //    || statusCode == 305 || statusCode == 307 || statusCode == 308;
  return statusCode >= 301 && statusCode <= 308;
}

// -----------------------------------------------------------------------------
void CacheData::_sslErrors(const QList<QSslError> &sslErrors) {
#if QT_CONFIG(ssl)
  for (const QSslError &error : sslErrors)
    qCWarning(cachedata) << "SSL error:" << qPrintable(error.errorString());
#else
  Q_UNUSED(sslErrors);
#endif
}

// -----------------------------------------------------------------------------
void CacheData::_downloaded(QNetworkReply *reply) {
  QUrl url = reply->url();
  if ( reply->error() ) {
    qCWarning(cachedata)
        << "Download of" << url.toString()
        << "failed:" << qPrintable(reply->errorString());
  }

  else {
    if ( _isHttpRedirect(reply) ) {
      qCInfo(cachedata) << "Request was redirected.";
    }

    else {
      //TODO would like to have reply as a key, then no loop to search for it
      QHashIterator<QString, QNetworkReply *> i(_currentDownloads);
      while ( i.hasNext() ) {
        i.next();

        if ( i.value() == reply ) {
          QString filename = i.key();
          QString msg = _saveData( filename, reply);
          _currentDownloads.remove(filename);
          if ( msg == "" ) {
            qCInfo(cachedata)
                << "Download of" << url.toString()
                << "succeeded, saved to " << filename;
          }

          else {
            qCWarning(cachedata) << msg;
          }
        }
      }
    }
  }

  reply->deleteLater();
  if ( _currentDownloads.isEmpty() ) {
    // all downloads finished
    //QCoreApplication::instance()->quit();
    qCInfo(cachedata) << "All data cached";
  }
}

// -----------------------------------------------------------------------------
QString CacheData::_saveData( const QString &filename, QIODevice *data) {

  //QFileInfo fi(filename);
  //QFile file(fi.absoluteFilePath());
  QFile file(filename);
  qCInfo(cachedata) << "F: " << file.fileName();
  if ( !file.open(QIODevice::WriteOnly) ) {
    QString errorMessage =
        "Could not open " + filename + " for writing: " + file.errorString();
    return errorMessage;
  }

  file.write(data->readAll());
  file.close();

  return "";
}
