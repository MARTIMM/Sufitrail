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
  writeRequest: function ( filename, content) {
//console.log(cordova.file);
//console.log(cordova.file.dataDirectory);

    // this call is Google Chrome specific! This, however, is made
    // available using the cordova file plugin
    window.requestFileSystem(
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
  writeFileEntry: function ( fileEntry, dataText ) {

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
        if( dataText ) {
          dataText = new Blob(
            [ dataText ],
            { type: 'text/plain' }
          );
        }

        else {
          dataText = new Blob(
            ['some file data'],
            { type: 'text/plain' }
          );
        }

        fileWriter.write(dataText);
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
