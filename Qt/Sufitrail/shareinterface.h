#ifndef SHAREUTILS_H
#define SHAREUTILS_H

#include <QObject>
#include <QQuickItem>
#include <QProgressBar>
#include <QPushButton>

// ----------------------------------------------------------------------------
class ShareInterface : public QObject {

  Q_OBJECT

public:
  explicit ShareInterface(QObject *parent = nullptr);

  Q_INVOKABLE void share();

signals:

public slots:
  //void connectHikerCompanion();

private:

};

#endif // SHAREUTILS_H
