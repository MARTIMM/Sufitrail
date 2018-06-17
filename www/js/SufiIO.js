/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

// =============================================================================
var SufiIO = {

  // adaptor/mediator
  center:                 null,

  // Data url
  topFsURL:               'file:///',

  // dirEntries
  rootDirectory:          null, // sufiTrailDataURL
  tracksDirEntry:         null, // sufiTrailDataURL/Tracks
  featureDirEntry:        null, // sufiTrailDataURL/Features
  tileDirEntry:           null, // sufiTrailDataURL/Tiles

  // ---------------------------------------------------------------------------
  init: function ( controller ) {
    this.center = controller;

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

            SufiIO.rootDirectory = subDirEntry;
            SufiIO.createSufiTrailDirectories(subDirEntry);
            SufiIO.center.observers.set( 'displayProgress', 0);
          },

          SufiIO.onErrorGetDir
        );
      },

      SufiIO.onErrorLoadFs
    );
  },

  //----------------------------------------------------------------------------
  // create sub directories in root directory
  createSufiTrailDirectories: function ( dirEntry ) {
    dirEntry.getDirectory(
      'SufiTrail', { create: true },

      function ( dirEntry ) {
        // create ./Tracks
        dirEntry.getDirectory(
          'Tracks', { create: true },

          // Save tracks directory entry
          function ( subDirEntry ) {
            SufiIO.tracksDirEntry = subDirEntry

console.log('Tr: ' + subDirEntry.isDirectory);
console.log('Tr: ' + subDirEntry.name);
          },
          SufiIO.onErrorGetDir
        );

        // create ./Features
        dirEntry.getDirectory(
          'Features', { create: true },

          // Save tracks directory entry
          function ( subDirEntry ) { SufiIO.featureDirEntry = subDirEntry },
          SufiIO.onErrorGetDir
        );

        // create ./Tiles
        dirEntry.getDirectory(
          'Tiles', { create: true },

          // Save tracks directory entry
          function ( subDirEntry ) { SufiIO.tileDirEntry = subDirEntry },
          SufiIO.onErrorGetDir
        );

        SufiIO.center.observers.set( 'displayProgress', 0);
      },
      SufiIO.onErrorGetDir
    );
  },

  /*
  GD1: function ( subDirEntry ) {
    createFile( subDirEntry, "fileInNewSubDir.txt");
  },
  */

  //----------------------------------------------------------------------------
  // Creates a new file or returns the file if it already exists.
  createFile: function ( dirEntry, fileName, isAppend ) {
    dirEntry.getFile(
      fileName, {create: true, exclusive: false},
      SufiIO.GF1, SufiIO.onErrorCreateFile
    );
  },

  GF1: function ( fileEntry ) {
    writeFile( fileEntry, null, isAppend);
  },

  // ---------------------------------------------------------------------------
  writeRequest: function ( filename, content, observerKey ) {
//console.log(cordova.file);
console.log('AD:  ' + cordova.file.applicationDirectory);
console.log('ASD: ' + cordova.file.applicationStorageDirectory);
console.log('CD:  ' + cordova.file.cacheDirectory);
console.log('DD:  ' + cordova.file.dataDirectory);
console.log('ERD: ' + cordova.file.externalRootDirectory);
console.log('ESD: ' + cordova.file.externalApplicationStorageDirectory);
console.log('ECD: ' + cordova.file.externalCacheDirectory);
console.log('EDD: ' + cordova.file.externalDataDirectory);

    SufiIO.requestFileSystem( filename, content, observerKey);
  },

  //----------------------------------------------------------------------------
  requestFileSystem: function ( filename, content, observerKey ) {
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
            SufiIO.writeFileEntry( fileEntry, content);
          },
          // onErrorCreateFile
          function ( e ) {
            console.log("ECF: " + e.keys() + ', ' + e.toString());
          }
        );
      },

      SufiIO.onErrorLoadFs
    );
  },

  //----------------------------------------------------------------------------
  writeFileEntry: function ( fileEntry, content ) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(
      function ( fileWriter ) {
        fileWriter.onwriteend = function ( ) {
          console.log("Successful file write...");
          //SufiIO.readFileEntry(fileEntry);
        };

        fileWriter.onerror = function ( e ) {
          console.log("Failed file write: " + e.toString());
        };

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
  },

  //----------------------------------------------------------------------------
  readFileEntry: function ( fileEntry ) {

    fileEntry.file(
      // onSuccess
      function ( file ) { SufiIO.readFile(file); },

      SufiIO.onErrorReadFile
    );
  },

  //----------------------------------------------------------------------------
  readFile: function ( file ) {

    var reader = new FileReader();

    reader.onloadend = function ( ) {
      console.log("Successful file read: " + this.result);
      console.log(fileEntry.fullPath + ": " + this.result);
    };

    reader.readAsText(file);
  },

  //----------------------------------------------------------------------------
  onErrorGetDir: function ( e ) {

    var t = '?';
    if( e.NOT_FOUND_ERR ) { t = 'not found'; }
    if( e.PATH_EXISTS_ERR ) { t = 'directory exists'; }
    if( e.SECURITY_ERR ) { t = 'security problem'; }
    if( e.TYPE_MISMATCH_ERR ) { t = 'type mismatch'; }
    console.log("Error getting directory: " + t);
  },

  //----------------------------------------------------------------------------
  onErrorLoadFs: function ( e ) {
    console.log("Error load filesystem: " + e.toString());
  },

  //----------------------------------------------------------------------------
  onErrorCreateFile: function ( e ) {
    console.log("Error creating file: " + e.toString());
  },

  //----------------------------------------------------------------------------
  onErrorReadFile: function ( e ) {
    console.log("Error reading file: " + e.toString());
  },

  //----------------------------------------------------------------------------
  X: function ( e ) {
    console.log("Error : " + e.toString());
  },
}
