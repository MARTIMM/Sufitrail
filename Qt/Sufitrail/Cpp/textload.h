#ifndef TEXTLOAD_H
#define TEXTLOAD_H

#include <QObject>
#include <QString>
#include <QFile>

// ----------------------------------------------------------------------------
class TextLoad : public QObject {
  Q_OBJECT
  Q_PROPERTY( QString text READ text NOTIFY textReady)
  Q_PROPERTY( QString filename READ filename WRITE setFilename NOTIFY fileRead)

public:
  explicit TextLoad(QObject *parent = nullptr);

  QString filename();
  void setFilename(QString filename);
  QString text();

signals:
  void fileRead();
  void textReady();

public slots:

private:
  QString _source;
  QString _loadedText;
};

#endif // TEXTLOAD_H
