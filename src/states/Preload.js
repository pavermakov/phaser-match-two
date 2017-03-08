import Phaser from 'phaser';

export default class extends Phaser.State {
  preload() {
    // индикатор загрузки
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.preloadBar);

    // подгрузи ассеты для всей игры здесь
    this.load.baseURL = 'assets/';

    this.load.image('logo', 'images/logo.png');
    this.load.image('card1', 'images/card1.png');
    this.load.image('card2', 'images/card2.png');
    this.load.image('card3', 'images/card3.png');
    this.load.image('card4', 'images/card4.png');
    this.load.image('card5', 'images/card5.png');
    this.load.image('card6', 'images/card6.png');
    this.load.image('card7', 'images/card7.png');
    this.load.image('card8', 'images/card8.png');
    this.load.image('back', 'images/card.png');
    this.load.image('hand', 'images/hand.png');
    this.load.image('wall', 'images/wall.png');

    this.load.spritesheet('play', 'images/play.png', 109, 54);
    this.load.spritesheet('sound', 'images/sound.png', 60, 50);

    this.load.bitmapFont('minecraftia', 'fonts/minecraftia.png', 'fonts/minecraftia.xml');

    this.load.audio('flip', ['audio/flip.mp3', 'audio/flip.ogg']);
    this.load.audio('match', ['audio/match.mp3', 'audio/match.ogg']);

    // по завершении загрузки ассетов, перейди в другой state
    this.load.onLoadComplete.add(() => {
      this.game.state.start('Menu');
    }, this);
  }
}
