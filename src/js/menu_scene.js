var MenuScene = {
  preload: function () {
    this.optionCount = 1;
  },
  create: function () {
      this.intromusic = this.game.add.audio('intromusic');
      this.intromusic.loop = true;
      this.intromusic.play();
      this.game.world.setBounds(0,0,800,600);
      this.game.stage.backgroundColor = "#000000";
      var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY/2, 'logo');
      logo.anchor.setTo(0.5, 0.5);
      logo.scale.setTo(0.75, 0.75);
      this.addMenuOption('Jugar', function (e) {
          this.intromusic.destroy();
          this.game.click.play(false);
          this.game.state.start('preloader');
      });
      this.addMenuOption('Creditos', function (e) {
          this.intromusic.destroy();
          this.game.click.play(false);
          this.game.state.start("creditos");
      });
      this.addMenuOption('GitHub', function (e) {
        this.intromusic.destroy();
        this.game.click.play(false);
        window.open("https://github.com/Kekstar");
      });
  },
  addMenuOption: function(text, callback) {
    var optionStyle = { font: '40pt Astloch', fontVariant: 'Bold', fill: 'yellow', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var button =  this.game.add.button(this.game.world.centerX, (this.optionCount * 80)+300, 'button', callback, this, 2, 1, 0);
    var txt = this.game.add.text(0,0, text, optionStyle);
    txt.anchor.set(0.5);
    button.anchor.set(0.5);
    button.addChild(txt);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "yellow";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
      };
      txt.useHandCursor = true;
      txt.inputEnabled = true;
      txt.events.onInputUp.add(callback, this);
      txt.events.onInputOver.add(onOver, this);
      txt.events.onInputOut.add(onOut, this);

      this.optionCount ++;
    }
};

module.exports = MenuScene;
