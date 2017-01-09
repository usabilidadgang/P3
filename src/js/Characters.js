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
  this.playerSpeed = 450;
  this.reach = 250;

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
