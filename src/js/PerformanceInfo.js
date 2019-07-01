'use strict'
const browser = require('browser-detect');
const NetworkSpeed = require('network-speed');
const testNetworkSpeed = new NetworkSpeed();

/**
 * Enumerado para los eventos de rendimiento
 */
const PerformanceEvents = {
    /**
     * FPS actuales
     */
    CURRENT_FPS: 1000,
    /**
     * FPS máximos
     */
    MAX_FPS: 1001,
    /**
     * FPS minimos
     */
    MIN_FPS: 1002,
    /**
     * Tiempo de carga
     */
    LOAD_TIME: 1003,
    /**
     * Números de ficheros cargados
     */
    LOADED_FILES: 1004,
    /**
     * Memoria ocupada por el heap
     */
    JS_HEAP_MEMORY: 1005,
    /**
     * Informacion del navegador
     */
    BROWSER_INFO: 1006,
    /**
     * Informacion del lenguaje
     */
    LANGUAGE_INFO: 1007,
    /**
     * Información de la pantalla
     */
    SCREEN_INFO: 1008,
}

/**
 * Clase para obtener la información de la sesión
 */
class PerformanceInfo {
    /**
     * Constructora
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
    /**
     * Obtiene la velocidad de descarga de la sesión
     */
    async getNetworkDownloadSpeed() {
        const baseUrl = 'http://eu.httpbin.org/stream-bytes/50000000';
        const fileSize = 500000;
        const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSize);
        return speed;
    }

    /**
     * Inicializa el modulo el Performance
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

        this.game.time.advancedTiming = true;
        this.initialized = true;
        this.TimerFPS = setTimeout(this.TimerFPSFunction, 5000);
    }
    
    SendPerformanceInfo() {
        this.GetCurrentFPS();
        this.GetMinFPS();
        this.GetMaxFPS();
        this.GetJSHeapInfo();
    }

    TimerFPSFunction(){
        this.SendPerformanceInfo();
        this.TimerFPS = setTimeout(this.TimerFPSFunction, 5000);
    }


    


    /**
     * Obtiene el numero de ficheros cargados
     * @returns {Number} El número de ficheros
     */
    GetFilesLoaded() {
        return this.filesLoadedNum;
    }

    /**
     * Añade al diccionario de ficheros cargados un fichero
     * @param {string} file el fichero cargado
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

    /**
     * Indica el inicio de la carga del fichero
     */
    LoadStart() {
        this.lastLoadTime = Date.now();
    }

    /**
     * Indica el fin de la carga y envia los eventos relacionados con la carga
     */
    LoadFinished() {
        let time = Date.now();
        this.lastLoadTime = time - this.lastLoadTime;


        if (this.tracker) {
            this.tracker.AddEvent(PerformanceEvents.LOAD_TIME, { loadtime: this.lastLoadTime })
            this.tracker.AddEvent(PerformanceEvents.LOADED_FILES, { filesLoaded: this.filesLoadedNum, duplicated: this.hasDuplicatedFiles })
        }
    }

    /**
     * Obtiene el ultimo tiempo de carga
     * @returns {Number} ultimo tiempo de carga en ms
     */
    GetLastLoadTime() {
        return this.lastLoadTime;
    }

    /**
     * Obtiene el tamaño de la memoría heap ocupada de JS
     * @returns {Number} Memoria ocupada en MB
     */
    GetJSHeapInfo() {
        var memory = window.performance.memory;
        if(memory != null){
            memory.used = memory.usedJSHeapSize / 1048576;
            memory.limit = memory.jsHeapSizeLimit / 1048576;
        }
        else {
            memory = "UNKNOWN"
        }
        if (this.tracker) 
            this.tracker.AddEvent(PerformanceEvents.JS_HEAP_MEMORY, memory)
        return memory;
    }


    /**
     * Obtiene el número máximo de FPS de la sesión
     * @returns {Number} El Múmero maximo de FPS
     */
    GetMaxFPS() {
        if (this.tracker) this.tracker.AddEvent(PerformanceEvents.MAX_FPS, { fps: this.game.time.fpsMax })
        return this.game.time.fpsMax;
    }

    /**
     * Obtiene el número actual de FPS de la sesión
     * @returns {Number} El Múmero actual de FPS
     */
    GetCurrentFPS() {
        if (this.tracker) this.tracker.AddEvent(PerformanceEvents.CURRENT_FPS, { fps: this.game.time.fps })
        return this.game.time.fps;
    }

    /**
     * Obtiene el número mínimo de FPS de la sesión
     * @returns {Number} El Múmero mínimo de FPS
     */
    GetMinFPS() {
        if (this.tracker) this.tracker.AddEvent(PerformanceEvents.MIN_FPS, { fps: this.game.time.fpsMin })
        return this.game.time.fpsMin;
    }

    /**
     * Obtiene el número de entidades de la escena
     * @returns {Number} Número de entidades
     */
    GetNumEntitiesScene() {
        return this.game.stage.children.length;

    }

    //MBytes of allocated memory. 
    GetMemory() {
        var memory = window.performance.memory;
        memory.used = memory.usedJSHeapSize / 1048576;
        memory.limit = memory.jsHeapSizeLimit / 1048576;
        this.tracker.AddEvent(JS_HEAP_MEMORY, { used_memory: memory });
        return this.memory;
    }


    async getNetworkDownloadSpeed() {
        const baseUrl = 'http://eu.httpbin.org/stream-bytes/50000000';
        const fileSize = 500000;
        const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSize);
        return speed;
    }

    /**
     * Obtiene la información del navegador
     * @returns {Object} La información del navegador
     */
    BrowserInfo() {
        var _browserinfo = { os: "undefined" };
        if (navigator.userAgent.indexOf("Win") != -1) _browserinfo.os = "Windows";
        if (navigator.userAgent.indexOf("Mac") != -1) _browserinfo.os = "Macintosh";
        if (navigator.userAgent.indexOf("Linux") != -1) _browserinfo.os = "Linux";
        if (navigator.userAgent.indexOf("Android") != -1) _browserinfo.os = "Android";
        if (navigator.userAgent.indexOf("like Mac") != -1) _browserinfo.os = "iOS";


        let result = browser();
        _browserinfo.browser = result.name;
        _browserinfo.version = result.version;
        _browserinfo.mobile = result.mobile;

        if (this.tracker) this.tracker.AddEvent(PerformanceEvents.BROWSER_INFO, _browserinfo);


        return _browserinfo;
    }

    /**
     * Obtiene información sobre el tamaño de la pantalla y de la vista del juego
     */
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
}


var Instance = undefined;

/**
 * Incializa el tracker
 * @param {Phaser.Game} game 
 * @param {Tracker} tracker 
 */
function Initialize(game, tracker) {
    if (Instance) {
        console.warn("already initialized");

    } else {
        Instance = new PerformanceInfo(game, tracker);
        Instance.Initialize();
    }
}

/**
 * Devuelve el último tiempo de carga
 */
function GetLastLoadTime() {
    return (Instance != undefined) ? Instance.GetLastLoadTime() : -1;
}

/**
 * Devuelve información sobre el lenguaje de la sesión
 */
function GetLanguageInfo() {
    return (Instance != undefined) ? Instance.LanguageInfo() : -1;

}

/**
 * Devuelve información de la pantalla
 */
function GetScreenInfo() {
    return (Instance != undefined) ? Instance.SizeInfo() : -1;

}

/**
 * Devuelve la informacion del navegador
 * @returns {Object} informacion del navegador
 */
function GetBrowserInfo() {
    return (Instance != undefined) ? Instance.BrowserInfo() : -1;

}

/**
 * Devuelve los FPS actuales
 * @returns {Number} FPS actuales
 */
function GetCurrentFPS() {
    return (Instance != undefined) ? Instance.GetCurrentFPS() : -1;

}

/**
 * Devuelve el máximo de FPS alcanzados en la sesión
 * @returns {Number} FPS maximos
 */
function GetMaxFPS() {
    return (Instance != undefined) ? Instance.GetMaxFPS() : -1;

}

/**
 * Devuelve el mínimo de FPS alcanzados en la sesión
 * @returns {Number} FPS minimos
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
