/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

// =============================================================================
var SufiIO = {

  // adaptor/mediator
  center:                 null,

  // ---------------------------------------------------------------------------
  init: function ( controller ) {
    this.center = controller;
  },

  // ---------------------------------------------------------------------------
  writeRequest: function ( filename, content, observerKey ) {
//console.log(cordova.file);
console.log('AD:  ' + cordova.file.applicationDirectory);
console.log('ASD: ' + cordova.file.applicationStorageDirectory);
console.log('CD:  ' + cordova.file.cacheDirectory);
console.log('DD:  ' + cordova.file.dataDirectory);
console.log('DDD: ' + cordova.file.documentsDirectory);
console.log('ERD: ' + cordova.file.externalRootDirectory);
console.log('ESD: ' + cordova.file.externalApplicationStorageDirectory);
console.log('ECD: ' + cordova.file.externalCacheDirectory);
console.log('EDD: ' + cordova.file.externalDataDirectory);

    window.resolveLocalFileSystemURL(
      cordova.file.dataDirectory,
      function ( dirEntry ) {
        console.log('file system open: ' + dirEntry.name);
        //var isAppend = true;
        //createFile(dirEntry, "fileToAppend.txt", isAppend);
      },
      // onErrorLoadFs
      function ( e ) { console.log('RLFU: ' + e.toString()); }
    );

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
      // onErrorLoadFs
      function ( e ) {
        console.log("ELF: " + e.keys() + ', ' + e.toString());
      }
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

      // onErrorReadFile
      function ( e ) { console.log(e.toString); }
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
  }
}
