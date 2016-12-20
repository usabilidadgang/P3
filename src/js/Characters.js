'use strict';
var parties = {enemy, hero, undefined};

function Character (name, x, y, lifes, party){
  this.position = {x,y} || {0,0};
  this.name = name || 'name not defined';
  this.lifes = lifes || 0;
  this.party = party || party.undefined;
}
function King (x, y){
  Character.apply(this, ['King',x, y, 100, parties.hero]);

  King.prototype.update = function () {

  };
  King.prototype.getInput = function () {

  };

  King.prototype.moveX = function (direction) {


  };
  King.prototype.jump = function (){


  };
}
King.prototype = Object.create(Character.prototype);
King.prototype.constructor = King;

function Enemy () {

}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
