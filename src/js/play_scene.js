'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3};
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3};

//Scena de juego.
var PlayScene = {
    _rush: {}, //player
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 150, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.

    //Método constructor...
  create: function () {
      //Creamos al player con un sprite por defecto.
      //DONE 5 Creamos a rush 'rush'  con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'


      //DONE 4: Cargar el tilemap 'tilemap' y asignarle al tileset 'patrones' la imagen de sprites 'tiles'
      this.map = this.game.add.tilemap('tilemap');
      this.map.addTilesetImage('sheet', 'tiles');
      //Creacion de las layers
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
      this.groundLayer.setScale(2,2);
      this.fondo.setScale(2,2);
      this.fondoback.setScale(2,2);
      this.muerte.setScale(2,2);


      //this.groundLayer.resizeWorld(); //resize world and adjust to the screen

      //nombre de la animación, frames, framerate, isloop
      this._rush.animations.add('run',
                    Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
      this._rush.animations.add('stop',
                    Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
      this._rush.animations.add('jump',
                     Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
      this.configure();
  },

    //IS called one per frame.
    update: function () {
        var moveDirection = new Phaser.Point(0, 0);
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
          var JorF = false;
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
    },
    //configure the scene
    configure: function(){
        //Start the Arcade Physics systems
        this.game.world.setBounds(0, 0, 2400, 160);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#a9f0ff';
        this.game.physics.arcade.enable(this._rush);

        this._rush.body.bounce.y = 0.2;
        this._rush.body.gravity.y = 20000;
        this._rush.body.gravity.x = 0;
        this._rush.body.velocity.x = 0;
        this._rush.z = 150
        ;
        this.game.camera.follow(this._rush);
    },
    //move the player
    movement: function(point, xMin, xMax){
        this._rush.body.velocity = point;// * this.game.time.elapseTime;

        if((this._rush.x < xMin && point.x < 0)|| (this._rush.x > xMax && point.x > 0))
            this._rush.body.velocity.x = 0;

    },
    destroy: function(){
      this.map.destroy();
      this._rush.destroy();


      console.log("Game assets deleted!");
    //TODO 9 destruir los recursos tilemap, tiles
    }

};

module.exports = PlayScene;
