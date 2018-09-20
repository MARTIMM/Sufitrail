#include "linuxshareutils.h"

#include <QDebug>
#include <QProcess>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
LinuxShareUtils::LinuxShareUtils() : Worker() { }

// ----------------------------------------------------------------------------
void LinuxShareUtils::shareImpl(const QString url) {

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
  //hikingCompanion->run( program, arguments);
  hikingCompanion->execute( program, arguments);
}
