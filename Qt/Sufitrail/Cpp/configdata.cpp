#include "singleton.h"
#include "configdata.h"
#include "gpxfile.h"

#include <QStandardPaths>
#include <QApplication>
#include <QDir>
#include <QFile>
#include <QXmlStreamWriter>
#include <QDateTime>
#include <QSysInfo>
#include <QScreen>
#include <QQmlApplicationEngine>

extern QQmlApplicationEngine *applicationEngine;

// ----------------------------------------------------------------------------
Q_LOGGING_CATEGORY( config, "hc.config")
Q_LOGGING_CATEGORY( configGetSel, "hc.config.get.sel")
Q_LOGGING_CATEGORY( configSetSel, "hc.config.set.sel")

// ----------------------------------------------------------------------------
ConfigData::ConfigData(QObject *parent) : QObject(parent) {

  // See also http://doc.qt.io/qt-5/qguiapplication.html#platformName-prop
  // For me it could be: android, ios or xcb (x11 on linux)
  qCInfo(config) << "Platform name:" << qApp->platformName();

  // Check the data directories. Make use of GenericDataLocation standard path
  // and look for the directory made up by its id.
  QString id = QCoreApplication::organizationDomain() +
      "." + QCoreApplication::applicationName();
  qCInfo(config) << "Program id:" << id;

  QScreen *screen = QApplication::primaryScreen();
  _pixelRatio = screen->devicePixelRatio();
  qCInfo(config) << "DP ratio:" << _pixelRatio;

  // Take the mean of the x and y densities and convert to mm.
  // I like metric better than english inch, foot, miles(2 kinds) etc.
  _pixelDensity = (
        screen->physicalDotsPerInchX() + screen->physicalDotsPerInchY()
        ) / 50.8;
  qCInfo(config) << "Physical dots/inch X, Y:" << screen->physicalDotsPerInchX() << screen->physicalDotsPerInchY();
  qCInfo(config) << "Mean of x and y physical dots/mm:" << _pixelDensity;

  // Take first directory from the list. That one is the users data directory.
  // linux:     /home/marcel/.config/io.martimm.github.HikingCompanion
  // android:   /data/user/0/io.martimm.github.HikingCompanion/files/settings

#if defined(Q_OS_ANDROID)
  _dataDir = QStandardPaths::standardLocations(
        QStandardPaths::AppConfigLocation
        ).first();

  // Create directory if needed
  this->_mkpath(_dataDir);

  // Create settings and load them
  _settings = new QSettings();
  _settings->setIniCodec("UTF-8");

#elif defined(Q_OS_LINUX)
  _dataDir = QStandardPaths::standardLocations(
        QStandardPaths::GenericConfigLocation
        ).first();

  // For linux we need to attach the id to the general config path
  _dataDir += "/" + id;

  // Create directory if needed
  this->_mkpath(_dataDir);

  // Create settings and load them
  _settings = new QSettings( _dataDir + "/HikingCompanion.conf", QSettings::IniFormat);
  _settings->setIniCodec("UTF-8");
#endif

  // Place default stylesheet into _dataDir directory. Make
  // a config entry for the style file
  //setSetting( "style", ":Assets/Theme/HikingCompanion.json");
  setSetting( "style", ":HikeData/SufiTrailTheme.json");

  //QFile::remove(_dataDir + "/HikingCompanion.json");
  //QString stylePath = getSetting("style");
  //if ( QFile::copy( stylePath, _dataDir + "/HikingCompanion.json") ) {
  //  qCDebug(config) << "copy stylesheet ok";
  //}

  //else {
  //  qCDebug(config) << "copy stylesheet not ok";
  //}


  // Create cache directories
  //this->_mkpath(_dataDir + "/Cache/Tiles");
  //this->_mkpath(_dataDir + "/Cache/Features");

  // With this I can use "cache:Tiles" or "cache/Features" in e.g.
  // value of PluginParameter name "osm.mapping.offline.directory"
  QDir::setSearchPaths( "cache", QStringList(":HikeData/Cache"));


  // Create a Pages subdirectory for html files and copy html files to it.
  // Also make config entries for them.
  //this->_mkpath(_dataDir + "/Pages");
  setSetting( "aboutText", ":HikeData/Pages/aboutText.html");
/*
  _pages = QStringList({ "aboutText"});
  for ( int pi = 0; pi < _pages.count(); pi++) {
    QString htmlTextPath = getSetting(_pages[pi]);
    QFile::remove(_dataDir + "/Pages/" + _pages[pi] + ".html");
    if ( QFile::copy( htmlTextPath, _dataDir + "/Pages/" + _pages[pi] + ".html") ) {
      qCDebug(config) << "copy " << _pages[pi] + ".html ok";
    }

    else {
      qCDebug(config) << "copy " << _pages[pi] + ".html not ok";
    }
  }
*/

  /*
  // Prepare a location for data sharing and create the root of it
  // linux:     /home/marcel/.local/share/io.github.martimm.HikingCompanion
  // Android:   /storage/emulated/0/Android/Data/io.github.martimm.HikingCompanion
  QString publicLoc = QStandardPaths::standardLocations(
        QStandardPaths::GenericDataLocation
        ).first();

#if defined(Q_OS_ANDROID)
  publicLoc += "/Android/Data/" + id;
#elif defined(Q_OS_LINUX)
  publicLoc += "/" + id;
#endif


  this->_mkpath(publicLoc);
  _dataShareDir = publicLoc + "/newHikeData";
  this->checkForNewHikeData();
*/

  // Instantiate hikes object
  _hikes = new Hikes();

  // Load api key. This way the key stored in a file stays out of github
  // using the gitignore filter.
  _loadThunderForestApiKey();
}

// ----------------------------------------------------------------------------
ConfigData *ConfigData::instance() {
  return Singleton<ConfigData>::instance(ConfigData::_createInstance);
}
/*
// ----------------------------------------------------------------------------
void ConfigData::checkForNewHikeData() {

  //TODO test for newHikeData to see if there is new data
  //Now the directory must be created by user/external application

  QDir *dd = new QDir(_dataShareDir);
  qCDebug(config) << _dataShareDir << dd->absoluteFilePath(_dataShareDir);

  if( dd->exists() ) {
    qCInfo(config)
        << "Data sharing directory" << _dataShareDir <<
           "exists. look for data";
    this->_installNewData();
    qCInfo(config) << "Remove public hike source data from" << _dataShareDir;
    dd = new QDir(_dataShareDir);
    dd->removeRecursively();
  }
}
*/
/*
// ----------------------------------------------------------------------------
// Cleanup tracks information of all hikes in config when there are no entries
// in the hike list. This is to prevent linguering entries to disturb
// later config changes.
void ConfigData::cleanupTracks() {

  //QRegExp rx("^(h\\d+|h\\.)"); // intended to remove buggy entries
  QRegExp rx("^(h\\d+)");
  QStringList topLevelKeys = _settings->childGroups();
  for ( int hi = 0; hi < topLevelKeys.count(); hi++ ) {
    if ( topLevelKeys[hi].contains(rx) ) {
      qCDebug(config) << "Remove keys of" << topLevelKeys[hi];
      _removeSettings(topLevelKeys[hi]);
    }
  }
}
*/
/*
// ----------------------------------------------------------------------------
// Cleanup all information of a selected hike in config and all directories
// with data as well.
void ConfigData::cleanupHike() {

  // Remove track info from configuration
  QString entryKey = hikeEntryKey();
  QString tableName = hikeTableName(entryKey);
  int nTracks = getSetting(tableName + "/ntracks").toInt();
  for ( int ti = 0; ti < nTracks; ti++) {
    qCDebug(config) << "Remove table" << this->tracksTableName( tableName, ti);
    _removeSettings(this->tracksTableName( tableName, ti));
  }

  // Remove hike info from configuration
  qCDebug(config) << "Remove table" << tableName + ".Releases";
  _removeSettings(tableName + ".Releases");
  qCDebug(config) << "Remove table" << tableName;
  _removeSettings(tableName);

  // Remove hike content from directories
  QString hikeKey = getSetting("HikeList/" + entryKey);
  QString dir = _dataDir + "/Hikes/" + hikeKey;
  qCDebug(config) << "Remove directory and content" << dir;
  QDir *dd = new QDir(dir);
  dd->removeRecursively();

  // Correct entry numbering
  int hikeIdx = getSetting("selectedhikeindex").toInt();
  int nHikes = readKeys("HikeList").count();

  // Check if selected hike is the last one. If so, not much has to be done.
  if ( hikeIdx + 1 == nHikes ) {
    QString entryKey = QString("h%1").arg(hikeIdx);
    _settings->remove("HikeList/" + entryKey);
  }

  else {
    // Entry numbering must be shifted downwards for the numbers
    // above current (removed) entry.
    for ( int hi = hikeIdx + 1; hi < nHikes; hi++) {
      // Get entry keys
      QString fromHikeEntryKey = QString("h%1").arg(hi);
      QString toHikeEntryKey = QString("h%1").arg(hi - 1);

      // Get table names
      QString fromHikeTable = hikeTableName(fromHikeEntryKey);
      int nTracks = getSetting(fromHikeTable + "/ntracks").toInt();
      QString toHikeTable = fromHikeTable;
      toHikeTable.replace( 0, 2, toHikeEntryKey);

      // Move main table one number down
      this->_moveTable( fromHikeTable, toHikeTable);

      // Do the same for the track entries
      for ( int ti = 0; ti < nTracks; ti++) {
        QString fromTrackTable = tracksTableName( fromHikeTable, ti);
        QString toTrackTable = fromTrackTable;
        toTrackTable.replace( 0, 2, toHikeEntryKey);
        this->_moveTable( fromTrackTable, toTrackTable);
      }

      // Do the same for the releases entry
      QString fromRelTable = fromHikeTable + ".Releases";
      QString toRelTable = fromRelTable;
      toRelTable.replace( 0, 2, toHikeEntryKey);
      this->_moveTable( fromRelTable, toRelTable);

      // Remove entry from hike table and copy next to this
      _settings->remove("HikeList/" + toHikeEntryKey);
      setSetting(
            "HikeList/" + toHikeEntryKey,
            getSetting( "HikeList/" + fromHikeEntryKey)
            );
    }
  }

  // reset current hike entry to 0
  setSetting( "selectedhikeindex", 0);
}
*/

// ----------------------------------------------------------------------------
// Set only new string values to this applications config settings
void ConfigData::setSetting( QString name, QString value ) {
  qCDebug(configSetSel) << QString("Set %1 to %2").arg(name).arg(value);
  _settings->setValue( name, value);
  _settings->sync();
}

// ----------------------------------------------------------------------------
// Set only new integer values to this applications config settings
void ConfigData::setSetting( QString name, int value ) {
  qCDebug(configSetSel) << QString("Set %1 to %2").arg(name).arg(value);
  _settings->setValue( name, value);
  _settings->sync();
}
// ----------------------------------------------------------------------------
// Read values from this applications config settings or external config
QString ConfigData::getSetting( QString name, QSettings *s ) {

  QSettings *settings;
  if ( s == nullptr ) {
    settings = _settings;
  }

  else {
    settings = s;
  }

  if ( settings->value(name).type() == QVariant::Invalid ) return "";
  QString v = settings->value(name).toString();
  qCDebug(configGetSel) << "Get selection:" << name << v;
  return v;
}

// ----------------------------------------------------------------------------
// Read keys from this applications config settings or external config
QStringList ConfigData::readKeys( QString group, QSettings *s ) {

  QSettings *settings;
  if ( s == nullptr ) {
    settings = _settings;
  }

  else {
    settings = s;
  }

  settings->beginGroup(group);
  QStringList keys = settings->childKeys();
  qCDebug(configGetSel) << "returned keys for group: " << keys;
  settings->endGroup();
  return keys;
}

// ----------------------------------------------------------------------------
// Return a key name like "h0" for an entry in the HikeList.
// An empty string is returned when the selectedhikeindex is not found or,
// in case of a provided hikeKey, the key is not found.
QString ConfigData::hikeEntryKey(QString hikeKey) {

  QString hikeIndex = "";

  // Take the selected hike index if hike key is not provided
  if ( hikeKey == "" ) {

    QString hi = getSetting("selectedhikeindex");
    if ( hi != "" ) hikeIndex = QString("h") + hi;
  }

  // If hike key is given, search for it and return entry if there.
  // If not, return ""
  else {

    QStringList keys = readKeys("HikeList");
    for ( int ki = 0; ki < keys.count(); ki++ ) {
      if ( getSetting("HikeList/" + keys[ki]) == hikeKey) {
        hikeIndex = QString("h%1").arg(ki);
        break;
      }
    }
  }

  return hikeIndex;
}

// ----------------------------------------------------------------------------
QString ConfigData::hikeTableName( QString hikeEntryKey ) {

  QString hikeKey = getSetting("HikeList/" + hikeEntryKey);
  return hikeEntryKey + "." + hikeKey;
}

// ----------------------------------------------------------------------------
QString ConfigData::tracksTableName( QString hikeTableName, int trackCount) {

  return QString("%1.Track%2").arg(hikeTableName).arg(trackCount);
}


// ----------------------------------------------------------------------------
int ConfigData::getGpxFileIndexSetting() {

  QString entryKey = hikeEntryKey();
  QString tableName = hikeTableName(entryKey);
  return getSetting( tableName + "/gpxfileindex").toInt();
}

// ----------------------------------------------------------------------------
void ConfigData::setGpxFileIndexSetting( int currentIndex ) {

  QString entryKey = hikeEntryKey();
  QString tableName = hikeTableName(entryKey);
  setSetting( tableName + "/gpxfileindex", currentIndex);
}

// ----------------------------------------------------------------------------
QString ConfigData::getHtmlPageFilename( QString pageName) {

  QString textPath;
  QString entryKey = this->hikeEntryKey();
  QString tableName = this->hikeTableName(entryKey);

  // If the tablename is not found, return the default page
  if ( tableName == "" ) {
    textPath = _dataDir + "/Pages/" + pageName + ".html";
    qCWarning(config) << "no html page name for entry" << entryKey << "-->" << textPath;
  }

  else {
    // If the textPath of the page is not found, return the default page
    textPath = getSetting( tableName + "/" + pageName);
    if ( textPath == "" ) {
      textPath = _dataDir + "/Pages/" + pageName + ".html";
      qCWarning(config) << "no html page name for table" << tableName << "-->" << textPath;
    }

    else {
      QString ek = this->getSetting("HikeList/" + entryKey);
      textPath = _dataDir + "/Hikes/" + ek + "/Pages/" + textPath;
      qCInfo(config) << "html page found" << textPath;
    }
  }

  return textPath;
}

// ----------------------------------------------------------------------------
QString ConfigData::getTheme( bool takeHCSettings = false ) {

  QString stylePath;
  QString entryKey = this->hikeEntryKey();
  QString tableName = this->hikeTableName(entryKey);

  // if HC settings are true or when the table is not found,
  // take the default style
  if ( takeHCSettings || tableName == "" ) {
    stylePath = _dataDir + "/HikingCompanion.json";
    qCWarning(config) << "no tablename:" << stylePath;
  }

  else {
    stylePath = getSetting( tableName + "/style");

    // If there is no style path, take the default
    if ( stylePath == "" ) {
      stylePath = _dataDir + "/HikingCompanion.json";
      qCWarning(config) << "no style in:" << tableName << "->" << stylePath;
    }

    else {
      QString ek = this->getSetting("HikeList/" + entryKey);
      stylePath = _dataDir + "/Hikes/" + ek + "/" + stylePath;
      qCInfo(config) << "style:" << tableName << "->" << stylePath;
    }
  }

  // Read the JSON style and return it
  QFile *stylesheet = new QFile(stylePath);
  stylesheet->open(QIODevice::ReadOnly);
  QString styleText = QLatin1String(stylesheet->readAll());

  return styleText;
}


// ----------------------------------------------------------------------------
QString ConfigData::getHCVersion() {
  return HIKING_COMPANION_VERSION;
}

// ----------------------------------------------------------------------------
QString ConfigData::getOsVersion() {
  return QSysInfo::prettyProductName();
}

// ----------------------------------------------------------------------------
// Return the hike title, hike version and program version
QStringList ConfigData::getHikeVersions() {

  QStringList hikeInfo;
  QString entryKey = this->hikeEntryKey();
  QString tableName = this->hikeTableName(entryKey);
  if ( tableName == "" ) {
    hikeInfo.append( {"-", "-", "-"});
  }

  else {
//qDebug() << "Table:" << tableName;
    QString hv = this->getSetting(tableName + "/version");
    QString phv = this->getSetting(tableName + "/programVersion");
//qDebug() << "hv, phv:" << hv << phv;
    hikeInfo.append(
      { this->getSetting(tableName + "/title"),
        hv == "" ? "0.0.0" : hv,
        phv == "" ? "0.0.0" : phv
      }
      );
  }

  return hikeInfo;
}

// ----------------------------------------------------------------------------
QStringList ConfigData::getVersions() {

  QStringList vlist;
  vlist.append(this->getHCVersion());
  vlist.append(this->getHikeVersions());
  vlist.append(this->getOsVersion());

  return vlist;
}

// ----------------------------------------------------------------------------
void ConfigData::_removeSettings(QString group) {
  _settings->remove(group);
  _settings->sync();
}

// ----------------------------------------------------------------------------
// Return length in millimeters
double ConfigData::fysLength( int pixels ) {
  qCDebug(config) << _pixelDensity << pixels << _pixelDensity / static_cast<double>(pixels);
  if ( pixels <= 0 ) return 0.0;
  return static_cast<double>(pixels) / _pixelDensity;
}

// ----------------------------------------------------------------------------
// Return size in pixels given length in milimeters
int ConfigData::pixels( double fysLength ) {
  if ( fysLength <= 0.0 ) return 0;
  return static_cast<int>(fysLength * _pixelDensity + 0.5);
}

// ----------------------------------------------------------------------------
void ConfigData::setWindowSize( int w, int h) {
  _width = w;
  _height = h;
}

// ----------------------------------------------------------------------------
void ConfigData::saveUserTrackNames(
    QString hikeTitle, QString hikeDesc, QString hikeKey
    ) {

  QString entryKey = hikeEntryKey(hikeKey);
  if ( entryKey == "" ) {
    int nKeys = readKeys("HikeList").count();
    entryKey = QString("h%1").arg(nKeys);
    setSetting( "HikeList/" + entryKey, hikeKey);

    // Then also add the hike table
    QString hikeTableName = entryKey + "." + hikeKey;
    setSetting( hikeTableName + "/aboutText", "");
    setSetting( hikeTableName + "/defaultlang", "en");
    setSetting( hikeTableName + "/gpxfileindex", "0");
    setSetting( hikeTableName + "/install", "internal");
    setSetting( hikeTableName + "/nfeatures", "0");
    setSetting( hikeTableName + "/nnotes", "0");
    setSetting( hikeTableName + "/nphotos", "0");
    setSetting( hikeTableName + "/ntracks", "0");
    setSetting( hikeTableName + "/programVersion", "No program involved");
    setSetting( hikeTableName + "/shortdescr", hikeDesc);
    setSetting( hikeTableName + "/style", "");
    setSetting( hikeTableName + "/supportedlang", "en");
    setSetting( hikeTableName + "/title", hikeTitle);
    setSetting( hikeTableName + "/version", "0.0.1");
    setSetting( hikeTableName + "/www", "");

    QString owner = getSetting("User/username");
    if ( owner == "" ) owner = "user";
    setSetting( hikeTableName + "/owner", owner);

    setSetting( hikeTableName + ".Releases/0.0.1", "Create user hike tables");
  }

  // If already there
  else {

    QString hikeTableName = entryKey + "." + hikeKey;
    setSetting( hikeTableName + "/shortdescr", hikeDesc);
    setSetting( hikeTableName + "/title", hikeTitle);

    QString owner = getSetting("User/username");
    if ( owner == "" ) owner = "user";
    setSetting( hikeTableName + "/owner", owner);
  }
}

// ----------------------------------------------------------------------------
bool ConfigData::saveUserTrack(
    QString hikeKey, QString trackTitle,
    QString trackDesc, QString trackType,
    std::vector<Coord> coordinates
    ) {

  bool success = false;

  QString entryKey = hikeEntryKey(hikeKey);
  qCDebug(config) << "SUT:" << hikeKey << entryKey << trackTitle;

  if ( entryKey != "" ) {
    QString hikeTableName = entryKey + "." + hikeKey;

    QString nTracks = getSetting(hikeTableName + "/ntracks");
    success = _storeCoordinates(
          hikeKey, hikeTableName, trackTitle,
          trackDesc, trackType, coordinates, nTracks
          );
    if ( success ) {
      // Update version and release notes
      QStringList v = getSetting(hikeTableName + "/version").split(".");
      QString version = QString("0.%1.0").arg(v[1].toInt() + 1);
      setSetting( hikeTableName + "/version", version);
      setSetting(
            hikeTableName + ".Releases/" + version,
            trackTitle + ": " + trackDesc
            );

      setSetting( hikeTableName + "/ntracks", nTracks.toInt() + 1);
    }
  }

  return success;
}

/*
// ----------------------------------------------------------------------------
void ConfigData::_installNewData() {

  // Check for hike.conf configuration file
  qCInfo(config) << "Install data from" << _dataShareDir + "/hike.conf";
  if ( ! QFile::exists(_dataShareDir + "/hike.conf") ) {
    qCCritical(config) << _dataShareDir + "/hike.conf does not exist";
    return;
  }

  // Use the configuration file
  QSettings *s = new QSettings(
        _dataShareDir + "/hike.conf",
        QSettings::IniFormat
        );
  s->setIniCodec("UTF-8");

  // Get the key name of this new hike and make path to hike subdir
  QString hikename = getSetting( "hike", s);
  qCInfo(config) << "Hike key" << hikename;
  QString hikeDir = _dataDir + "/Hikes/" + hikename;

  // Compare new version with installed version.
  // First get hike list if there is any. Via the list we get to
  // the installed information.
  QStringList hikeListKeys = readKeys("HikeList");
  QString hikeEntryKey = "";
  QString hikeTableName;
  QString hikeVersion;
  for ( int hli = 0; hli < hikeListKeys.count(); hli++) {
    QString name = getSetting("HikeList/" + hikeListKeys[hli]);
    // If name is found in the hike list, save the entry key and table name
    if ( name.compare(hikename) == 0 ) {
      hikeEntryKey = hikeListKeys[hli];
      hikeTableName = hikeEntryKey + "." + hikename;
      break;
    }
  }

  // Check if we found a table. If not, create a new table. All tables
  // start with letter 'h' followed by a number. This number is the entry
  // count in the hike list.
  if ( hikeEntryKey.compare("") == 0 ) {
    hikeEntryKey = QString("h%1").arg(hikeListKeys.count());
    hikeTableName = hikeEntryKey + "." + hikename;
    hikeVersion = "";

    setSetting( QString("HikeList/") + hikeEntryKey, hikename);
  }

  else {
    hikeVersion = getSetting(hikeTableName + "/version");
  }

  qCInfo(config) << "Versions old/new:" << hikeVersion << getSetting( "version", s);
  // If version of imported hike is greater, then there is work to do
  if ( hikeVersion.compare(getSetting( "version", s)) < 0 ) {
    qCDebug(config) << "Remove old data from" << hikeDir;
    QDir *dd = new QDir(hikeDir);
    dd->removeRecursively();
    dd->mkpath(hikeDir);

    _mkNewTables( s, hikeTableName);
    _refreshData( s, hikeTableName, hikeDir);
  }
}
*/
/*
// ----------------------------------------------------------------------------
// Create new tables. One for the hike and one for its release notes
void ConfigData::_mkNewTables( QSettings *s, QString hikeTableName ) {

  // Remove the hike table and the releases table
  _removeSettings(hikeTableName);
  QString releaseTableName = hikeTableName + ".Releases";
  _removeSettings(releaseTableName);

  // Keys needed for the hike table
  QStringList keys = {
    "programVersion", "version", "title", "shortdescr", "www",
    "defaultlang", "supportedlang", "translationfile", "style",
    "aboutText"
  };

  for ( int ki = 0; ki < keys.count(); ki++) {
    QString v = getSetting( keys[ki], s);
    setSetting( hikeTableName + "/" + keys[ki], v);
  }

  // Default the first track is selected
  setSetting( hikeTableName + "/gpxfileindex", 0);

  // Release notes table
  QStringList releaseKeys = readKeys( "Releases", s);
  for ( int ri = 0; ri < releaseKeys.count(); ri++) {
    setSetting(
          releaseTableName + "/" + releaseKeys[ri],
          getSetting( "Releases/" + releaseKeys[ri], s)
          );
  }
}
*/
/*
// ----------------------------------------------------------------------------
void ConfigData::_refreshData(
    QSettings *s, QString hikeTableName, QString hikeDir
    ) {

  // Remove all data first then create all directories, if needed,
  // and add data to it
  QString hikeSubdir = hikeDir + "/Tracks";
  QDir *dd = new QDir(hikeSubdir);

  // Remove track files and config tables. Table count must follow track names.
  if ( dd->exists() ) {

    QStringList gpxFiles = dd->entryList( QDir::Files, QDir::Name);
    for ( int gfi = 0; gfi < gpxFiles.count(); gfi++) {

      // Remove table
      QString trackTableName = hikeTableName + QString(".Track%1").arg(gfi + 1);
      qCDebug(config) << "Remove table" << trackTableName;
      _removeSettings(trackTableName);
    }
  }

  else {
    qCInfo(config) << "Create dir " << hikeSubdir;
    dd->mkpath(hikeSubdir);
  }

  // Copy theme file
  QString themeFile = getSetting( "style", s);
  qCInfo(config) << "ThemeFile:" << themeFile;
  if( themeFile != "" ) {
    QDir *tfd = new QDir(_dataShareDir);
    if( tfd->exists(themeFile) ) {
      QFile::copy(
            _dataShareDir + '/' + themeFile,
            hikeDir + '/' + themeFile
            );
    }
    else {
      qCWarning(config) << "themefile does not exist at" << _dataShareDir;
    }
  }

  // Cleanup info pages directory and recreate dir
  hikeSubdir = QString(hikeDir + "/Pages");
  dd = new QDir(hikeSubdir);
  if ( dd->exists() ) dd->removeRecursively();
  dd->mkpath(hikeSubdir);

  // Copy info pages
  QString sourcePagesDirectory = _dataShareDir + "/" + getSetting( "pagesdir", s);
  for ( int pi = 0; pi < _pages.count(); pi++) {
    QString htmlSrcTextPath = sourcePagesDirectory + "/" + getSetting( _pages[pi], s);
    QString htmlDstTextPath = hikeSubdir + "/" + _pages[pi] + ".html";
    if ( QFile::copy( htmlSrcTextPath, htmlDstTextPath) ) {
      qCDebug(config) << "copy" << htmlDstTextPath << "ok";
    }

    else {
      qCWarning(config) << "copy" << htmlDstTextPath << "not ok";
    }
  }

  // Add tracks to empty directory and create tables
  // Get source directory and list of files
  QString sourceGpxDirectory = _dataShareDir + "/" + getSetting( "tracksdir", s);
  QDir *sgd = new QDir(sourceGpxDirectory);
  hikeSubdir = QString(hikeDir + "/Tracks");

  qCInfo(config) << "source hike tracks:" << sourceGpxDirectory;
  qCInfo(config) << "destination hike tracks:" << hikeSubdir;

  // Maximum number of files possible
  int nbrGpxFiles = sgd->entryList(QDir::Files).count();
  int nbrDefinedGpxFiles = 0;
  for ( int gfi = 0; gfi < nbrGpxFiles; gfi++) {

    // Create table
    QString srcTrackTable = QString("Track%1").arg(gfi);
    QString destTrackTable = hikeTableName + QString(".Track%1").arg(gfi);

    qCDebug(config) << "src/dest table" << srcTrackTable << destTrackTable;

    // If there are no keys for this table, we are done
    QStringList trackKeys = readKeys( srcTrackTable, s);
    if ( trackKeys.count() == 0 ) {
      nbrDefinedGpxFiles = gfi;
      break;
    }

    //TODO: Length and boundaries must be calculated
    QStringList keys = {
      "fname", "title", "shortdescr", "type", "length",
    };

    for ( int ki = 0; ki < keys.count(); ki++) {
      QString v = getSetting( srcTrackTable + "/" + keys[ki], s);
      setSetting( destTrackTable + "/" + keys[ki], v);
    }

    // Copy file
    QString fname = getSetting( srcTrackTable + "/fname", s);
    QFile::copy(
          sourceGpxDirectory + "/" + fname,
          hikeSubdir + "/" + fname
          );
    qCInfo(config) << "copy" << sourceGpxDirectory + "/" + fname;
  }

  setSetting( hikeTableName + "/ntracks", nbrDefinedGpxFiles);

  hikeSubdir = QString(hikeDir + "/Photos");
  dd = new QDir(hikeSubdir);
  if ( ! dd->exists() ) dd->mkpath(hikeSubdir);
  setSetting( hikeTableName + "/nphotos", 0);
  qCInfo(config) << "hike photos:" << hikeSubdir;

  hikeSubdir = hikeDir + "/Notes";
  dd = new QDir(hikeSubdir);
  if ( ! dd->exists() ) dd->mkpath(hikeSubdir);
  setSetting( hikeTableName + "/nnotes", 0);
  qCInfo(config) << "hike notes:" << hikeSubdir;

  hikeSubdir = hikeDir + "/Features";
  dd = new QDir(hikeSubdir);
  if ( ! dd->exists() ) dd->mkpath(hikeSubdir);
  setSetting( hikeTableName + "/nfeatures", 0);
  qCInfo(config) << "hike features:" << hikeSubdir;
}
*/

// ----------------------------------------------------------------------------
// Copy one table to the other and remove the old one
void ConfigData::_moveTable( QString fromTable, QString toTable) {

  // Copy table
  QStringList keys = readKeys(fromTable);
  for( int ki = 0; ki < keys.count(); ki++) {
    this->setSetting(
          toTable + "/" + keys[ki],
          this->getSetting(fromTable + "/" + keys[ki])
          );
  }

  // Remove old table
  _removeSettings(fromTable);
}

// ----------------------------------------------------------------------------
bool ConfigData::_mkpath(QString path) {

  bool ok = true;
  QString p = "/";
  QDir *dd;

  QStringList parts = path.split( '/', QString::SkipEmptyParts);
  for ( int pi = 0; pi < parts.count(); pi++) {
    dd = new QDir(p);
    if ( dd->exists(parts[pi]) ) {
      //qDebug() << p << parts[pi] << "exists -> next";
    }

    else if ( dd->mkdir(parts[pi]) ) {
      //qDebug() << p << parts[pi] << "ok";
    }

    else {
      qCCritical(config) << p << parts[pi] << "fails";
      ok = false;
      break;
    }

    if ( pi == 0 ) {
      p += parts[pi];
    }

    else {
      p += "/" + parts[pi];
    }
  }

  qCInfo(config) << path << "ok:" << ok;
  return ok;
}

// ----------------------------------------------------------------------------
ConfigData *ConfigData::_createInstance() {
  return new ConfigData;
}

// ----------------------------------------------------------------------------
// Save coordinates in a gpx file. Return true when file is written successfuly
// and false when another file whas found.
bool ConfigData::_storeCoordinates(
    QString hikeKey, QString hikeTableName, QString trackTitle,
    QString trackDesc, QString trackType, std::vector<Coord> coordinates,
    QString nTracks
    ) {

  bool success = false;
  QString filename = trackTitle + ".gpx";
  qCInfo(config) << "Store coords in" << filename;

  // Check tracks directory
  QString trackPath = _dataDir + "/Hikes/" + hikeKey + "/Tracks";
  QDir *dd = new QDir(trackPath);
  if ( !dd->exists() ) _mkpath(trackPath);

  QFile *ff = new QFile(trackPath + "/" + filename);
  qCInfo(config) << "Path:" << trackPath + "/" + filename << ff->exists();
  if ( !ff->exists() ) {
    // Mise en place
    QString hikeTitle = getSetting(hikeTableName + "/title");
    QString www = getSetting(hikeTableName + "/www");
    QString owner = getSetting(hikeTableName + "/owner");
    QString time = QDateTime().toString("dd-MM-YYYY hh:mm:ss t");

    ff->open(QIODevice::ReadWrite);
    QXmlStreamWriter gpx(ff);
    gpx.setAutoFormatting(true);
    gpx.writeStartDocument();

    // Toplevel element
    gpx.writeStartElement("gpx");
    gpx.writeNamespace(
          "http://www.w3.org/2001/XMLSchema-instance", QString("xsi"));
    gpx.writeNamespace( "http://www.topografix.com/GPX/1/1", QString(""));
    gpx.writeAttribute(
          "xsi:schemaLocation", "http://www.topografix.com/GPX/1/1/gpx.xsd"
          );
    gpx.writeAttribute( "version", "1.1");
    gpx.writeAttribute( "creator", "HikingCompanion App");

    // Metadata section
    gpx.writeStartElement("metadata");
    if ( www != "" ) gpx.writeTextElement( "link", www);
    if ( owner != "" ) {
      gpx.writeTextElement( "copyright", owner);
      gpx.writeTextElement( "author", owner);
    }
    if ( trackTitle != "" ) gpx.writeTextElement( "name", hikeTitle);
    if ( trackDesc != "" ) gpx.writeTextElement( "description", trackDesc);
    gpx.writeTextElement( "time", time);
    gpx.writeEndElement(); // metadata

    // Start track coordinates section
    gpx.writeStartElement("trk");
    gpx.writeTextElement( "name", trackTitle);
    gpx.writeStartElement("trkseg");
    for ( Coord c : coordinates ) {
      gpx.writeEmptyElement("trkpt");
      qCDebug(config) << c.longitude << c.latitude << c.altitude;
      gpx.writeAttribute( "lat", QString("%1").arg( c.latitude, 20, 'f', 20));
      gpx.writeAttribute( "lon", QString("%1").arg( c.longitude, 20, 'f', 20));
    }
    gpx.writeEndElement(); // trkseg
    gpx.writeEndElement(); // trk

    gpx.writeEndElement(); // gpx
    gpx.writeEndDocument();
    ff->close();

    success = true;

    QString trackTable = hikeTableName + ".Track" + nTracks;
    setSetting( trackTable + "/fname", filename);
    setSetting( trackTable + "/shortDescr", trackDesc);
    setSetting( trackTable + "/title", trackTitle);
    setSetting( trackTable + "/type", trackType);
  }

  return success;
}

// ----------------------------------------------------------------------------
void ConfigData::_loadThunderForestApiKey() {
  QFile f (":Assets/thunderForestApiKey");
  if ( !f.open( QIODevice::ReadOnly | QIODevice::Text) ) {
    qCWarning(config)
        << QString("Open file %1: %2").arg(f.fileName()).arg(f.errorString());
    return;
  }

  // Read key and remove newline char(unix)
  _thunderForestApiKey = f.readLine();
  _thunderForestApiKey.chop(1);
  qCInfo(config) << "Api key:" << _thunderForestApiKey;
  f.close();
}

