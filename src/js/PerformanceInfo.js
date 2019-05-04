'use strict'
const si = require('systeminformation');
const ping = require('ping');
/**
 * Get the current load of the CPU
 */
function GetCPULoad(){
    let load = null;
    si.currentLoad().then(data => load=data.currentload).catch(error => console.log(error));
    return load;
}

/**
 * Get the current load of the RAM
 */
function GetLoadRAM(){
    let load = null;
    si.mem().then(data => load=(data.used/data.total)).catch(error => console.log(error));
    return load;
}

/**
 * Get the current load of the RAM
 */
function GetRAMUsed(){
    let info = null;
    si.mem().then(data => info=data.used).catch(error => console.log(error));
    return info;
}

/**
 * Get the total RAM avialable
 */
function GetRAMTotal(){
    let info = null;
    si.mem().then(data => info=data.total).catch(error => console.log(error));
    return info;
}

/**
 * Get the info of the CPU
 */
function GetCPUInfo(){
    let info = null;
    si.cpu().then(data => info=data).catch(error => console.log(error));
    return info;
}

/**
 * Get the current ping to a server
 * @param {string} server The server that is going to be pinged
 */
function GetPingToServer(server)
{
    let info = null;
    ping.promise.probe(server).then(data => info = data);
    return info;
}


module.exports = {
    GetLoadCPU,
    GetLoadRAM,
    GetTotalRAM,
    GetCPUInfo,
    GetPingToServer,
    GetBandwith
}