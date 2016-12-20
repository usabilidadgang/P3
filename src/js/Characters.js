'use strict';
var party = {enemy : 0, hero : 1, undefined: -1};
var Direction = {'LEFT':-1, 'RIGHT':1, 'NONE':0};

function Character (x, y, party,name,lifes){
  this.position = {x:x,y:y} || {x:0,y:0};
  this.name = name || 'name not defined';
  this.lifes = lifes || 0;
  this.party = party || party.undefined;
  Character.prototype.moveX =  function (dir) {
    switch (dir) {
      case Direction.RIGHT:
        this.position.x++;
        break;
      case Direction.LEFT:
        this.position.x--;
        break;
      default:

    }
  };
}
function King (x, y){
  Character.apply(this, [x, y, party.hero, 'King', 100]);

  King.prototype.update = function () {
    var dir = this.getInput();
    if(dir !== 0){
      this.scale.x = dir;
      this.moveX(dir);
    }
  };
  King.prototype.getInput = function () {
    var movement = Direction.NONE;
    //Move Right
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) movement = Direction.RIGHT;
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) movement = Direction.LEFT;
    //Move Left
    return movement;

  };
  King.prototype.jump = function (){


  };
}
King.prototype = Object.create(Character.prototype);
King.prototype.constructor = King;

function Enemy (name, x ,y, vidas) {
    Character.apply(this, [x, y,party.enemy,name,vidas]);

}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
function Serpiente(x,y){
  Enemy.apply(this, ['Serpiente',x, y, 1]);
}
Serpiente.prototype = Object.create(Enemy.prototype);
Serpiente.prototype.constructor = Serpiente;

function Golem(x,y){
  Enemy.apply(this, ['Golem',x, y, 15]);

}
Golem.prototype = Object.create(Enemy.prototype);
Golem.prototype.constructor = Golem;
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
