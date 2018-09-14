#include "platformshareutils.h"

#include <QProcess>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
PlatformShareUtils::PlatformShareUtils(QObject *parent) : QObject(parent) { }

// ----------------------------------------------------------------------------
void PlatformShareUtils::shareImpl( const QString text, const QUrl url) {

  QString t = text;
  QUrl u = url;

  QString programName = "HikingCompanion";

  QString program = QStandardPaths::findExecutable(
        programName,
        QStandardPaths::standardLocations(QStandardPaths::ApplicationsLocation)
        );

  QStringList arguments;
  arguments << text << url.url();

  QProcess *myProcess = new QProcess();
  myProcess->start(program, arguments);
}
