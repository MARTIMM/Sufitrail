#include "linuxutils.h"

#include <QDebug>
#include <QProcess>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
LinuxUtils::LinuxUtils() : Utils() { }

// ----------------------------------------------------------------------------
void LinuxUtils::installImpl(const QString url) {

  QString programName = "HikingCompanion";

  QString program = QStandardPaths::findExecutable(
        programName,
        QStandardPaths::standardLocations(QStandardPaths::ApplicationsLocation)
        );

  QStringList arguments;
  arguments << url;

  QProcess *hikingCompanion = new QProcess();

  // Test purposes to get debug data from process. It freezes the interface.
  // Change to run() when done
  //hikingCompanion->start( program, arguments);
  hikingCompanion->execute( program, arguments);
}

// ----------------------------------------------------------------------------
void LinuxUtils::startImpl() {

  QString programName = "HikingCompanion";

  QString program = QStandardPaths::findExecutable(
        programName,
        QStandardPaths::standardLocations(QStandardPaths::ApplicationsLocation)
        );
  QProcess *hikingCompanion = new QProcess();

  hikingCompanion->start(program);
}
