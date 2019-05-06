'use strict'
const where = require('node-where');
const os = require('os');
const ip = require('public-ip');
/**
 * Get the navigator of the user
 */
function GetNavigator() {

    return new Promise(
        (resolve,reject)=>{
            resolve(navigator.appName);
        }
    );
}
/*
return new Promise(
        (resolve,reject)=>{
            
        }
    );
*/

/**
 * Get latitude and longitude
 * @returns {Promise<{lat,long}} latitude and longitude
 */
function GetLocation() {
    return new Promise(
        (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (info) => {
                    info.coords.al
                    resolve({ longitude: info.coords.longitude, altitude: info.coords.altitude });
                },
                (error) => {
                    reject(error);
                }
            )
        }
    )
}


/**
 * Get the OS of the user 
 */
function GetOS() {
    return new Promise(
        (resolve,reject)=>{
            resolve(navigator.platform)
        }
    );
}

module.exports = {
    GetNavigator,
    GetLocation,
    GetOS,
}