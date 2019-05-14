'use strict'
const ping = require('ping');
const os = require('os');
const plat= require('platform');
const browser = require('browser-detect');
const ipInfo = require("ipinfo");


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

        //This number can be changed

        this.step(this);
        this.BrowserInfo();
        this.SizeInfo();
        this.LanguageInfo();
        this.IpCountryInfo();



    }
    step (context) {
        var fps = context.GetCurrentFPS();
        console.log(fps);
        setInterval(this.step,1000,context);

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
        this.game.update
        this.game.time.advancedTiming = true;

    }

    GetFilesLoaded(){
        return this.filesLoadedNum;
    }

    AddFileLoaded(file){

        if(this.filesLoaded[file] == undefined){
            this.filesLoaded[file] = 1;
            console.log("Loaded "+ file)
        }else{
            this.filesLoaded[file]++;
            console.warn("File already loaded " +file);
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

    BrowserInfo(){
      if (navigator.userAgent.indexOf("Win") != -1) console.log("Windows");
    if (navigator.userAgent.indexOf("Mac") != -1) console.log("Macintosh");
    if (navigator.userAgent.indexOf("Linux") != -1) console.log("Linux");
    if (navigator.userAgent.indexOf("Android") != -1) console.log("Android");
    if (navigator.userAgent.indexOf("like Mac") != -1) console.log("iOS");


    //Esta libreria suelta el os que le da la gana, lo demás bien
    const result = browser();
    console.log("Broswer: " + result.name + " Version: " + result.version + " is Mobile: "+ result.mobile);
    }


    SizeInfo(){
      console.log("Screen Size :" + screen.width + " x " + screen.height);
      console.log("Screen Size :" + document.documentElement.clientHeight+ " x " + screen.offsetWidth);
    }

    LanguageInfo(){
      console.log("Language : " +navigator.languages);
    }

    IpCountryInfo(){
      ipInfo((err, cLoc) => {
          console.log(err || cLoc);});
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
