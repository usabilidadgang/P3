'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var characters = require('./Characters.js');
var mapCreator = require('./MapCreator');
//Scena de juego.
var PlayScene = {
    _player: {},
    gameOver: false,
  //player
  //Método constructor...
  create: function () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //Generamos el mapa.
    //DEBUG: AL CARGAR TIENES QUE CAMBIAR EN EL MAIN EL NOMBRE DEL ARCHIVO
    new mapCreator.CreateMap('tilemap', this);
    //Introducimos los objetos de juego
    //Array de enemigos
    this.objectArray = [];
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
    var results = this.findObjectsInLayer(this.map, layer);
    for(var i = 0; i < results.length; i++){
      self.spawnFromObject(results[i]);
    }
  },
  //Codigo inspirado por este tutorial:
  // https://gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsInLayer: function(map, layer) {
     var result = [];

    map.objects[layer].forEach(function(element){
         //Phaser uses top left, Tiled bottom left so we have to adjust
         //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
         //so they might not be placed in the exact position as in Tiled
         element.y -= map.tileHeight;
         result.push(element);
     });
     return result;
   },


 //create a sprite from an object
 spawnFromObject: function(element/*, group*/) {
     if(element.type === 'enemy'){
       var enemy = new characters.Serpiente(element.x*3, element.y*3, this); // Snake Spawn on tile's x,y
       this.objectArray.push(enemy);
       this.enemies.add(enemy);
   }
   else if(element.type === 'King'){
     this._player = new characters.King(element.x*3, element.y*3, this);

   }
    else if(element.type === 'endlevel'){
      this.endlevel = this.game.add.sprite(element.x*3, element.y*3,'stairs');
      this.endlevel.scale.setTo(3,3);
      this.game.physics.arcade.enable(this.endlevel);
      this.endlevel.body.allowGravity = false;
      this.endlevel.body.immovable = true;

    }
},



    //IS called one per frame.
    update: function () {
      if(!this.levelComplete && !this.gameOver){
      this.collisionWithTilemap = this.game.physics.arcade.collide(this._player, this.ground);
      this.collisionDeath = this.game.physics.arcade.collide(this._player, this.death);
      this.collisionWithFloor = this.game.physics.arcade.collide(this.enemies, this.ground);
      this.collisionWithEnnemies = this.game.physics.arcade.collide(this._player, this.enemies);
      this.levelComplete = this.game.physics.arcade.collide(this._player, this.endlevel);
      this.objectArray.forEach(function(elem){
        if(elem!== null)elem.update();
      });

      if(this._player !== null)this._player.update();

      if(this.pauseButton.isDown){
        this.game.paused = true;
        this.pauseMenu();
      }
      if(this.levelComplete)

      this.input.onDown.add(this.unpause, this);
    }
    else {
      this.closeLevel();
      if(this.gameOver)this.game.state.start('gameOver');
      else this.game.state.start('levelSucceed');
    }


  },
  closeLevel: function(){

  },
  unpause:function(event){
  if (this.game.paused) {
      if (this.b_menu.getBounds().contains(event.x, event.y)){
             this.game.state.start('menu');
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
  this.b_menu= this.addMenuOption("Menu",function () {
    this.salir();
    this.destroy();
    this.game.state.start('menu');}
    ,0);
  this.b_continue=this.addMenuOption("Continue",function () {
    this.salir();
    this.game.paused = false;}
    ,1);
  this.pausetext = this.game.add.text(this.game.camera.x+400,this.game.camera.y+ 175, 'Click anywhere to continue', { font: '40px Revalia', fill: '#000',boundsAlignH: "center", boundsAlignV: "middle"  });
  this.pausetext.anchor.setTo(0.5,0.5);
    },

  render:function(){
    //debug del cuerpo en verde
    //this.game.debug.body(this.enemies);
    //Datos del collider
    //this.game.debug.bodyInfo(this.enemies, 32, 32);

  },
    configure: function(){
      this.levelComplete = false;

        this.game.world.setBounds(0, 0, 2400, 500);

        //this._player.body.bounce.y = 0.2;
        this.game.physics.arcade.gravity.y = 2000;
        this._player.body.gravity.x = 0;
        this._player.body.velocity.x = 0;
        //this._player.body.collideWorldBounds = false;

        //this._player.z = 150;
        this.game.camera.follow(this._player);
        this.ground.resizeWorld();
    },

    objectDestroy: function (character){
      var found = false;
      var i = 0;
      while(!found){
        if (this.objectArray[i].name === character.name && this.objectArray[i].x === character.x && this.objectArray[i].y === character.y)found = true;
        else i++;
      }
      character.destroy();
      if (character.name != this._player.name)this.objectArray.splice(i,1);
    },


    destroy: function(){
      this.objectArray.forEach(function(elem){
      elem.destroy();});
      this.map.destroy();
      this.character.destroy();


      console.log("Game assets deleted!");
    //TODO 9 destruir los recursos tilemap, tiles
  },
  addMenuOption: function(text, callback,n) {
    var optionStyle = { font: '30pt calibri', fill: 'black', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var button =  this.game.add.button(this.game.camera.x+400, (n * 80)+this.game.camera.y+ 250, 'button', callback, this, 2, 1, 0);
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
    return button;
    }

};



module.exports = PlayScene;
