#include "languages.h"

#include <QDebug>

//QList<Language *> Languages::_languages;

// ----------------------------------------------------------------------------
Languages::Languages(QObject *parent) : QObject(parent) { }

// ----------------------------------------------------------------------------
Languages::~Languages() {
  _languageList.clear();
}

// ----------------------------------------------------------------------------
void Languages::defineLanguages() {

  _languageList.clear();

  _languageList.append("English");
  _languageList.append("Nederlands");
  _languageList.append("Türk");

  qDebug() << "initialized ll:" << _languageList;
  emit languageListChanged();
}

// ----------------------------------------------------------------------------
QStringList Languages::languageList() {

  qDebug() << "return ll:" << _languageList;
  return _languageList;
}
