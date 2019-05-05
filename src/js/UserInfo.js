'use strict'
const where = require('node-where');
const os = require('os');
const ip = require('public-ip')
/**
 * Get the navigator of the user
 */
function GetNavigator(){
    return navigator.appName;
}

/**
 * Get the location based on IP
 */
function GetLocation()
{
    
    return 0;
}

/**
 * Get the OS of the user 
 */
function GetOS(){
    return 0;
}

module.exports = {
    GetNavigator,
    GetLocation,
    GetOS,
}