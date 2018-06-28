
goog.require('goog.fs');
goog.require('goog.fs.FileSystemImpl');
goog.require('goog.fs.DirectoryEntryImpl');

console.log('goog: ' + goog);
var fs = goog.fs.FileSystemImpl.getBrowserFileSystem();
console.log('fs: ' + fs);
