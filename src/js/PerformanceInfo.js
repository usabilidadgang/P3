'use strict'
const si = require('systeminformation');

/**
 * Get the current load of the CPU
 */
function GetLoadCPU(){
    return 0;
}

/**
 * Get the current load of the RAM
 */
function GetLoadRAM(){
    return 0;
}

/**
 * Get the total RAM avialable
 */
function GetTotalRAM(){
    return 0;
}

/**
 * Get the info of the CPU
 */
function GetCPUInfo(){
    return 0;
}

/**
 * Get the current ping to a server
 * @param {string} server The server that is going to be pinged
 */
function GetPingToServer(server)
{
    return 0;
}

/**
 * Get the current bandwith
 */
function GetBandwith(){
    
    return 0;
}

module.exports = {
    GetLoadCPU,
    GetLoadRAM,
    GetTotalRAM,
    GetCPUInfo,
    GetPingToServer,
    GetBandwith
}