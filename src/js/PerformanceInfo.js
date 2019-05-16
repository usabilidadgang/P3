'use strict'
const ping = require('ping');
const os = require('os');
const plat = require('platform');
const browser = require('browser-detect');
const ipInfo = require("ipinfo");


class PerformaceInfo {

    /**
     *
     * @param {Phaser.Game} game
     */
    constructor(game) {
        this.game = game;
        this.lastLoadTime = Date.now();

        this.filesLoaded = {};
        this.filesLoadedNum = 0;
        this.initialized = false;

        this.game.state.getCurrentState();

        //This number can be changed

        this.step(this);
        this.BrowserInfo();
        this.SizeInfo();
        this.LanguageInfo();
        //this.IpCountryInfo();
      


    }

    /**
     * 
     * @param {Can} context 
     */
    step(context) {
        var fps = context.GetCurrentFPS();
        context.GetMemory();

        setInterval(this.step, 1000, context);

    }

    /**
     * Initialize the performance module
     */
    Initialize() {
        if (this.initialized) {
            console.warn("Already Initialized");
            return;
        }

        this.game.load.onFileComplete.add(
            (progress, name) => {
                this.AddFileLoaded(name);
            }
        )
        this.game.load.onLoadStart.add(
            () => {
                this.LoadStart();
            }
        )
        this.game.load.onLoadComplete.add(
            () => {
                this.LoadFinished();
            }
        )
        this.game.time.advancedTiming = true;
    }

    /**
     * @returns {number} the total loaded files
     */
    GetFilesLoaded() {
        return this.filesLoadedNum;
    }

    /**
     * add a file to the dictonary and check if repeated
     * @param {string} file name of the file
     */
    AddFileLoaded(file) {

        if (this.filesLoaded[file] == undefined) {
            this.filesLoaded[file] = 1;
        } else {
            this.filesLoaded[file]++;
            console.warn("File already loaded " + file);
        }
        this.filesLoadedNum++;
    }

    LoadStart() {
        this.lastLoadTime = Date.now();
    }

    LoadFinished() {
        let time = Date.now();
        this.lastLoadTime = time - this.lastLoadTime;
    }

    GetLastLoadTime() {
        return this.lastLoadTime;
    }



    GetMaxFPS() {
        return this.game.time.fpsMax;
    }

    GetCurrentFPS() {
        return this.game.time.fps;
    }

    GetMinFPS() {
        return this.game.time.fpsMin;
    }

    GetNumEntitiesScene() {
        return this.game.stage.children.length;
    }
    //MBytes of allocated memory. 
    GetMemory(){
        var memory = window.performance.memory;
        memory.used = memory.usedJSHeapSize / 1048576;
        memory.limit = memory.jsHeapSizeLimit / 1048576;
        console.log("memory used", memory.used);
        console.log("memory limit", memory.limit);
        return memory;
         


    }

    /**
     * 
     */
    BrowserInfo() {
        if (navigator.userAgent.indexOf("Win") != -1) console.log("Windows");
        if (navigator.userAgent.indexOf("Mac") != -1) console.log("Macintosh");
        if (navigator.userAgent.indexOf("Linux") != -1) console.log("Linux");
        if (navigator.userAgent.indexOf("Android") != -1) console.log("Android");
        if (navigator.userAgent.indexOf("like Mac") != -1) console.log("iOS");

        console.log(navigator.platform);



        //Esta libreria suelta el os que le da la gana, lo demás bien
        let result = browser();
        console.log("Broswer: " + result.name + " Version: " + result.version + " is Mobile: " + result.mobile);
        return {}
    }


    SizeInfo() {
        console.log("Screen Size :" + screen.width + " x " + screen.height);
        console.log("Screen Size :" + document.documentElement.clientHeight + " x " + document.documentElement.clientWidth);

    }

    LanguageInfo() {
        console.log("Language : " + navigator.languages);
    }

    IpCountryInfo() {
        ipInfo((err, cLoc) => {
            console.log(err || cLoc);
        });
    }


}


var Instance = undefined;

function Initialize(game) {
    if (Instance) {
        console.warn("already initialized");

    } else {
        Instance = new PerformaceInfo(game);
        Instance.Initialize();
    }
}

function GetLanguageInfo(){
    return (Instance!= undefined)?Instance.filesLoadedNum():-1;

}

function GetLanguageInfo(){
    return (Instance!= undefined)?Instance.LanguageInfo():-1;

}

function GetScreenInfo(){
    return (Instance!= undefined)?Instance.SizeInfo():-1;

}

/**
 * @returns 
 */
function GetBrowserInfo(){
    return (Instance!= undefined)?Instance.BrowserInfo():-1;

}

/**
 * @returns {number} the current FPS
 */
function GetCurrentFPS(){
    return (Instance!= undefined)?Instance.GetCurrentFPS():-1;

}

/**
 * @returns {number} the maximum FPS
 */
function GetMaxFPS(){
    return (Instance!= undefined)?Instance.GetMaxFPS():-1;

}

/**
 * @returns {number} the minimum FPS, -1
 */
function GetMinFPS(){
    return (Instance!= undefined)?Instance.GetMinFPS():-1;
}




module.exports = {
    Initialize,

    /**
     * FPS information
     */
    FPS:{
        GetCurrentFPS,
        GetMaxFPS,
        GetMinFPS,
    },

    GetScreenInfo,
    GetLanguageInfo,
    GetBrowserInfo,

}
