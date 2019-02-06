#ifndef LANGUAGES_H
#define LANGUAGES_H

//#include "language.h"

#include <QObject>
//#include <QVector>
//#include <QList>
#include <QVariantList>

class Languages : public QObject {

  Q_OBJECT
/*
  Q_PROPERTY(
      QList<Language *> languageList
      READ languageList
      NOTIFY languageListChanged
      )
*/

public:
  explicit Languages(QObject *parent = nullptr);
  ~Languages();

  Q_INVOKABLE void defineLanguages();
  Q_INVOKABLE QStringList languageList();

signals:
  void languageListChanged();

public slots:

private:

  QStringList _languageList;
};

#endif // LANGUAGES_H
