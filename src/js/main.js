'use strict';

var playScene = require('./play_scene');
var gameOver = require('./gameover_scene');
var menuScene = require('./menu_scene');
var credits = require('./credits');
var levelSucceed = require('./levelSucceed_scene');
var Tracker = require('./Tracker');
const EventType = require("./EventType");

const PerformanceInfo = require('./PerformanceInfo');
//  The Google WebFont Loader will look for this object, so
// it before loading the script.


var BootScene = {
  preload: function () {
    PerformanceInfo.Initialize(this.game,Tracker);
    
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', './images/preloader_bar.png');
    this.game.load.spritesheet('button', './images/buttons.png', 168, 70);
    this.game.load.image('logo', './images/castle.png');
    this.game.load.image('kekstar', './images/kekstar.png');
    //http://freesound.org/people/NenadSimic/sounds/171697/
    this.game.load.audio('click', './Sounds/Effects/click.wav');

    //http://opengameart.org/content/generic-8-bit-jrpg-soundtrack
    this.game.load.audio('intromusic', './Sounds/Music/intro.ogg');
    this.game.load.audio('creditMusic', './Sounds/Music/credits.ogg');

  },

  create: function () {
    this.game.click = this.game.add.audio('click');
    this.game.state.start('preloader');
    this.game.state.start('menu');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(100, 300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";
    this.load.onLoadStart.add(this.loadStart, this);
    //DONE 2.1 Cargar el tilemap images/map.json con el nombre de la cache 'tilemap'.
    //la imagen 'images/simples_pimples.png' con el nombre de la cache 'tiles' y
    // el atlasJSONHash con 'images/rush_spritesheet.png' como imagen y 'images/rush_spritesheet.json'
    //como descriptor de la animación.

    this.game.load.tilemap('Nivel1', './mapas/Nivel1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('Nivel2', './mapas/Nivel2.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('Nivel3', './mapas/Nivel3.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.image('tiles', './images/sheet.png');
    //http://freesound.org/people/Questiion/sounds/166392/
    this.game.load.audio('music1', './Sounds/Music/Level1.wav');
    this.game.load.audio('music2', './Sounds/Music/Level2.ogg');

    //http://freesound.org/people/primordiality/sounds/78824/
    this.game.load.audio('levelSuccess', './Sounds/Effects/LevelSuccess.wav');



    this.game.load.audio('jumpsound', './Sounds/Effects/Jump.wav');

    this.game.load.audio('enemyHit', "./Sounds/Effects/EnemyHit.wav");
    //http://freesound.org/people/josepharaoh99/sounds/361636/
    this.game.load.audio('playerDeath', "./Sounds/Effects/PlayerDeath.mp3");

    //http://freesound.org/people/cabled_mess/sounds/350986/
    this.game.load.audio('lost', './Sounds/Effects/lost.wav');

    this.game.load.atlas('personaje', './images/Character Sprites/King/King.png', 'atlas/King.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    this.game.load.atlas('serpiente', './images/Character Sprites/Snake/Snake.png', 'atlas/Snake.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    this.game.load.atlas('Golem', './images/Character Sprites/Golem/Golem.png', 'atlas/Golem.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    

    this.game.load.image('stairs', './images/stairs.png');
    this.load.onLoadComplete.add(this.loadComplete, this);
  console.log(performance.memory)

  },
  loadStart: function () {
    console.log("Game Assets Loading ...");
  },
  loadComplete: function () {
    this.ready = true;
    this.game.state.start('play');
    console.log("Game Assets Loaded!");
  },
  //DONE 2.2b function loadComplete()
  update: function () {
  },

};
var wfconfig = {
  active: function () {
    init();
  },
  google: {
    families: ['Sniglet', 'MedievalSharp', 'Astloch']
  }

};


window.init = function () {
  //Metodo init, que será llamado una vez la fuente se haya cargado.
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
  
  
  
  game.state.add('boot', BootScene);
  game.state.add('menu', menuScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', playScene);
  game.state.add('creditos', credits);
  game.state.add('gameOver', gameOver);
  game.state.add('levelSucceed', levelSucceed);
  //Comenzamos con el estado boot
  game.state.start('boot');
  
  game.niveles = { 1: 'Nivel1', 2: 'Nivel2', 3: 'Nivel3' };
  game.musics = { 1: 'music1', 2: 'music2', 3: 'music1' };
  game.nivelActual = 1;
  game.overallScore = 0;
  
}

window.onload = function () {
  
  let setup = {

    persistance: {
      type: Tracker.PersistanceType.Server,
      arg: "https://usabilidadanalytics.tk/tracker",
    },
    serializer: {
      type: Tracker.SerializerType.JSON
    },
    maxQueuedEvents: 0
  }

  Tracker.InitTracker(setup);
  Tracker.AddEvent(EventType.SESSION_INIT, undefined)
  
  WebFont.load(wfconfig);
};

window.onbeforeunload = function (){
  Tracker.AddEvent(EventType.SESSION_CLOSE,undefined);
  Tracker.SaveWithPersistance();
  return true;
}	

