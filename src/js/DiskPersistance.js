'use strict'
const fileSystem = require('fs');
//Debido a las diferentes APIs de los navegadores para guardar archivos además de que no aporta una gran uilidad respecto a enviarlos al servidor
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