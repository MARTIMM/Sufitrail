#include "textload.h"

#include <QDebug>

// ----------------------------------------------------------------------------
TextLoad::TextLoad(QObject *parent) : QObject(parent) {
  qDebug() << QString("TextLoad init");
}

// ----------------------------------------------------------------------------
QString TextLoad::filename() {
  return _source;
}

// ----------------------------------------------------------------------------
QString TextLoad::text() {
  return _loadedText;
}

// ----------------------------------------------------------------------------
void TextLoad::setFilename(QString filename) {

  qDebug() << QString("set filename %1").arg(filename);

  // read the file
  QFile f (filename);
  if ( !f.open( QIODevice::ReadOnly | QIODevice::Text) ) {
    qDebug() << QString("Open file %1: %2").arg(filename).arg(f.errorString());
    return;
  }

  _source = filename;
  _loadedText = "";
  while ( !f.atEnd() ) {
    _loadedText += f.readLine();
//    qDebug() << _loadedText;
  }
  f.close();

  emit textReady();
}

