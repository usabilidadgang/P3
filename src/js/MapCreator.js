'use strict';
var characters = require('./Characters.js');

function CreateMap (Jsonfile, escene){
      escene.map = escene.game.add.tilemap(Jsonfile);
        //Utilizaremos siempre la misma hoja de patrones, por tanto, no necesitamos pasarla por
        //variable.
      escene.map.addTilesetImage('sheet', 'tiles');
      escene.game.physics.arcade.TILE_BIAS = 40;

        //Creamos las capas de nuestro tilemap
      escene.back = escene.map.createLayer('Back');
      escene.death = escene.map.createLayer('Death');
      escene.ground = escene.map.createLayer('Ground');
      //escene.spawn = escene.map.createLayer('spawn');

        //Declaramos las colisiones con la muerte y el Suelo
      escene.map.setCollisionBetween(1, 5000, true, 'Death');
      escene.map.setCollisionBetween(1, 5000, true, 'Ground');

      escene.ground.setScale(3,3);
      escene.back.setScale(3,3);
      escene.death.setScale(3,3);
      //this.spawn.setScale(3,3);

      //escene.spawn.visible = false;
      escene.game.stage.backgroundColor = '#a9f0ff';
    }

module.exports = {
CreateMap: CreateMap
};
