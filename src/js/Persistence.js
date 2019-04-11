'use strict';
class FilePersistence{
    constructor(address){
        this.address = address;
    }
    Send(datos){

    }

}

 class ServerPersistence{

  
      
}
var filesystem = null;
console.log("hola");
window.requestFileSystem = window.requestFileSystem || 
                           window.webkitRequestFileSystem;


function start() {
  if (window.requestFileSystem) {
    console.log("Supports FileSystem");
  } else {
    console.log("Doesn´t support FileSystem");
  }
}
function errorHandler(){
  console.log("ERROR");
}


start();

// Request a FileSystem and set the filesystem variable.
function initFileSystem() {
  console.log("Init file system");
  navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5,
    function(grantedSize) {

      // Request a file system with the new size.
      window.requestFileSystem(window.PERSISTENT, grantedSize, function(fs) {

        // Set the filesystem variable.
        filesystem = fs;

        // Setup event listeners on the form.
        //setupFormEventListener();

        // Update the file browser.
        //listFiles();
        return fs;

      }, errorHandler);

    }, errorHandler);
}

filesystem = initFileSystem();

filesystem.root.getFile('treehouse.txt', {create: true}, function(fileEntry) {
  // Do something with fileEntry.
}, errorHandler);


module.exports = {FilePersistence,ServerPersistence};
