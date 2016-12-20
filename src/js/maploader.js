'use strict';

var MapLoader = {
    loadmap: function (Jsonfile){

      this.game.add.tilemap(Jsonfile);
        //Utilizaremos siempre la misma hoja de patrones, por tanto, no necesitamos pasarla por
        //variable.
      this.addTilesetImage('sheet', 'tiles');

        //Creamos las capas de nuestro tilemap
        this.death = this.createLayer('Death');
        this.ground = this.createLayer('Ground');
        this.back = this.createLayer('Back');

        //Declaramos las colisiones con la muerte y el Suelo
        this.setCollisionBetween(1, 5000, true, 'Death');
        this.setCollisionBetween(1, 5000, true, 'Ground');
      }
}
module.exports = MapLoader;
