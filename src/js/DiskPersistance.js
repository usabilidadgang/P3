'use strict'
const fileSystem = require('fs');

/**
 * Local persistance class
 */
class DiskPersistance {

    /**
     * Main constructor of the class
     * @param {string} fileName name of the file
     */
    constructor (fileName)
    {
        this.fileName = fileName;
    }
    
    /**
     * Save the data in the file
     * @param {string} dataString the data is going to be saved
     */
    send(dataString)
    {
        fileSystem.appendFile(this.fileName, dataString + "\n", { flag: 'a' }, function (err) {
            if (err) throw err;
            console.log("It's saved!");
        });
    }
}

module.exports = DiskPersistance;