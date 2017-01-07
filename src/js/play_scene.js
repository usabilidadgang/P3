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

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //Generamos el mapa.
    this.map = new mapCreator.CreateMap('tilemap', this);
    //Introducimos al personaje
    this._player = new characters.King(100,700, this);
    this.enemy1 = new characters.Serpiente(500,600, this);

    this.ground.setScale(3,3);
    this.back.setScale(5,5);
    this.death.setScale(3,3);


    //TODO Introducir enemigos
    this.enemies = this.game.add.group();
    this.enemies.add(this.enemy1.sprite);
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
    //Esto es un poco puenteo, pues no sabemos como introducir objetos enteros dentro
    //de un grupo


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
      this.collisionWithTilemap = this.game.physics.arcade.collide(this._player.sprite, this.ground);
      this.collisionDeath = this.game.physics.arcade.collide(this._player.sprite, this.death);
      this.collisionWithFloor = this.game.physics.arcade.collide(this.enemy1.sprite, this.ground);
      this.collisionWithEnnemies = this.game.physics.arcade.collide(this._player.sprite, this.enemies);
      if(this.enemy1!== null){this.enemy1.update(); console.log('kekere')}
      if(this._player !== null)this._player.update();

      if(this.pauseButton.isDown){
        this.game.paused = true;
        this.pauseMenu();
      }


      this.input.onDown.add(this.unpause, this);
        //configure the scene
  },
  unpause:function(event){
  console.log("click");
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
    //this.game.debug.body(this._player.sprite);
    //Datos del collider
    //this.game.debug.bodyInfo(this.enemy1.sprite, 32, 32);

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
    //move the player
    movement: function(point, xMin, xMax){/*
        this._rush.body.velocity = point;// * this.game.time.elapseTime;

        if((this._rush.x < xMin && point.x < 0)|| (this._rush.x > xMax && point.x > 0))
            this._rush.body.velocity.x = 0;
*/
    },
    characterDestroy: function (character){
      character.sprite.destroy();
      character = null;
    },
    destroy: function(){
      this.map.destroy();
      this.character.destroy();


      console.log("Game assets deleted!");
    //TODO 9 destruir los recursos tilemap, tiles
    }

};



module.exports = PlayScene;
