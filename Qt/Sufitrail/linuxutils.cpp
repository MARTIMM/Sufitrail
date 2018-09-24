#include "linuxutils.h"

#include <QDebug>
#include <QProcess>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
LinuxUtils::LinuxUtils() : Utils() { }

// ----------------------------------------------------------------------------
void LinuxUtils::installImpl() {

  qDebug() << "Install on Linux";
  QString programName = "HikingCompanion";

  QString program = QStandardPaths::findExecutable(
        programName,
        QStandardPaths::standardLocations(QStandardPaths::ApplicationsLocation)
        );

  //QStringList arguments;
  //arguments << url;

  QProcess *hikingCompanion = new QProcess();

  // Test purposes to get debug data from process. It freezes the interface.
  // Change to run() when done
  //hikingCompanion->start( program, arguments);
  qDebug() << "Start HC on Linux";
  hikingCompanion->execute(program);
  qDebug() << "Stopped on Linux";
}

// ----------------------------------------------------------------------------
void LinuxUtils::startImpl() {

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
