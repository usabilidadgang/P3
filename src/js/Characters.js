'use strict';
var Direction = {'LEFT':-1, 'RIGHT':1, 'NONE':0};

//DEFINICION DE OBJETOS DE LA ESCENA
//Bandos del juego. Enemigos, heroe e indefinido para errores.
var party = {enemy : 0, hero : 1, undefined: -1};

//Clase base para desarrollar el resto de personajes
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
//Rey, que hereda de Character y se mueve y salta conforme al input del usuario
function King (x, y, escene){
  //TODO CAMBIAR EL SPRITE AÑADIDO.
Character.apply(this, [x, y, party.hero, 'King', 1, 'personaje', escene]);

//FUNCIONES DEL REY
  King.prototype.update = function () {
    if(escene.collisionDeath || this.lifes <= 0){
        escene.game.state.start('gameOver');

    }
    var dir = this.getInput();
    //TODO CAmbiar el update. Si se pulsa una tecla, se llama al método. Si no
    //no se le llama
    if(dir!== 0)this.sprite.scale.x = 3*dir;
    Character.prototype.moveX.call(this, dir);
    //console.log('velocidad en y: ', this.sprite.body.velocity.y);

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
//Enemy, clase base para enemigos. Si tocan al rey le hacen daño.
function Enemy (name, x, y, vidas, danyo, spriteName, escene) {
    Character.apply(this, [x, y,party.enemy,name , vidas, spriteName, escene]);
    this.damage = danyo || 0;
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

//Serpiente, hereda de enemy y se mueve a izquierda y derecha
function Serpiente(x, y, escene){
  Enemy.apply(this, ['Serpiente',x, y, 1,1, 'serpiente'/*Nombre de sprite*/, escene]);
  this.playerSpeed = 300;
  this.reach = 200;

  Serpiente.prototype.update = function (){

    this.moveX(this.playerNear());
    if(this.Stepped())console.log("kek");
    else if (escene.collisionWithEnnemies) {
      console.log("player muerto");
      escene._player.lifes--;

    }
  };
  Serpiente.prototype.playerNear = function () {
      if(escene._player.sprite.x <= this.sprite.x && escene._player.sprite.x >= this.sprite.x - this.reach)
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

  Serpiente.prototype.Stepped = function(){
    return escene.collisionWithEnnemies && this.touchedUp();
  };

  Serpiente.prototype.touchedUp = function(){
    return this.sprite.body.blocked.up || this.sprite.body.touching.up;
  };
}
Serpiente.prototype = Object.create(Enemy.prototype);
Serpiente.prototype.constructor = Serpiente;
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
