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
  // file:///storage/emulated/<app id>/Android/data/sufitrail.io.github.martimm/
  this.topFsUrl = null;

  // Data root at <topFsUrl>/files
  this.fileDirectory = null;
  // Tracks dir at <topFsUrl>/files/Tracks
  this.tracksDirEntry = null;

  // Cache root at <topFsUrl>/cache
  this.cacheDirectory = null;
  // Features dir at <topFsUrl>/cache/Features
  this.featureDirEntry = null;
  // Tiles dir at <topFsUrl>/cache/Tiles
  this.tileDirEntry = null;
}

/** ----------------------------------------------------------------------------
  Initialize the i/o object
  @public
  @param {SufiTrail.SufiCenter} center Sufi trail core object
*/
SufiTrail.SufiIO.prototype.init = function ( center ) {
  this.center = center;

  var ioobj = this;

  // cordova file paths are only available after device ready!
  this.topFsURL = cordova.file.externalApplicationStorageDirectory;

  // create directories if not exists
  goog.global.resolveLocalFileSystemURL(
    this.topFsURL,
    function ( topDirEntry ) {
console.log('top: ' + topDirEntry.isDirectory);
console.log('top: ' + topDirEntry.name);
      ioobj.getDirectory(
        topDirEntry, 'files', 'fileDirectory', 'createFileDirectories'
      );
      ioobj.getDirectory(
        topDirEntry, 'cache', 'cacheDirectory', 'createCacheDirectories'
      );
    },

    function ( e ) { ioobj.onErrorLoadFs(e); }
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
  @private
  @param {DirectoryEntry} dirEntry directory object
  @param {string} dirName Directory name
  @param {string} entryStore Location in this object to store dirEntry
  @param {null || string || function} continueHandlerName a handler in this object
*/
SufiTrail.SufiIO.prototype.getDirectory = function (
  dirEntry, dirname, entryStore, continueHandlerName
) {

  var ioobj = this;

  dirEntry.getDirectory(
    dirname, { create: true },
    function ( subDirEntry ) {
      ioobj[entryStore] = subDirEntry;

console.log('Create dir path: ' + subDirEntry.fullPath);
      if( typeof continueHandlerName === "string" ) {
        ioobj[continueHandlerName](subDirEntry);
      } else if( typeof continueHandlerName === "function" ) {
        ioobj.continueHandlerName(subDirEntry);
      }
    },
    function ( e ) { ioobj.onErrorGetDir(e); }
  );
}

//----------------------------------------------------------------------------
// Creates a new file or returns the file if it already exists.
SufiTrail.SufiIO.prototype.createFile = function (
  dirEntry, fileName, isAppend
) {

  var ioobj = this;

  dirEntry.getFile(
    fileName, {create: true, exclusive: false},
    function ( ) { ioobj.wf(); },
    function ( e ) { ioobj.onErrorCreateFile(e); }
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

  var ioobj = this;

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
          ioobj.writeFileEntry( fileEntry, content);
        },
        function ( e ) { ioobj.onErrorCreateFile(e); }
      );
    },

    function ( e ) { ioobj.onErrorLoadFs(e); }
  );
  */

  this.tracksDirEntry.getFile(
    filename,
    { create: true, exclusive: false },
    function ( fileEntry ) {
console.log("fileEntry is file?: " + fileEntry.isFile.toString());
console.log("full path: " + fileEntry.fullPath);
      ioobj.writeFileEntry( fileEntry, content);
    },
    function ( e ) { ioobj.onErrorCreateFile(e); }
  );
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.writeFileEntry = function ( fileEntry, content ) {

  var ioobj = this;

  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(
    function ( fileWriter ) {
      fileWriter.onwriteend = function ( ) {
        console.log("Successful file write...");
        //ioobj.readFileEntry(fileEntry);
      };


      fileWriter.onerror = function ( e ) { ioobj.onErrorWriteFile(e); }

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

  var ioobj = this;

  fileEntry.file(
    // onSuccess
    function ( file ) { ioobj.readFile(file); },
    function ( e ) { ioobj.onErrorReadFile(e); }
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
