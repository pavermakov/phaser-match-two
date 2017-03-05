import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = 'black';
    this.stage.disableVisibilityChange = false;
    this.stage.smoothed = false;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.renderer.renderSession.roundPixels = true;
  }

  preload() {
    this.load.image('bar', 'assets/images/preloader-bar.png');
  }

  create() {
    this.game.state.start('Preload');
  }
}
