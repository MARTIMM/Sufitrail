#ifndef PLATFORMSHAREUTILS_H
#define PLATFORMSHAREUTILS_H

#include <QObject>
#include <QUrl>

// ----------------------------------------------------------------------------
class PlatformShareUtils : public QObject {
  Q_OBJECT
public:
  explicit PlatformShareUtils(QObject *parent = nullptr);

  Q_INVOKABLE void shareImpl( const QString text, const QUrl url);

signals:

public slots:

private:
};

#endif // PLATFORMSHAREUTILS_H
