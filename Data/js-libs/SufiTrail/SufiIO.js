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
    //fileDirectory: null,
    // Tracks dir at <topFsUrl>/files/Tracks
    //tracksDirEntry: null,

    // Cache root at <topFsUrl>/cache
    //cacheDirectory: null,
    // Features dir at <topFsUrl>/cache/Features
    //featureDirEntry: null,
    // Tiles dir at <topFsUrl>/cache/Tiles
    //tileDirEntry: null
  }
}

/** ----------------------------------------------------------------------------
  Initialize the i/o object
  @public
  @param {SufiTrail.SufiCenter} center Sufi trail core object
*/
SufiTrail.SufiIO.prototype.init = function ( center ) {

/*
//console.log(cordova.file);
console.log('AD:  ' + cordova.file.applicationDirectory);
console.log('ASD: ' + cordova.file.applicationStorageDirectory);
console.log('CD:  ' + cordova.file.cacheDirectory);
console.log('DD:  ' + cordova.file.dataDirectory);
console.log('ERD: ' + cordova.file.externalRootDirectory);
console.log('ESD: ' + cordova.file.externalApplicationStorageDirectory);
console.log('ECD: ' + cordova.file.externalCacheDirectory);
console.log('EDD: ' + cordova.file.externalDataDirectory);
*/

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
/*
      self.getDirectoryPath(
        topDirEntry, 'files/Tracks', 'tracksDirEntry'
      )
      self.getDirectoryPath(
        topDirEntry, 'cache/Tiles', 'tileDirEntry'
      )
      self.getDirectoryPath(
        topDirEntry, 'cache/Features', 'featureDirEntry'
      )
*/
    },

    function ( e ) { self.onErrorLoadFs(e); }
  );
}

/** ----------------------------------------------------------------------------
  Get or create a directory. Compare linux 'mkdir directory'.
  @public
  @param {DirectoryEntry} dirEntry directory object
  @param {string} dirName Directory name
  @param {string || function} entryStore Location in this object to store dirEntry
  @param {null || string || function} handler a handler in this object
*/
SufiTrail.SufiIO.prototype.getDirectory = function (
  //dirEntry, dirname, entryStore, handler, object
  dirEntry, dirname, handler, object
) {

  var self = this;
console.log('GD Attr: ' + dirEntry.fullPath + ', ' + dirname);
console.log('GD Object: ' + object);

  dirEntry.getDirectory(
    dirname, { create: true },
    function ( subDirEntry ) {
/*
      if( goog.isString(entryStore) ) {
        self.urls[entryStore] = subDirEntry;
console.log('Create dir path: ' + self.urls[entryStore].fullPath);
      } else if( goog.isFunction(entryStore) ) {
        entryStore(subDirEntry);
      }
*/
      if( goog.isString(handler) ) {
        self[handler](subDirEntry);
      } else if( goog.isFunction(handler) ) {
        if ( goog.isNull(object) ) {
          handler(subDirEntry);
        }

        else {
          handler( subDirEntry, object);
        }
      }
    },
    function ( e ) { self.onErrorGetDir(e); }
  );
}

/** ----------------------------------------------------------------------------
  Get or create path to a directory. Compare linux 'mkdir -p path'.
  @public
  @param {DirectoryEntry} dirEntry directory object
  @param {string} dirPath path of directories
  //@ param {string || function} finalEntryStore Location in this object to store dirEntry
  @param {null || string || function} handler a handler in this object
*/
SufiTrail.SufiIO.prototype.getDirectoryPath = function (
  dirEntry, dirpath, handler, object
  //dirEntry, dirpath, finalEntryStore, handler
) {

  var self = this;
  var parts = null;

  // assume relative path, then test for starting '/' character to see
  // if its absolute after all.
  var rootpath = false;

  if ( goog.isString(dirpath) ) {
    var rgx = new RegExp(/^ \//);
    if ( rgx.exec(dirpath) ) {
      rootpath = true;
    }

    // replace first '/' if any
    dirpath = dirpath.replace( rgx, '');

    // split on any other '/' in the path and get first part
    parts = dirpath.split('/');
  }

  // parts of dir path already delivered
  else if ( goog.isArray(dirpath) ) {
    parts = dirpath;
  }

console.log("Parts: " + parts.join(','));
  var firstPart = parts.shift();

  // create directory from firstPart on dirEntry
  self.getDirectory(
    dirEntry, firstPart,
    //dirEntry, firstPart, null,
    function ( subDirEntry ) {
      if ( parts.length > 0 ) {
        // when there are parts left, recursive call with a part less
        self.getDirectoryPath(
          subDirEntry, parts, handler, object
          //subDirEntry, parts, finalEntryStore, handler
        );
      }

      else {
/*
        if( goog.isString(finalEntryStore) ) {
          self.urls[finalEntryStore] = subDirEntry;
console.log('Create dir path: ' + self.urls[finalEntryStore].fullPath);
        } else if( goog.isFunction(finalEntryStore) ) {
          finalEntryStore(subDirEntry);
        }
*/
        if( goog.isString(handler) ) {
          self[handler](subDirEntry);
        } else if( goog.isFunction(handler) ) {
          if ( goog.isNull(object) ) {
            handler(subDirEntry);
          }

          else {
            handler( subDirEntry, object);
          }
        }
      }
    },
    object
  );
}

// ---------------------------------------------------------------------------
SufiTrail.SufiIO.prototype.writeRequest = function (
  path, filename, content
) {

  var self = this;

  self.getDirectoryPath(
    topDirEntry, path,
    function ( tracksDirEntry ) {
      tracksDirEntry.getFile(
        filename,
        { create: true, exclusive: false },
        function ( fileEntry ) {
console.log("full path: " + fileEntry.fullPath);
          self.writeFileEntry( fileEntry, content);
        },
        function ( e ) { self.onErrorCreateFile(e); }
      );
    }
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
