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
