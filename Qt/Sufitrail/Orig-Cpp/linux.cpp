#include "linux.h"

#include <QDebug>
#include <QProcess>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
Linux::Linux() : Utils() { }

// ----------------------------------------------------------------------------
void Linux::startImpl() {

  if ( _HCNotInstalled ) return;

  qDebug() << "New start on Linux";
  QString programName = "HikingCompanion";

  QString program = QStandardPaths::findExecutable(
        programName,
        QStandardPaths::standardLocations(QStandardPaths::ApplicationsLocation)
        );
  QProcess *hikingCompanion = new QProcess();

  qDebug() << "Start HC on Linux";
  hikingCompanion->execute(program);
  qDebug() << "Stopped on Linux";
}
