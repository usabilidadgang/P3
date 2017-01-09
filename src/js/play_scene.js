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
