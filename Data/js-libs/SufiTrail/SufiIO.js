/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/

/**
 * @fileoverview
 */

"use strict";

goog.provide('SufiTrail.SufiIO');


/** ============================================================================
  @constructor
*/
SufiTrail.SufiIO = function ( ) {

  // adaptor/mediator
  this.center = null;

  // Data urls
  this.urls = {
    // file:///storage/emulated/<app id>/Android/data/sufitrail.io.github.martimm/
    topFsUrl: null,
    topDirEntry: null,

    // Data root at <topFsUrl>/files
    fileDirectory: null,
    // Tracks dir at <topFsUrl>/files/Tracks
    tracksDirEntry: null,

    // Cache root at <topFsUrl>/cache
    cacheDirectory: null,
    // Features dir at <topFsUrl>/cache/Features
    featureDirEntry: null,
    // Tiles dir at <topFsUrl>/cache/Tiles
    tileDirEntry: null
  }
}

/** ----------------------------------------------------------------------------
  Initialize the i/o object
  @public
  @param {SufiTrail.SufiCenter} center Sufi trail core object
*/
SufiTrail.SufiIO.prototype.init = function ( center ) {
  this.center = center;

  var self = this;

  // cordova file paths are only available after device ready!
  this.urls.topFsURL = cordova.file.externalApplicationStorageDirectory;

  // create directories if not exists
  goog.global.resolveLocalFileSystemURL(
    this.urls.topFsURL,
    function ( topDirEntry ) {
      self.urls.topDirEntry = topDirEntry;
console.log('top: ' + topDirEntry.isDirectory);
console.log('top: ' + topDirEntry.name);
      self.getDirectory(
        topDirEntry, 'files', 'fileDirectory', 'createFileDirectories'
      );
      self.getDirectory(
        topDirEntry, 'cache', 'cacheDirectory', 'createCacheDirectories'
      );
    },

    function ( e ) { self.onErrorLoadFs(e); }
  );
}

/** ----------------------------------------------------------------------------
  create sub directories in root directory
  @private
  @param {DirectoryEntry} dirEntry directory object
*/
SufiTrail.SufiIO.prototype.createCacheDirectories = function ( dirEntry ) {

  this.getDirectory( dirEntry, 'Tiles', 'tileDirEntry', null);
  this.getDirectory( dirEntry, 'Features', 'featureDirEntry', null);
}

/** ----------------------------------------------------------------------------
  create sub directories in root directory
  @private
  @param {DirectoryEntry} dirEntry directory object
*/
SufiTrail.SufiIO.prototype.createFileDirectories = function ( dirEntry ) {

  this.getDirectory( dirEntry, 'Tracks', 'tracksDirEntry', null);
}

/** ----------------------------------------------------------------------------
  Get or create directory path
  @public
  @param {DirectoryEntry} dirEntry directory object
  @param {string} dirName Directory name
  @param {string} entryStore Location in this object to store dirEntry
  @param {null || string || function} continueHandlerName a handler in this object
*/
SufiTrail.SufiIO.prototype.getDirectory = function (
  dirEntry, dirname, entryStore, continueHandlerName
) {

  var self = this;

  dirEntry.getDirectory(
    dirname, { create: true },
    function ( subDirEntry ) {
      if( typeof entryStore === 'string' ) {
        self.urls[entryStore] = subDirEntry;
console.log('Create dir path: ' + self.urls[entryStore].fullPath);
      } else if( typeof entryStore === 'function' ) {
        entryStore(subDirEntry);
      }

      if( typeof continueHandlerName === "string" ) {
        self[continueHandlerName](subDirEntry);
      } else if( typeof continueHandlerName === "function" ) {
        self.continueHandlerName(subDirEntry);
      }
    },
    function ( e ) { self.onErrorGetDir(e); }
  );
}

//----------------------------------------------------------------------------
// Creates a new file or returns the file if it already exists.
SufiTrail.SufiIO.prototype.createFile = function (
  dirEntry, fileName, isAppend
) {

  var self = this;

  dirEntry.getFile(
    fileName, {create: true, exclusive: false},
    function ( ) { self.wf(); },
    function ( e ) { self.onErrorCreateFile(e); }
  );
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.wf = function ( fileEntry ) {
  this.writeFile( fileEntry, null, isAppend);
}

// ---------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.writeRequest = function (
  filename, content, observerKey
) {
//console.log(cordova.file);
console.log('AD:  ' + cordova.file.applicationDirectory);
console.log('ASD: ' + cordova.file.applicationStorageDirectory);
console.log('CD:  ' + cordova.file.cacheDirectory);
console.log('DD:  ' + cordova.file.dataDirectory);
console.log('ERD: ' + cordova.file.externalRootDirectory);
console.log('ESD: ' + cordova.file.externalApplicationStorageDirectory);
console.log('ECD: ' + cordova.file.externalCacheDirectory);
console.log('EDD: ' + cordova.file.externalDataDirectory);

  this.requestFileSystem( filename, content, observerKey);
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.requestFileSystem = function (
  filename, content, observerKey
) {

  var self = this;

  // this call is Google Chrome specific! This, however, is made
  // available using the cordova file plugin
  /*
  goog.global.requestFileSystem(

    //goog.global.resolveLocalFileSystemURL(cordova.file.dataDirectory),
    LocalFileSystem.PERSISTENT,
    0,
    function ( fs ) {
console.log('file system open: ' + fs.name);
      fs.root.getFile(
        filename,
        { create: true, exclusive: false },
        function ( fileEntry ) {
console.log("fileEntry is file?: " + fileEntry.isFile.toString());
console.log("full path: " + fileEntry.fullPath);
          self.writeFileEntry( fileEntry, content);
        },
        function ( e ) { self.onErrorCreateFile(e); }
      );
    },

    function ( e ) { self.onErrorLoadFs(e); }
  );
  */

  this.urls.tracksDirEntry.getFile(
    filename,
    { create: true, exclusive: false },
    function ( fileEntry ) {
console.log("fileEntry is file?: " + fileEntry.isFile.toString());
console.log("full path: " + fileEntry.fullPath);
      self.writeFileEntry( fileEntry, content);
    },
    function ( e ) { self.onErrorCreateFile(e); }
  );
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.writeFileEntry = function ( fileEntry, content ) {

  var self = this;

  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(
    function ( fileWriter ) {
      fileWriter.onwriteend = function ( ) {
        console.log("Successful file write...");
        //self.readFileEntry(fileEntry);
      };


      fileWriter.onerror = function ( e ) { self.onErrorWriteFile(e); }

      // If data object is not passed in,
      // create a new Blob instead.
      if( content ) {
        content = new Blob(
          [ content ],
          { type: 'text/plain' }
        );
      }

      else {
        content = new Blob(
          ['some file data'],
          { type: 'text/plain' }
        );
      }

      fileWriter.write(content);
    }
  );
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.readFileEntry = function ( fileEntry ) {

  var self = this;

  fileEntry.file(
    // onSuccess
    function ( file ) { self.readFile(file); },
    function ( e ) { self.onErrorReadFile(e); }
  );
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.readFile = function ( file ) {

  var reader = new FileReader();

  reader.onloadend = function ( ) {
    console.log("Successful file read: " + this.result);
    console.log(fileEntry.fullPath + ": " + this.result);
  };

  reader.readAsText(file);
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.onErrorGetDir = function ( e ) {

  var t = '?';
  if( e.NOT_FOUND_ERR ) { t = 'not found'; }
  if( e.PATH_EXISTS_ERR ) { t = 'directory exists'; }
  if( e.SECURITY_ERR ) { t = 'security problem'; }
  if( e.TYPE_MISMATCH_ERR ) { t = 'type mismatch'; }
  console.log("Error getting directory: " + t);
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.onErrorLoadFs = function ( e ) {
  console.log("Error load filesystem: " + e.toString());
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.onErrorCreateFile = function ( e ) {
  console.log("Error creating file: " + e.toString());
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.onErrorReadFile = function ( e ) {
  console.log("Error reading file: " + e.keys);
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.onErrorWriteFile = function ( e ) {
  console.log("Error : " + e.toString());
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.X = function ( e ) {
  console.log("Error : " + e.toString());
}
