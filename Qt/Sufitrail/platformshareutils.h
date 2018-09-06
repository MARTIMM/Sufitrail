#ifndef PLATFORMSHAREUTILS_H
#define PLATFORMSHAREUTILS_H

#include <QObject>

// ----------------------------------------------------------------------------
class PlatformShareUtils : public QObject {
  Q_OBJECT
public:
  explicit PlatformShareUtils(QObject *parent = nullptr);

  void share( const QString &text, const QUrl &url);

signals:

public slots:

private:
};

#endif // PLATFORMSHAREUTILS_H
