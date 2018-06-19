/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

goog.provide('SufiTrail.SufiIO');

/** ============================================================================
  @constructor
*/
SufiTrail.SufiIO = function ( ) {

  // adaptor/mediator
  this.center = null;

  // Data url
  this.topFsURL = 'file:///';

  // dirEntries
  // sufiTrailDataURL
  this.rootDirectory = null;
  // sufiTrailDataURL/Tracks
  this.tracksDirEntry = null;
  // sufiTrailDataURL/Features
  this.featureDirEntry = null;
  // sufiTrailDataURL/Tiles
  this.tileDirEntry = null;
}

// ---------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.init = function ( center ) {
  this.center = center;

  var ioobj = this;

  // create directories if not exists
  window.resolveLocalFileSystemURL(
    //SufiIO.topFsURL,
    cordova.file.dataDirectory,
    function ( topDirEntry ) {
console.log('top: ' + topDirEntry.isDirectory);
console.log('top: ' + topDirEntry.name);

      topDirEntry.getDirectory(
        'SufiTrailData', { create: true },

        // Save tracks directory entry
        function ( subDirEntry ) {
console.log('STD: ' + topDirEntry.isDirectory);
console.log('STD: ' + topDirEntry.name);

          ioobj.rootDirectory = subDirEntry;
          ioobj.createSufiTrailDirectories(subDirEntry);
          ioobj.center.observers.set( 'displayProgress', 0);
        },

        function ( e ) { ioobj.onErrorGetDir(e); }
      );
    },

    function ( e ) { ioobj.onErrorLoadFs(e); }
  );
}

//----------------------------------------------------------------------------
// create sub directories in root directory
SufiTrail.SufiIO.prototype.createSufiTrailDirectories = function ( dirEntry ) {

  var ioobj = this;

  dirEntry.getDirectory(
    'SufiTrail', { create: true },

    function ( dirEntry ) {
      // create ./Tracks
      dirEntry.getDirectory(
        'Tracks', { create: true },

        // Save tracks directory entry
        function ( subDirEntry ) {
          ioobj.tracksDirEntry = subDirEntry;

console.log('Tr: ' + subDirEntry.isDirectory);
console.log('Tr: ' + subDirEntry.name);
        },
        function ( e ) { ioobj.onErrorGetDir(e); }
      );

      // create ./Features
      dirEntry.getDirectory(
        'Features', { create: true },

        // Save tracks directory entry
        function ( subDirEntry ) { ioobj.featureDirEntry = subDirEntry },
        function ( e ) { ioobj.onErrorGetDir(e); }
      );

      // create ./Tiles
      dirEntry.getDirectory(
        'Tiles', { create: true },

        // Save tracks directory entry
        function ( subDirEntry ) { ioobj.tileDirEntry = subDirEntry },
        function ( e ) { ioobj.onErrorGetDir(e); }
      );

      ioobj.center.observers.set( 'displayProgress', 0);
    },
    function ( e ) { ioobj.onErrorGetDir(e); }
  );
}

/*
GD1: function ( subDirEntry ) {
  createFile( subDirEntry, "fileInNewSubDir.txt");
},
*/

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
  window.requestFileSystem(

    //window.resolveLocalFileSystemURL(cordova.file.dataDirectory),
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
  console.log("Error reading file: " + e.toString());
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.onErrorWriteFile = function ( e ) {
  console.log("Error : " + e.toString());
}

//----------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.X = function ( e ) {
  console.log("Error : " + e.toString());
}
