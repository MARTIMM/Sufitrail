#include "utilsinterface.h"

#include <QApplication>
#include <QQmlApplicationEngine>
#include <QDebug>
#include <QStandardPaths>

// ----------------------------------------------------------------------------
// Define global variables
QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
int main( int argc, char *argv[]) {

  QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

  // Settings used by QSettings to set a location to store its data
  QCoreApplication::setOrganizationName("martimm");
  QCoreApplication::setOrganizationDomain("io.github.martimm");
  QCoreApplication::setApplicationName("SufiTrail");

  QApplication app( argc, argv);
  app.setApplicationVersion("0.3.1");
  app.setApplicationDisplayName("SufiTrail");

  qDebug() << "App data location:" << QStandardPaths::standardLocations(QStandardPaths::AppDataLocation);
  qDebug() << "App config location:" << QStandardPaths::standardLocations(QStandardPaths::AppConfigLocation);
  qDebug() << "Generic data location:" << QStandardPaths::standardLocations(QStandardPaths::GenericDataLocation);
  //qDebug() << "Download location:" << QStandardPaths::standardLocations(QStandardPaths::DownloadLocation);
  //qDebug() << "Documents location:" << QStandardPaths::standardLocations(QStandardPaths::DocumentsLocation);

  qDebug() << "qApp argc:" << argc;
  for ( int i = 0; i < argc; i++) {
    qDebug() << QString("qApp [%1]").arg(i) << argv[i];
  }

  qmlRegisterType<UtilsInterface>(
        "io.github.martimm.SufiTrail.UtilsInterface", 0, 1, "UtilsInterface"
        );

  applicationEngine = new QQmlApplicationEngine();
  applicationEngine->load(QUrl(QStringLiteral("qrc:/Qml/Main/Application.qml")));
  if ( applicationEngine->rootObjects().isEmpty() ) return -1;

  return app.exec();
}

// ============================================================================
#if defined(Q_OS_ANDROID)

//extern "C" {

#include "androidutils.h"

//#include <QAndroidActivityResultReceiver>
#include <QtAndroid>
//#include <QtAndroidExtras>
//#include <QAndroidJniEnvironment>
#include <QAndroidJniObject>
//#include <jni.h>

#define Q_QDOC true

// ----------------------------------------------------------------------------
JNIEXPORT jstring JNICALL Java_utils_TDAndroidUtils_getDataRootDir_2 (
     JNIEnv *env,        /* interface pointer */
     jobject obj         /* "this" pointer */
     ) {
  Q_UNUSED(env)
  Q_UNUSED(obj)

  AndroidUtils *au = new AndroidUtils();
  QString drd = au->dataRootDir();
  qDebug() << "Sending" << drd << "to java";
  QAndroidJniObject jstr = QAndroidJniObject::fromString(drd);

  // qtcreator errors on jstr.object<jstring>(). According to the code
  // a static cast is applied so we do that instead.
  return static_cast<jstring>(jstr.object());
}

// ----------------------------------------------------------------------------
JNIEXPORT void JNICALL Java_utils_TDAndroidUtils_moveDataPublic_2 (
     JNIEnv *env,        /* interface pointer */
     jobject obj         /* "this" pointer */
     ) {
  Q_UNUSED(env)
  Q_UNUSED(obj)

  UtilsInterface *ui = new UtilsInterface();
  ui->installHikingData();
}

//} // extern "C"
#endif

