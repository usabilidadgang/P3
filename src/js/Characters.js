'use strict';
var Direction = {'LEFT':-1, 'RIGHT':1, 'NONE':0};

const Tracker = require('./Tracker.js');

const EventType = require('./EventType')


//DEFINICION DE OBJETOS DE LA ESCENA
//Bandos del juego. Enemigos, heroe e indefinido para errores.
var party = {enemy : 0, hero : 1, undefined: -1};


////////////////////////////////////////////////////////////////////////////
//Character, clase base para desarrollar el resto de personajes
function Character(x, y, party, name, spritename, escene){
  Phaser.Sprite.call(this, escene.game, x, y,spritename);
  escene.game.add.existing(this);
  this.scale.setTo(3, 3);
  escene.game.physics.arcade.enable(this);
  //Cambiamos el ancla del sprite al centro.
  this.anchor.setTo(0.5,0.5);
  this.startposition = {x:x, y:y} || {x:0, y:0};
  this.name = name || 'name not defined';
  this.party = party || party.undefined;
  this.playerSpeed = 400;


  Character.prototype.moveX =  function (dir) {
    switch (dir) {
      case Direction.RIGHT:
        this.body.velocity.x = this.playerSpeed;
        break;
      case Direction.LEFT:
        this.body.velocity.x = -this.playerSpeed;
        break;
      case Direction.NONE:
        this.body.velocity.x = 0;
        break;
      default:
    }
  };
Character.prototype.isStanding = function(){
     return this.body.blocked.down || this.body.touching.down;
};
}
Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

////////////////////////////////////////////////////////////////////////////
//Rey, que hereda de Character y se mueve y salta conforme al input del usuario
function King (x, y, escene){
  //TODO CAMBIAR EL SPRITE AÑADIDO.
  Character.apply(this, [x, y, party.hero, 'King', 'personaje', escene]);
  //ANIMACIONES
  this.animations.add('run',Phaser.Animation.generateFrameNames('R',0,3),15,true);
  this.animations.add('jump', Phaser.Animation.generateFrameNames('J',0,4),10, false);
  this.animations.add('idle', Phaser.Animation.generateFrameNames('R',0,0),1,true);
  //SONIDO DEL SALTO
  this.jumpsound = this.game.add.audio('jumpsound');

//FUNCIONES DEL REY
  King.prototype.update = function () {

    this.animasion = '';
    if(escene.collisionDeath || this.lifes <= 0){
      escene.gameOver = true;
      Tracker.AddEvent(EventType.PLAYER_DEAD,{x:this.x,y:this.y,reason:"Fall"});
    }
    var dir = this.getInput();
    if(dir!== 0)
    {
      this.scale.x = 3*dir;
      if(this.isStanding())this.animasion = 'run';
    }
    else this.animasion = 'idle';
    if(this.isJumping()) this.animasion = 'jump';
    this.animations.play(this.animasion);
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

King.prototype.isJumping = function(){
  if(!this.isStanding() && this.body.velocity.y < 0) return true;
  else return false;
};
  King.prototype.jump = function (){
      this.jumpsound.play(false);
      this.body.velocity.y = -700;

  };

    King.prototype.canJump = function(){
      return this.isStanding() && escene.collisionWithTilemap || escene.collisionWithEnnemies;
  };

}
King.prototype = Object.create(Character.prototype);
King.prototype.constructor = King;


////////////////////////////////////////////////////////////////////////////
//Enemigos
//Enemy, clase base para enemigos. Si tocan al rey le hacen daño.
function Enemy (name, x, y, spriteName, escene) {
    Character.apply(this, [x, y,party.enemy,name , spriteName, escene]);
    this.enemyhit = this.game.add.audio('enemyHit');

    Enemy.prototype.SideCollision = function (){
      return escene.collisionWithEnnemies && ((this.body.blocked.left || this.body.blocked.right)||(this.body.touching.left || this.body.touching.right));
    };
    Enemy.prototype.KillPlayer = function(){
        return !this.Stepped() && this.SideCollision();
      };
    Enemy.prototype.Stepped = function(){
        return escene.collisionWithEnnemies && this.touchedUp();
      };
    Enemy.prototype.touchedUp = function(){
        return this.body.blocked.up || this.body.touching.up;
      };
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

////////////////////////////////////////////////////////////////////////////
//Serpiente, hereda de enemy y se mueve a izquierda y derecha
function Serpiente(x, y, escene){
  Enemy.apply(this, ['Serpiente', x, y, 'serpiente'/*Nombre de sprite*/, escene]);
//Animaciones de la serpiente
  this.runanim = this.animations.add('run',Phaser.Animation.generateFrameNames('S',0,3),3,true);
  this.animations.add('idle', Phaser.Animation.generateFrameNames('S',0,0),1,true);
  this.deathanim = this.animations.add('death', Phaser.Animation.generateFrameNames('D',0,3),50,false);
  this.runanim.speed = 10;
  this.playerSpeed = 450;

  this.reach = 250;
  this.primera = false;
  Serpiente.prototype.update = function (){
    if(!this.primera)
    this.moveX(this.playerNear());
    if(this.KillPlayer()){
        Tracker.AddEvent(EventType.PLAYER_DEAD,{x:this._player.x,y:this._player.y,reason:"Snake"});
        escene.gameOver = true;
    }
    if(this.Stepped() && !this.primera){
      escene.sceneScore += 10;
      this.enemyhit.play(false);
      this.animations.play('death');
      this.primera = true;
      Tracker.AddEvent(EventType.ENEMY_DEAD,{x:this.x,y:this.y,type:"Serpiente"});
    }
    this.deathanim.killOnComplete = true;

  };
  Serpiente.prototype.playerNear = function () {
    if((escene._player.y <= this.y && escene._player.y >= this.y - 150)||(escene._player.y >=this.y && escene._player.y <= this.y + 150)){
      if(escene._player.x <= this.x  && escene._player.x >= this.x - this.reach)
      {
        this.animations.play('run');
        this.scale.x = Direction.LEFT * 3;
        return Direction.LEFT;
      }
      else if (escene._player.x >= this.x && escene._player.x <= this.x + this.reach)
       {
         this.animations.play('run');
         this.scale.x = Direction.RIGHT * 3;
          return Direction.RIGHT;
        }
    }
    else {
      this.animations.play('idle');
      return 0;
    }
  };
}
Serpiente.prototype = Object.create(Enemy.prototype);
Serpiente.prototype.constructor = Serpiente;

////////////////////////////////////////////////////////////////////////////
//Golem, enemigo final del juego.
function Golem(x, y, escene){
  Enemy.apply(this, ['Golem', x, y, 'Golem', escene]);
  this.animations.add('run', Phaser.Animation.generateFrameNames('R',0,3),10,true);
  this.summonanim = this.animations.add('summon', Phaser.Animation.generateFrameNames('Summon',0,1),2,false);
  this.animations.add('idle', Phaser.Animation.generateFrameNames('R',0,0),1,true);
  this.playerSpeed = 450;
  this.state = 0;
  this.lifes = 2;
  this.direccion = Direction.LEFT;
  var self = this;
  this.tocado = false;
  this.maxSerpientes = 5;
  this.Serpientes = 0;
Golem.prototype.update = function (){

  if (this.lifes === 0){
    Tracker.AddEvent(EventType.ENEMY_DEAD,{x:this._player.x,y:this._player.y,type:"Golem"});
    this.game.state.start('levelSucceed');
  }
  if(this.KillPlayer()){
    escene.gameOver = true;
    Tracker.AddEvent(EventType.PLAYER_DEAD,{x:this._player.x,y:this._player.y,reason:"Golem"});
  } 
  if(this.Stepped() && !this.tocado){
    this.lifes--;
    this.tocado = true;
  }
this.scale.x = this.direccion * 3;
  switch(this.lifes){
    case 2:
      this.checkSides();
      this.moveX(this.direccion);
      this.animations.play('run');
      break;
    case 1:
    this.option = Math.floor((Math.random() * 100000) + 1);
    if(this.option > 0 && this.option < 90000){
      this.animations.play('run');
      this.checkSides();
    }
    else if (this.option > 90000 && this.Serpientes <= this.maxSerpientes){
        this.spawnSnake();
        this.Serpientes++;

    }
    break;

  }
  if(this.direccion === 0)this.animations.play('idle');
  this.moveX(this.direccion);
  if(Phaser.Math.distance(this.x, this.y, escene._player.x, escene._player.y) > 100)this.tocado = false ;
};
Golem.prototype.spawnSnake = function (){
    var serp = new Serpiente((Math.random() * 1390)+970, this.y, escene);
    escene.enemies.add(serp);
    escene.objectArray.push(serp);
};
Golem.prototype.checkSides = function(){
    if(this.body.blocked.right || this.body.touching.right){
    this.direccion = Direction.LEFT;
    this.playerSpeed = 450 * Math.floor((Math.random() * 2) + 1);
    }
    else if(this.body.blocked.left || this.body.touching.left){
    this.direccion = Direction.RIGHT;
    this.playerSpeed = 450 * Math.floor((Math.random() * 2) + 1);
    }

  };
}
Golem.prototype = Object.create(Enemy.prototype);
Golem.prototype.constructor = Golem;

module.exports = {
  King: King,
  Serpiente: Serpiente,
  Golem: Golem
};
