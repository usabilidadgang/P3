var GameOver = {
    create: function () {
      this.music = this.game.add.audio('levelSuccess');
      this.music.volume = 0.5;
      this.music.play();
      this.game.stage.backgroundColor = '#ffffff';
        if(this.game.niveles[this.game.nivelActual+1] !== undefined){
          this.game.nivelActual++;
          var button = this.game.add.button(400, 300,
                                            'button',
                                            this.continue,
                                            this, 2, 1, 0);
          button.anchor.set(0.5);

          var text = this.game.add.text(0, 0, "Sig. Nivel");
          text.font = 'Astloch';
          text.fill = 'white';

          text.fontSize = 40;
          text.anchor.set(0.5);
          button.addChild(text);
          button.anchor.set(0.5);
        }
        else {
          var endGameText = this.game.add.text(400, 300, "¡Acabaste el Juego!");
          endGameText.font = 'Astloch';
          endGameText.fontSize = 70;
          endGameText.anchor.set(0.5);

        }
        var scoreText = this.game.add.text(400, 200, "Puntuación global:"+this.game.overallScore);
        scoreText.font = 'Astloch';
        scoreText.fontSize = 70;
        scoreText.anchor.set(0.5);
        var goText = this.game.add.text(400, 100, "¡Nivel Completado!");
        goText.font = 'Astloch';
        goText.fontSize = 70;
        var button2 = this.game.add.button(400, 400,
                                          'button',
                                          this.goMenu,
                                          this, 2, 1, 0);
        button2.anchor.set(0.5);
        goText.anchor.set(0.5);
        var text2 = this.game.add.text(0, 0, "Menu");
        text2.font = 'Astloch';
        text2.fontSize = 40;
        text2.fill = 'white';
        text2.anchor.set(0.5);
        button2.addChild(text2);





    },
    //DONE 7 declarar el callback del boton.
    continue: function(){
      this.music.destroy();
      this.game.click.play(false);
      this.game.state.start('play');
    },

    goMenu: function(){
      this.music.destroy();
      this.game.click.play(false);
      this.game.state.start('menu');
    }
};

module.exports = GameOver;
