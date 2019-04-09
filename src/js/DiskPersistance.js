'use strict'
const fileSystem = require('fs');

class DiskPersistance {

    constructor (address)
    {
        this.address = address;
    }
    
    send(dataString)
    {
        fileSystem.appendFile(this.address, dataString + "\n", { flag: 'a' }, function (err) {
            if (err) throw err;
            console.log("It's saved!");
        });
    }
}

module.exports = DiskPersistance;