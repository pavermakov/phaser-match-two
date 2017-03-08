import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    this.CENTERX = this.world.centerX;
    this.CENTERY = this.world.centerY;
  }

  create() {
    // background
    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'wall');

    // logo
    this.logo = this.add.sprite(this.CENTERX, this.CENTERY, 'logo');
    this.logo.anchor.setTo(0.5);

    // play button
    this.play = this.add.button(this.CENTERX, this.CENTERY + 50, 'play', this._nextState, this, 1, 0);
    this.play.anchor.setTo(0.5);

    // apply animations to the interface
    this._insertUI();
  }

  _insertUI() {
    const linear = Phaser.Easing.Linear.None;
    const back = Phaser.Easing.Back.Out;
    const cubic = Phaser.Easing.Cubic.InOut;

    // animate logo
    const revealLogo = this.add.tween(this.logo).from({ alpha: 0 }, 1000, linear, true, 300);
    const enlargeLogo = this.add.tween(this.logo.scale).from({ x: 0.01, y: 0.01 }, 1000, back, true, 300);
    const moveLogo = this.add.tween(this.logo).to({ y: this.CENTERY * 0.5 }, 700, cubic, false, 350);
    const revealPlay = this.add.tween(this.play).from({ alpha: 0 }, 1000, linear, true, 2000);
    const revealSound = this.add.tween(this.sound).from({ alpha: 0 }, 1000, linear, true, 1000);

    enlargeLogo.chain(moveLogo);
  }

  _nextState() {
    this.camera.fade(0x000, 500);

    this.camera.onFadeComplete.add(() => {
      this.state.start('Instructions');
    }, this);
  }
} 
