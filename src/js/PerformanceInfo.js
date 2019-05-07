'use strict'
const ping = require('ping');
const os = require('os');
const si = require('systeminformation');



/**
 * Get the current load of the CPU
 */
function GetCPULoad(){
    return new Promise(
        (resolve,reject)=>{
            si.currentLoad().then(data=>{
                if(data.currentload == NaN){
                    reject("No CPU load avialable");
                }else{
                    resolve(data.currentload);
                }
            })
        }
    );
}

/**
 * Get the current load of the RAM
 */
function GetLoadRAM(){
    return new Promise(
        (resolve,reject)=>{
            si.mem().then(data => {
                if(data.used == NaN){
                    reject("No RAM load avilable");
                }else{
                    resolve(data.used/data.total);
                }
            }).catch(error => reject(error));
        }
    )
}

/**
 * Get the current load of the RAM
 */
function GetRAMUsed(){
    return new Promise(
        (resolve, reject)=>{
            
        }
    );
}

/**
 * Get the total RAM avialable
 */
function GetRAMTotal(){
    let info = null;
    //si.mem().then(data => info=data.total).catch(error => console.log(error));
    return info;
}

/**
 * Get the info of the CPU
 */
function GetCPUInfo(){
    let info = null;
    //si.cpu().then(data => info=data).catch(error => console.log(error));
    return info;
}

/**
 * Get the current ping to a server
 * @param {string} server The server that is going to be pinged
 * 
 */
function GetPingToServer(server)
{
    return new Promise(
        (resolve,reject)=>{
            ping.promise.probe(server).then(data => resolve(data)).catch(error => reject(error));
        }
    )
}



module.exports = {
    GetCPULoad,
    GetLoadRAM,
    GetRAMTotal,
    GetCPUInfo,
    GetPingToServer,
}