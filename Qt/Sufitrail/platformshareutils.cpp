#include "platformshareutils.h"

#include <QDebug>
#include <QProcess>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
PlatformShareUtils::PlatformShareUtils(QObject *parent) : QObject(parent) { }

// ----------------------------------------------------------------------------
void PlatformShareUtils::shareImpl(const QString url) {

  QString programName = "HikingCompanion";

  QString program = QStandardPaths::findExecutable(
        programName,
        QStandardPaths::standardLocations(QStandardPaths::ApplicationsLocation)
        );

  QStringList arguments;
  arguments << url;

  QProcess *hikingCompanion = new QProcess();
/*
  connect(
        hikingCompanion, &QProcess::started,
        this, &PlatformShareUtils::started
        );
*/
//  connect( hikingCompanion, SIGNAL(started()), this, SLOT(started()));

  // Test purposes to get debug data from process. It freezes the interface.
  // Change to run() when done
  //hikingCompanion->run( program, arguments);
  hikingCompanion->execute( program, arguments);
}

/*
// ----------------------------------------------------------------------------
void PlatformShareUtils::started() {
  qDebug() << "started";
}
*/
