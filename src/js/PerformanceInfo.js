'use strict'
const ping = require('ping');
const os = require('os');
const plat= require('platform')



class PerformaceInfo{

    /**
     * 
     * @param {Phaser.Game} game 
     */
    constructor(game){
        this.game = game;
        this.lastLoadTime = Date.now();

        this.filesLoaded = {};
        this.filesLoadedNum = 0;
        this.initialized = false;

        this.game.state.getCurrentState();
    }

    Initialize(){
        if(this.initialized){
            console.warn("Already Initialized");
            return;
        }
        this.game.load.onFileComplete.add(
            (progress,name)=>{
              this.AddFileLoaded(name);
            }
        )
        this.game.load.onLoadStart.add(
            ()=>{
                this.LoadStart();
            }
        )
        this.game.load.onLoadComplete.add(
            ()=>{
                this.LoadFinished();
            }
        )
        this.game.time.advancedTiming = true;
    }

    GetFilesLoaded(){
        return this.filesLoadedNum;
    }

    AddFileLoaded(file){
        
        if(this.filesLoaded[file] == undefined){
            this.filesLoaded[file] = 1;
        }else{
            this.filesLoaded[file]++;
            console.warn("File already loaded");
        }
        this.filesLoadedNum++;
    }

    LoadStart(){
        this.lastLoadTime = Date.now();
    }

    LoadFinished(){
        let time = Date.now();
        console.log(time-this.lastLoadTime);
        this.lastLoadTime = time;
    }

    GetMaxFPS(){
        return this.game.time.fpsMax;
    }

    GetCurrentFPS(){
        return this.game.time.fps;
    }

    GetMinFPS(){
        return this.game.time.fpsMin;
    }

    GetNumberShit(){
        return this.game.stage.children.length;
    }
    
    

    
}

var Instance = undefined;

function Initialize(game){
    if(Instance){
        console.warn("already initialized");

    }else{
        Instance = new PerformaceInfo(game);
        Instance.Initialize();
    }
}

/**
 * Get the current ping to a server
 * @param {string} server The server that is going to be pinged
 * 
 */




module.exports = {
    Initialize
    
}