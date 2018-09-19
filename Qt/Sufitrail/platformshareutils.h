#ifndef PLATFORMSHAREUTILS_H
#define PLATFORMSHAREUTILS_H

#include <QObject>

// ----------------------------------------------------------------------------
class PlatformShareUtils : public QObject {
  Q_OBJECT
public:
  explicit PlatformShareUtils(QObject *parent = nullptr);

  Q_INVOKABLE void shareImpl(const QString url);

signals:

public slots:
//  void started();

private:
};

#endif // PLATFORMSHAREUTILS_H
