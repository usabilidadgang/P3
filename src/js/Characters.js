'use strict';
var party = {enemy, hero, undefined};
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
  Character.apply(this, [x, y,parties.hero,'King', 100]);

  King.prototype.update = function () {
    var dir = this.getInput();
    if(dir !== 0){
      this.scale.x = dir;
      this.moveX(dir)
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
