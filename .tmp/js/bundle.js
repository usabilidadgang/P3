(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Direction = {'LEFT':-1, 'RIGHT':1, 'NONE':0};

//DEFINICION DE OBJETOS DE LA ESCENA
//Bandos del juego. Enemigos, heroe e indefinido para errores.
var party = {enemy : 0, hero : 1, undefined: -1};


////////////////////////////////////////////////////////////////////////////
//Character, clase base para desarrollar el resto de personajes
function Character(x, y, party, name, lifes, spritename, escene){

  this.sprite = escene.game.add.sprite(x, y, spritename);
  this.sprite.scale.setTo(3, 3);
  escene.game.physics.arcade.enable(this.sprite);
  //Cambiamos el ancla del sprite al centro.
  this.sprite.anchor.setTo(0.5,0.5);
  this.startposition = {x:x, y:y} || {x:0, y:0};
  this.name = name || 'name not defined';
  this.lifes = lifes || 0;
  this.party = party || party.undefined;
  this.playerSpeed = 400;


  Character.prototype.moveX =  function (dir) {
    switch (dir) {
      case Direction.RIGHT:
        this.sprite.body.velocity.x = this.playerSpeed;
        break;
      case Direction.LEFT:
        this.sprite.body.velocity.x = -this.playerSpeed;
        break;
      case Direction.NONE:
        this.sprite.body.velocity.x = 0;
        break;
      default:
    }
  };
}
////////////////////////////////////////////////////////////////////////////
//Rey, que hereda de Character y se mueve y salta conforme al input del usuario
function King (x, y, escene){
  //TODO CAMBIAR EL SPRITE AÑADIDO.
Character.apply(this, [x, y, party.hero, 'King', 1, 'personaje', escene]);

//FUNCIONES DEL REY
  King.prototype.update = function () {
    if(escene.collisionDeath || this.lifes <= 0){
      this.sprite.visible = false;
        escene.game.state.start('gameOver');

    }
    var dir = this.getInput();
    if(dir!== 0)this.sprite.scale.x = 3*dir;
    Character.prototype.moveX.call(this, dir);

  };

  King.prototype.getInput = function () {
    var movement = Direction.NONE;
    //Move Right
    if(escene.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) movement = Direction.RIGHT;
    else if(escene.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) movement = Direction.LEFT;

    if(this.canJump() && escene.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
    this.jump();
  }
    return movement;
  };

  King.prototype.jump = function (){
      this.sprite.body.velocity.y = -700;

  };

    King.prototype.canJump = function(){
      return this.isStanding() && escene.collisionWithTilemap;
  };

    King.prototype.isStanding = function(){
       return this.sprite.body.blocked.down || this.sprite.body.touching.down;
  };
}
King.prototype = Object.create(Character.prototype);
King.prototype.constructor = King;


////////////////////////////////////////////////////////////////////////////
//Enemigos
//Enemy, clase base para enemigos. Si tocan al rey le hacen daño.
function Enemy (name, x, y, vidas, danyo, spriteName, escene) {
    Character.apply(this, [x, y,party.enemy,name , vidas, spriteName, escene]);
    this.damage = danyo || 0;
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

////////////////////////////////////////////////////////////////////////////
//Serpiente, hereda de enemy y se mueve a izquierda y derecha
function Serpiente(x, y, escene){
  Enemy.apply(this, ['Serpiente',x, y, 1,1, 'serpiente'/*Nombre de sprite*/, escene]);
  this.playerSpeed = 300;
  this.reach = 200;

  Serpiente.prototype.update = function (){
    this.moveX(this.playerNear());
    if(this.Stepped()){
      this.sprite.visible = false;
      this.sprite.body.enable = false;
    }
    if(this.KillPlayer())  escene.game.state.start('gameOver');
  };
  Serpiente.prototype.playerNear = function () {
      if(escene._player.sprite.x <= this.sprite.x  && escene._player.sprite.x >= this.sprite.x - this.reach)
      {
        this.sprite.scale.x = Direction.LEFT * 3;
        return Direction.LEFT;
      }
      else if (escene._player.sprite.x >= this.sprite.x && escene._player.sprite.x <= this.sprite.x + this.reach)
       {
         this.sprite.scale.x = Direction.RIGHT * 3;
          return Direction.RIGHT;
        }
      else return 0;
  };

  Serpiente.prototype.KillPlayer = function(){
    return !this.Stepped() && this.SideCollision();
  };

  Serpiente.prototype.SideCollision = function (){
    return escene.collisionWithEnnemies && ((this.sprite.body.blocked.left || this.sprite.body.blocked.right)||(this.sprite.body.touching.left || this.sprite.body.touching.right));
  };

  Serpiente.prototype.Stepped = function(){
    return escene.collisionWithEnnemies && this.touchedUp();
  };

  Serpiente.prototype.touchedUp = function(){
    return this.sprite.body.blocked.up || this.sprite.body.touching.up;
  };
}
Serpiente.prototype = Object.create(Enemy.prototype);
Serpiente.prototype.constructor = Serpiente;

////////////////////////////////////////////////////////////////////////////
//Golem, enemigo final del juego.
function Golem(x, y, escene){
  Enemy.apply(this, ['Golem',x, y, 15, escene]);
}
Golem.prototype = Object.create(Enemy.prototype);
Golem.prototype.constructor = Golem;

module.exports = {
  King: King,
  Serpiente: Serpiente,
  Golem: Golem
};

},{}],2:[function(require,module,exports){
'use strict';
var characters = require('./Characters.js');

function CreateMap (Jsonfile, escene){
      escene.map = escene.game.add.tilemap(Jsonfile);
        //Utilizaremos siempre la misma hoja de patrones, por tanto, no necesitamos pasarla por
        //variable.
      escene.map.addTilesetImage('sheet', 'tiles');
      escene.game.physics.arcade.TILE_BIAS = 40;

        //Creamos las capas de nuestro tilemap
      escene.back = escene.map.createLayer('Back');
      escene.death = escene.map.createLayer('Death');
      escene.ground = escene.map.createLayer('Ground');
      //escene.spawn = escene.map.createLayer('spawn');

        //Declaramos las colisiones con la muerte y el Suelo
      escene.map.setCollisionBetween(1, 5000, true, 'Death');
      escene.map.setCollisionBetween(1, 5000, true, 'Ground');

      escene.ground.setScale(3,3);
      escene.back.setScale(3,3);
      escene.death.setScale(3,3);
      //this.spawn.setScale(3,3);

      //escene.spawn.visible = false;
      escene.game.stage.backgroundColor = '#a9f0ff';
    }

module.exports = {
CreateMap: CreateMap
};

},{"./Characters.js":1}],3:[function(require,module,exports){
var Credits = {

  preload: function () {
    this.optionCount = 1;
    this.creditCount = 0;

  },

  addCredit: function(task, author) {
    var authorStyle = { font: '40pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var taskStyle = { font: '30pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var authorText = this.game.add.text(this.game.world.centerX, 900, author, authorStyle);
    var taskText = this.game.add.text(this.game.world.centerX, 950, task, taskStyle);
    authorText.anchor.setTo(0.5);
    authorText.stroke = "rgba(0,0,0,0)";
    authorText.strokeThickness = 4;
    taskText.anchor.setTo(0.5);
    taskText.stroke = "rgba(0,0,0,0)";
    taskText.strokeThickness = 4;
    this.game.add.tween(authorText).to( { y: -300 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
    this.game.add.tween(taskText).to( { y: -200 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
    this.creditCount ++;
  },


  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt calibri', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var button =  this.game.add.button(100, (this.optionCount * 80) + 400, 'button', callback, this, 2, 1, 0);
    var txt = this.game.add.text(0,0, text, optionStyle);
    txt.anchor.set(0.5);
    button.anchor.set(0.5);
    button.addChild(txt);

    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;
  },

  create: function () {
    this.stage.disableVisibilityChange = true;
    this.addCredit('Music', 'Kevin Macleod');
    this.addCredit('Developer', 'Matt McFarland');
    this.addCredit('Lorem Ipsum', 'Mipsem Dempsum');
    this.addCredit('Caveats', 'Keyboard Cat');
    this.addCredit('Phaser.io', 'Powered By');
    this.addCredit('for playing', 'Thank you');
    this.addMenuOption('Menu', function (e) {
      this.game.state.start("menu");
    });
    this.addMenuOption('GitHub', function (e) {
      window.open("https://github.com/Kekstar");
    });



  }

};
module.exports = Credits;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

var playScene = require('./play_scene');
var gameOver = require('./gameover_scene');
var menuScene = require('./menu_scene');
var credits = require('./credits');

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

    this.game.load.tilemap('tilemap', 'mapas/Nivel1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'images/sheet.png');
    //this.game.load.atlas('rush', 'atlas/King.png', 'images/King.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.image('personaje', 'images/Rush.png');
    this.game.load.image('serpiente', 'images/serpiente.png');
    this.game.load.image('menu', 'images/b_menu.png');
    this.game.load.image('continue', 'images/b_continue.png');

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
  game.state.add('creditos', credits);
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

},{"./credits":3,"./gameover_scene":4,"./menu_scene":6,"./play_scene":7}],6:[function(require,module,exports){
var MenuScene = {
  preload: function () {
    this.optionCount = 1;
  },
  create: function () {
      this.game.world.setBounds(0,0,800,600);
      this.game.stage.backgroundColor = "#000000";
      var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
      logo.anchor.setTo(0.5, 0.5);
      this.addMenuOption('Jugar', function (e) {
          this.game.state.start('preloader');
      });
      this.addMenuOption('Creditos', function (e) {
          this.game.state.start("creditos");
      });
      this.addMenuOption('GitHub', function (e) {
        window.open("https://github.com/Kekstar");
      });
  },
  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt calibri', fill: 'black', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var button =  this.game.add.button(this.game.world.centerX, (this.optionCount * 80)+300, 'button', callback, this, 2, 1, 0);
    var txt = this.game.add.text(0,0, text, optionStyle);
    txt.anchor.set(0.5);
    button.anchor.set(0.5);
    button.addChild(txt);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "black";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
      };
      txt.useHandCursor = true;
      txt.inputEnabled = true;
      txt.events.onInputUp.add(callback, this);
      txt.events.onInputOver.add(onOver, this);
      txt.events.onInputOut.add(onOut, this);

      this.optionCount ++;
    },
};

module.exports = MenuScene;

},{}],7:[function(require,module,exports){
'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var characters = require('./Characters.js');
var mapCreator = require('./MapCreator');
//Scena de juego.
var PlayScene = {
    _player: {}, //player
  //Método constructor...
  create: function () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //Generamos el mapa.
    //DEBUG: AL CARGAR TIENES QUE CAMBIAR EN EL MAIN EL NOMBRE DEL ARCHIVO
    new mapCreator.CreateMap('tilemap', this);
    //Introducimos al personaje
    //this._player = new characters.King(100,700, this);
    //Array de enemigos
    this.enemyArray = [];
    //grupo para los sprites de los enemigos.
    this.enemies = this.game.add.group();
    this.spawnObjects('Spawn');

    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.P);

      //nombre de la animación, frames, framerate, isloop
      /*this._rush.animations.add('run',
                    Phaser.Animation.generateFrameNames('RUN',1,4,'',2),10,true);
      this._rush.animations.add('stop',
                    Phaser.Animation.generateFrameNames('WALK',0,0,'',2),0,false);
      this._rush.animations.add('jump',
                     Phaser.Animation.generateFrameNames('JUMP',0,3,'',2),0,false);*/
      this.configure();

  },

  spawnObjects: function(layer){
    var self = this;
    var results = this.findObjectsByType('enemy', this.map, layer);
    for(var i = 0; i < results.length; i++){
      self.spawnFromObject(results[i]);
    }
    var king = this.findObjectsByType('King', this.map, layer);
    self.spawnFromObject(king[0]);

    var endlevel = this.findObjectsByType('endlevel', this.map, layer);
    self.spawnFromObject(endlevel[0]);
  },
  //Codigo inspirado por este tutorial:
  // https://gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
     var result = [];

    map.objects[layer].forEach(function(element){
       if(element.type === type) {
         //Phaser uses top left, Tiled bottom left so we have to adjust
         //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
         //so they might not be placed in the exact position as in Tiled
         element.y -= map.tileHeight;
         result.push(element);
       }
     });
     return result;
   },


 //create a sprite from an object
 spawnFromObject: function(element/*, group*/) {
     if(element.type === 'enemy'){
       var enemy = new characters.Serpiente(element.x*3, element.y*3, this); // Snake Spawn on tile's x,y
       this.enemyArray.push(enemy);
       this.enemies.add(enemy.sprite);
   }
   else if(element.type === 'King')
        this._player = new characters.King(element.x*3, element.y*3, this);
    else if(element.type === 'endlevel'){
        //this.endlevel = this.game.addSprite(element.x*3, element.y*3,)
    }



 },



    //IS called one per frame.
    update: function () {
      this.collisionWithTilemap = this.game.physics.arcade.collide(this._player.sprite, this.ground);
      this.collisionDeath = this.game.physics.arcade.collide(this._player.sprite, this.death);
      this.collisionWithFloor = this.game.physics.arcade.collide(this.enemies, this.ground);
      this.collisionWithEnnemies = this.game.physics.arcade.collide(this._player.sprite, this.enemies);
      this.enemyArray.forEach(function(elem){
        if(elem!== null)elem.update();
      });

      if(this._player !== null)this._player.update();

      if(this.pauseButton.isDown){
        this.game.paused = true;
        this.pauseMenu();
      }


      this.input.onDown.add(this.unpause, this);
        //configure the scene
  },
  unpause:function(event){
  if (this.game.paused) {
      if (this.b_menu.getBounds().contains(event.x, event.y)){
             this.game.state.start('gameOver');
             this.game.paused = false;
           }
      if (this.b_continue.getBounds().contains(event.x, event.y)) {
        this.game.paused = false;
    }
    else {
      this.game.paused = false;
    }
    this.salir();
 }
},

salir:function(){
  this.b_menu.destroy();
  this.b_continue.destroy();
  this.pausetext.destroy();

},
pauseMenu:function(){

      this.b_menu = this.game.add.sprite(this.game.camera.x+400,this.game.camera.y+ 250,'menu');
      this.b_menu.anchor.setTo(0.5,0.5);
      this.b_menu.scale.setTo(2,2);

      this.b_continue = this.game.add.sprite(this.game.camera.x+400, this.game.camera.y +350 ,'continue');
      this.b_continue.anchor.setTo(0.5,0.5);
      this.b_continue.scale.setTo(2, 2);

      this.pausetext = this.game.add.text(this.game.camera.x+400,this.game.camera.y+ 175, 'Click anywhere to continue', { font: '40px Revalia', fill: '#000',boundsAlignH: "center", boundsAlignV: "middle"  });
      this.pausetext.anchor.setTo(0.5,0.5);
    },

  render:function(){
    //debug del cuerpo en verde
    this.game.debug.body(this.enemies);
    //Datos del collider
    this.game.debug.bodyInfo(this.enemies, 32, 32);

  },
    configure: function(){

        this.game.world.setBounds(0, 0, 2400, 500);

        //this._player.sprite.body.bounce.y = 0.2;
        this.game.physics.arcade.gravity.y = 2000;
        this._player.sprite.body.gravity.x = 0;
        this._player.sprite.body.velocity.x = 0;
        //this._player.sprite.body.collideWorldBounds = false;

        //this._player.z = 150;
        this.game.camera.follow(this._player.sprite);
        this.ground.resizeWorld();
    },
    
    characterDestroy: function (character){
      character.sprite.destroy();
      character = null;
    },
    destroy: function(){
      this.enemyArray.forEach(function(elem){
        elem.sprite.destroy();
        elem = null;});
      this.map.destroy();
      this.character.destroy();


      console.log("Game assets deleted!");
    //TODO 9 destruir los recursos tilemap, tiles
    }

};



module.exports = PlayScene;

},{"./Characters.js":1,"./MapCreator":2}]},{},[5]);
