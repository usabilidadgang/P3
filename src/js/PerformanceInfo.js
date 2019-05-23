'use strict'
const browser = require('browser-detect');
const ipInfo = require("ipinfo");
const NetworkSpeed = require('network-speed');
const testNetworkSpeed = new NetworkSpeed();


const PerformanceEvents = {
    CURRENT_FPS: 1000,
    MAX_FPS: 1001,
    MIN_FPS: 1002,
    LOAD_TIME: 1003,
    LOADED_FILES: 1004,
    JS_HEAP_MEMORY: 1005,
    BROWSER_INFO: 1006,
    LANGUAGE_INFO: 1007,
    SCREEN_INFO: 1008,

}

class PerformanceInfo {
    /**
     *
     * @param {Phaser.Game} game
     * @param {Tracker} tracker
     */
    constructor(game, tracker) {

        this.game = game;
        this.tracker = tracker;
        this.lastLoadTime = Date.now();

        this.filesLoaded = {};
        this.filesLoadedNum = 0;
        this.initialized = false;
        this.hasDuplicatedFiles = false;
    }

    async getNetworkDownloadSpeed() {
        const baseUrl = 'http://eu.httpbin.org/stream-bytes/50000000';
        const fileSize = 500000;
        const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSize);
        return speed;
    }

    async step() {
        console.log("su");


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
        

        this.BrowserInfo();
        this.SizeInfo();
        this.LanguageInfo();
        this.IpCountryInfo();

        this.game.time.advancedTiming = true;
        this.initialized = true;
        this.step();
    }
    /**
     * 
     */
    SendPerformanceInfo() {
        this.GetCurrentFPS();
        //GetJSHeapInfo();       
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
            this.hasDuplicatedFiles = true;

        }
        this.filesLoadedNum++;
    }

    LoadStart() {
        this.lastLoadTime = Date.now();
    }

    LoadFinished() {
        let time = Date.now();
        this.lastLoadTime = time - this.lastLoadTime;


        if (this.tracker) {
            this.tracker.AddEvent(PerformanceEvents.LOAD_TIME, { loadtime: this.lastLoadTime })
            this.tracker.AddEvent(PerformanceEvents.LOADED_FILES, { filesLoaded: this.filesLoadedNum, duplicated: this.hasDuplicatedFiles })
        }
    }

    GetLastLoadTime() {
        return this.lastLoadTime;
    }

    /**
     * Only in Chrome
     */
    GetJSHeapInfo() {
        let memory = window.performance.memory;
        memory.used = memory.usedJSHeapSize / 1048576;
        memory.limit = memory.jsHeapSizeLimit / 1048576;
        if (this.tracker) this.tracker.AddEvent(PerformanceEvents.JS_HEAP_MEMORY, memory)
        return memory;
    }



    GetMaxFPS() {
        if(this.tracker)this.tracker.AddEvent(PerformanceEvents.MAX_FPS, {fps: this.game.time.fpsMax})
        return this.game.time.fpsMax;
    }

    GetCurrentFPS() {
        if(this.tracker)this.tracker.AddEvent(PerformanceEvents.CURRENT_FPS, {fps: this.game.time.fps})
        return this.game.time.fps;
    }

    GetMinFPS() {
        if(this.tracker)this.tracker.AddEvent(PerformanceEvents.MIN_FPS, {fps: this.game.time.fpsMin})
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

        this.tracker.AddEvent(JS_HEAP_MEMORY, {used_memory: memory});
        return this.memory;
    }

    //Download Speed 
    async getNetworkDownloadSpeed() {
        const baseUrl = 'http://eu.httpbin.org/stream-bytes/50000000';
        const fileSize = 500000;
        const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSize);
       return speed ;
      }
    /**
     * 
     */
    BrowserInfo() {
        var _browserinfo = { os: "undefined" };
        if (navigator.userAgent.indexOf("Win") != -1) _browserinfo.os = "Windows";
        if (navigator.userAgent.indexOf("Mac") != -1) _browserinfo.os = "Macintosh";
        if (navigator.userAgent.indexOf("Linux") != -1) _browserinfo.os = "Linux";
        if (navigator.userAgent.indexOf("Android") != -1) _browserinfo.os = "Android";
        if (navigator.userAgent.indexOf("like Mac") != -1) _browserinfo.os = "iOS";





        //Esta libreria suelta el os que le da la gana, lo demás bien
        let result = browser();
        _browserinfo.browser = result.name;
        _browserinfo.version = result.version;
        _browserinfo.mobile = result.mobile;

        if (this.tracker) this.tracker.AddEvent(PerformanceEvents.BROWSER_INFO, _browserinfo);


        return _browserinfo;
    }


    SizeInfo() {



        if (this.tracker) this.tracker.AddEvent(PerformanceEvents.SCREEN_INFO, 
            {
                screen: screen.width + "x" + screen.height,
            view: document.documentElement.clientWidth + "x" + document.documentElement.clientHeight
        })
        return {
            screen: { width: screen.width, height: screen.height },
            view: { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }
        };

    }

    LanguageInfo() {
        if (this.tracker) this.tracker.AddEvent(PerformanceEvents.LANGUAGE_INFO, { lan: navigator.languages })

        return { lan: navigator.languages };

    }

    IpCountryInfo() {
        ipInfo((err, cLoc) => {
            if (err)
                console.log("cant get the loc");
            else
                console.log(cLoc);
        });
    }


}


var Instance = undefined;

function Initialize(game, tracker) {
    if (Instance) {
        console.warn("already initialized");

    } else {
        Instance = new PerformanceInfo(game, tracker);
        Instance.Initialize();
    }
}

function GetLastLoadTime() {
    return (Instance != undefined) ? Instance.GetLastLoadTime() : -1;
}

function GetLanguageInfo() {
    return (Instance != undefined) ? Instance.LanguageInfo() : -1;

}

function GetScreenInfo() {
    return (Instance != undefined) ? Instance.SizeInfo() : -1;

}

/**
 * @returns {String} Browser Info
 */
function GetBrowserInfo() {
    return (Instance != undefined) ? Instance.BrowserInfo() : -1;

}

/**
 * @returns {number} the current FPS
 */
function GetCurrentFPS() {
    return (Instance!= undefined)?Instance.GetCurrentFPS():-1;

}

/**
 * @returns {number} the maximum FPS
 */
function GetMaxFPS() {
    return (Instance != undefined) ? Instance.GetMaxFPS() : -1;

}

/**
 * @returns {number} the minimum FPS,
 */
function GetMinFPS() {
    return (Instance != undefined) ? Instance.GetMinFPS() : -1;
}

/**
 * Sends Events about performance information
 */
function SendPerformanceInfo() {
    return (Instance != undefined) ? Instance.SendPerformanceInfo() : -1;
}




module.exports = {
    Initialize,
    FPS: {
        GetCurrentFPS,
        GetMaxFPS,
        GetMinFPS,
    },

    GetScreenInfo,
    GetLanguageInfo,
    GetBrowserInfo,
    GetLastLoadTime,
    SendPerformanceInfo,

}
