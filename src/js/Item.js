function Item(x, y, spritename, escene){

  Phaser.Sprite.call(this, escene.game, x, y,spritename);
  escene.game.add.existing(this);
  this.scale.setTo(3, 3);
  //Cambiamos el ancla del sprite al centro.
  this.anchor.setTo(0.5,0.5);
  this.startposition = {x:x, y:y} || {x:0, y:0};
  this.name = name || 'name not defined';
  }
}
Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

function Cofre(x,y,escene) {
  Item.call(this, [x,y,"cofre",escene])
}
Cofre.prototype = Object.create(Item.prototype);
Cofre.prototype.constructor = Cofre;
function FinNivel(x,y,escene) {
  Item.call(this, [x,y,"stairs",escene])
}
FinNivel.prototype = Object.create(Item.prototype);
FinNivel.prototype.constructor = FinNivel;
module.exports = {
  Cofre : Cofre,
  FinNivel : FinNivel 
}