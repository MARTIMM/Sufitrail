#ifndef UTILSINTERFACE_H
#define UTILSINTERFACE_H

#include <QObject>
#include <QQuickItem>
#include <QProgressBar>
#include <QPushButton>

// ----------------------------------------------------------------------------
class UtilsInterface : public QObject {

  Q_OBJECT

public:
  explicit UtilsInterface(QObject *parent = nullptr);

  Q_INVOKABLE void installHikingData();
  Q_INVOKABLE void startHikingCompanion();

signals:

public slots:

private:

};

#endif // UTILSINTERFACE_H
