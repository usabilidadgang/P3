(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Direction = {'LEFT':-1, 'RIGHT':1, 'NONE':0};

//DEFINICION DE OBJETOS DE LA ESCENA
//Bandos del juego. Enemigos, heroe e indefinido para errores.
var party = {enemy : 0, hero : 1, undefined: -1};

//Clase base para desarrollar el resto de personajes
function Character(x, y, party, name, lifes, spritename, escene){
  this.sprite = escene.game.add.sprite(x, y, spritename);
  this.position = {x:x, y:y} || {x:0, y:0};
  this.name = name || 'name not defined';
  this.lifes = lifes || 0;
  this.party = party || party.undefined;
  escene.game.physics.arcade.enable(this.sprite);
  Character.prototype.moveX =  function (dir) {
    switch (dir) {
      case Direction.RIGHT:
        this.position.x++;
        this.body.velocity.x = 10;
        break;
      case Direction.LEFT:
        this.position.x--;
        this.body.velocity.x = -10;
        break;
      default:
    }
  };
}
//Rey, que hereda de Character y se mueve y salta conforme al input del usuario
function King (x, y, escene){
  //TODO CAMBIAR EL SPRITE AÑADIDO.
  Character.apply(this, [x, y, party.hero, 'King', 100, 'einstein', escene]);

  King.prototype.update = function () {
    var dir = this.getInput();
    if(dir !== 0){
      this.sprite.scale.x = dir;
      Character.prototype.moveX.call(this,dir);
    }
  };
  King.prototype.getInput = function () {
    var movement = Direction.NONE;
    //Move Right
    if(escene.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) movement = Direction.RIGHT;
    else if(escene.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) movement = Direction.LEFT;
    //Move Left
    return movement;

  };
  King.prototype.jump = function (){


  };
  King.prototype = Object.create(Character.prototype);
  King.prototype.constructor = King;
}
//Enemy, clase base para enemigos. Si tocan al rey le hacen daño.
function Enemy (name, x ,y ,vidas, danyo, spriteName) {
    Character.apply(this, [x, y,party.enemy,name,vidas, spriteName]);
    this.danyo = danyo || 0;
    Enemy.prototype = Object.create(Character.prototype);
    Enemy.prototype.constructor = Enemy;

}
//Serpiente, hereda de enemy y se mueve a izquierda y derecha
function Serpiente(x, y){
  Enemy.apply(this, ['Serpiente',x, y, 1, /*Nombre de sprite*/]);
  Serpiente.prototype = Object.create(Enemy.prototype);
  Serpiente.prototype.constructor = Serpiente;
}
//Golem, enemigo final del juego.
function Golem(x, y){
  Enemy.apply(this, ['Golem',x, y, 15]);
  Golem.prototype = Object.create(Enemy.prototype);
  Golem.prototype.constructor = Golem;
}

module.exports = {
  King: King,
  Serpiente: Serpiente,
  Golem: Golem
};




/*  var moveDirection = new Phaser.Point(0, 0);
  var collisionWithTilemap = this.game.physics.arcade.collide(this._rush, this.groundLayer);
  var movement = this.GetMovement();
  //transitions
  switch(this._playerState)
  {
      case PlayerState.STOP:
      case PlayerState.RUN:
          if(this.isJumping(collisionWithTilemap)){
              this._playerState = PlayerState.JUMP;
              this._initialJumpHeight = this._rush.y;
              this._rush.animations.play('jump');
          }
          else{
              if(movement !== Direction.NONE){
                  this._playerState = PlayerState.RUN;
                  this._rush.animations.play('run');
              }
              else{
                  this._playerState = PlayerState.STOP;
                  this._rush.animations.play('stop');
              }
          }
          break;

      case PlayerState.JUMP:

          var currentJumpHeight = this._rush.y - this._initialJumpHeight;
          this._playerState = (currentJumpHeight*currentJumpHeight < this._jumpHight*this._jumpHight) ? PlayerState.JUMP : PlayerState.FALLING;
          break;

      case PlayerState.FALLING:
          if(this.isStanding()){
              if(movement !== Direction.NONE){
                  this._playerState = PlayerState.RUN;
                  this._rush.animations.play('run');
              }
              else{
                  this._playerState = PlayerState.STOP;
                  this._rush.animations.play('stop');
              }
          }
          break;
  }
  //States
  switch(this._playerState){

      case PlayerState.STOP:
          moveDirection.x = 0;
          break;
      case PlayerState.JUMP:
      case PlayerState.FALLING:
      case PlayerState.RUN:
          if(movement === Direction.NONE){
              moveDirection.x = 0;
              this._rush.scale.x *= 1;
          }
          else{
              moveDirection.x = this._speed;
              this._rush.scale.x = (this._speed/Math.abs(this._speed));
          }
          if(this._playerState === PlayerState.JUMP)
              moveDirection.y = -this._jumpSpeed;
          if(this._playerState === PlayerState.FALLING)
              moveDirection.y = 0;
          break;
  }
  //movement
  this.movement(moveDirection,5,
                this.fondo.layer.widthInPixels*this.fondo.scale.x - 10);
  this.checkPlayerFell();
},


canJump: function(collisionWithTilemap){
  return this.isStanding() && collisionWithTilemap || this._jamping;
},

onPlayerFell: function(){
  //DONE 6 Carga de 'gameOver';
  this.destroy();
  this.game.state.start('gameOver');
},

checkPlayerFell: function(){
  if(this.game.physics.arcade.collide(this._rush, this.muerte))
      this.onPlayerFell();
},

isStanding: function(){
  return this._rush.body.blocked.down || this._rush.body.touching.down;
},

isJumping: function(collisionWithTilemap){
  return this.canJump(collisionWithTilemap) &&
      this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
},

GetMovement: function(){
  var movement = Direction.NONE;
  //Move Right
  if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
      movement = Direction.RIGHT;
      this._speed = 300;
  }
  //Move Left
  if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
      movement = Direction.LEFT;
      this._speed = -300;
  }
  return movement;
},*/

},{}],2:[function(require,module,exports){
'use strict';
var characters = require('./Characters.js');

function CreateMap (Jsonfile, escene){
      escene.map = escene.game.add.tilemap(Jsonfile);
        //Utilizaremos siempre la misma hoja de patrones, por tanto, no necesitamos pasarla por
        //variable.
      escene.map.addTilesetImage('sheet', 'tiles');

        //Creamos las capas de nuestro tilemap
      escene.back = escene.map.createLayer('Back');
      escene.death = escene.map.createLayer('Death');
      escene.ground = escene.map.createLayer('Ground');

      escene._player = new characters.King(100,250, escene);

        //Declaramos las colisiones con la muerte y el Suelo
      escene.map.setCollisionBetween(1, 5000, true, 'Death');
      escene.map.setCollisionBetween(1, 5000, true, 'Ground');

      escene.game.stage.backgroundColor = '#a9f0ff';
      console.log(escene);
    }

module.exports = {
CreateMap: CreateMap
};

},{"./Characters.js":1}],3:[function(require,module,exports){
var GameOver = {
    create: function () {
        console.log("Game Over");
        var button = this.game.add.button(400, 300,
                                          'button',
                                          this.restart,
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        var goText = this.game.add.text(400, 100, "GameOver");
        var text = this.game.add.text(0, 0, "Reset Game");
        text.anchor.set(0.5);
        goText.anchor.set(0.5);
        button.addChild(text);

  //DONE 8 crear un boton con el texto 'Return Main Menu' que nos devuelva al menu del juego
        var button2 = this.game.add.button(400, 200,
                                          'button',
                                          this.goMenu,
                                          this, 2, 2, 4);
        button2.anchor.set(0.5);
        var text2 = this.game.add.text(0, 0, "Menu");
        text2.anchor.set(0.5);
        button2.addChild(text2);


        button.anchor.set(0.5);


    },
    //DONE 7 declarar el callback del boton.
    restart: function(){
      this.game.state.start('play');
    },

    goMenu: function(){
      this.game.state.start('menu');
    }
};

module.exports = GameOver;

},{}],4:[function(require,module,exports){
'use strict';

var playScene = require('./play_scene');
var gameOver = require('./gameover_scene');
var menuScene = require('./menu_scene');
//  The Google WebFont Loader will look for this object, so
// it before loading the script.


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.spritesheet('button', 'images/buttons.png', 168, 70);
    this.game.load.image('logo', 'images/phaser.png');
  },

  create: function () {
      this.game.state.start('preloader');
      this.game.state.start('menu');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";
    this.load.onLoadStart.add(this.loadStart, this);
    //DONE 2.1 Cargar el tilemap images/map.json con el nombre de la cache 'tilemap'.
      //la imagen 'images/simples_pimples.png' con el nombre de la cache 'tiles' y
      // el atlasJSONHash con 'images/rush_spritesheet.png' como imagen y 'images/rush_spritesheet.json'
      //como descriptor de la animación.

    this.game.load.tilemap('tilemap', 'images/Test.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'images/sheet.png');
    this.game.load.atlas('rush', 'images/King.png', 'images/King.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.image('einstein', 'images/Rush.png');

    this.load.onLoadComplete.add(this.loadComplete,this);
      //DONE 2.2a Escuchar el evento onLoadComplete con el método loadComplete que el state 'play'

  },
  loadStart: function () {
    console.log("Game Assets Loading ...");
  },
  loadComplete: function() {
    this.ready = true;
    this.game.state.start('play');
    console.log("Game Assets Loaded!");
  },
     //DONE 2.2b function loadComplete()
    update: function(){
        this._loadingBar
    },

};
var wfconfig = {

  active: function() {
      console.log("font loaded");
      init();
  },
  google: {
      families: ['Sniglet']
  }

};

//DONE 3.2 Cargar Google font cuando la página esté cargada con wfconfig.
//DONE 3.3 La creación del juego y la asignación de los states se hará en el método init().
window.init = function(){
  //DONE 1.2 Añadir los states 'boot' BootScene, 'menu' MenuScene, 'preloader' PreloaderScene, 'play' PlayScene, 'gameOver' GameOver.
  //DONE 1.3 iniciar el state 'boot'.
  //Metodo init, que será llamado una vez la fuente se haya cargado.
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
  game.state.add('boot', BootScene);
  game.state.add('menu', menuScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', playScene);
  game.state.add('gameOver', gameOver);
  //Comenzamos con el estado boot
  game.state.start('boot');

}
window.onload = function () {
  //En el onload se cargará la Google Font
  //DONE 3.2 Cargar Google font cuando la página esté cargada con wfconfig.
  //DONE 3.3 La creación del juego y la asignación de los states se hará en el método init().
  WebFont.load(wfconfig);
};

},{"./gameover_scene":3,"./menu_scene":5,"./play_scene":6}],5:[function(require,module,exports){
var MenuScene = {
    create: function () {
        this.game.world.setBounds(0,0,800,600);
        this.game.stage.backgroundColor = "#000000";
        var logo = this.game.add.sprite(this.game.world.centerX,
                                        this.game.world.centerY,
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        var buttonStart = this.game.add.button(this.game.world.centerX,
                                               this.game.world.centerY,
                                               'button',
                                               this.actionOnClick,
                                               this, 2, 1, 0);
        buttonStart.anchor.set(0.5);
        var textStart = this.game.add.text(0, 0, "Niveles");

        textStart.font = 'Sniglet';
        textStart.anchor.set(0.5);
        buttonStart.addChild(textStart);
    },

    actionOnClick: function(){
        this.game.state.start('preloader');
    }
};

module.exports = MenuScene;

},{}],6:[function(require,module,exports){
'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3};
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3};
var characters = require('./Characters.js');
var mapCreator = require('./MapCreator');
//Scena de juego.
var PlayScene = {
    _player: {}, //player
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 150, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.



  //Método constructor...
  create: function () {
    this.map = new mapCreator.CreateMap('tilemap', this);
    console.log(this);
/*
      this.map = this.game.add.tilemap('tilemap');
      this.map.addTilesetImage('sheet', 'tiles');
      this.muerte = this.map.createLayer('Muerte');
      this.fondoback = this.map.createLayer('FondoBack');
      this.fondo = this.map.createLayer('Fondo');
      this._rush = this.game.add.sprite(10,10, 'rush');
      this.groundLayer = this.map.createLayer('Suelo');
      //plano de muerte

      //Colisiones con el plano de muerte y con el plano de muerte y con suelo.
      this.map.setCollisionBetween(1, 5000, true, 'Muerte');
      this.map.setCollisionBetween(1, 5000, true, 'Suelo');
      //this.muerte.visible = true;
      //Cambia la escala a x3.
      this.groundLayer.setScale(1,1);
      this.fondo.setScale(1,1);
      this.fondoback.setScale(1,1);
      this.muerte.setScale(1,1);
*/


      //this.groundLayer.resizeWorld(); //resize world and adjust to the screen

      //nombre de la animación, frames, framerate, isloop
      /*this._rush.animations.add('run',
                    Phaser.Animation.generateFrameNames('RUN',1,4,'',2),10,true);
      this._rush.animations.add('stop',
                    Phaser.Animation.generateFrameNames('WALK',0,0,'',2),0,false);
      this._rush.animations.add('jump',
                     Phaser.Animation.generateFrameNames('JUMP',0,3,'',2),0,false);*/
      this.configure();
  },

    //IS called one per frame.
    update: function () {
      this._player.update();
    //configure the scene
  },
    configure: function(){
        //Start the Arcade Physics systems
        /*this.game.world.setBounds(0, 0, 2400, 160);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#a9f0ff';
        this.game.physics.arcade.enable(this._rush);

        this._rush.body.bounce.y = 0.2;
        this._rush.body.gravity.y = 20000;
        this._rush.body.gravity.x = 0;
        this._rush.body.velocity.x = 0;
        this._rush.z = 150
        ;
        this.game.camera.follow(this._rush);*/
    },
    //move the player
    movement: function(point, xMin, xMax){/*
        this._rush.body.velocity = point;// * this.game.time.elapseTime;

        if((this._rush.x < xMin && point.x < 0)|| (this._rush.x > xMax && point.x > 0))
            this._rush.body.velocity.x = 0;
*/
    },
    destroy: function(){
      this.map.destroy();
      this.character.destroy();


      console.log("Game assets deleted!");
    //TODO 9 destruir los recursos tilemap, tiles
    }

};



module.exports = PlayScene;

},{"./Characters.js":1,"./MapCreator":2}]},{},[4]);
