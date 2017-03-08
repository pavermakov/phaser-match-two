import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    this.CENTERX = this.world.centerX;
    this.CENTERY = this.world.centerY;
    this.cardWidth = this.cache.getImage('back').width;

    this.fadeComplete = false;
  }

  create() {
    // background
    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'wall');

    // "HOW TO PLAY" text on the top
    this.header = this.add.bitmapText(this.CENTERX, 100, 'minecraftia', 'HOW TO PLAY:', 34);
    this.header.anchor.setTo(0.5);

    // cards on the left
    this.front1 = this.add.sprite(this.CENTERX - this.cardWidth, this.header.bottom + 100, 'card1');
    this.front1.anchor.setTo(0.5);
    this.front1.scale.x = 0;
    this.back1 = this.add.sprite(this.CENTERX - this.cardWidth, this.header.bottom + 100, 'back');
    this.back1.anchor.setTo(0.5);
    
    // cards on the right
    this.front2 = this.add.sprite(this.CENTERX + this.cardWidth, this.header.bottom + 100, 'card1');
    this.front2.anchor.setTo(0.5);
    this.front2.scale.x = 0;
    this.back2 = this.add.sprite(this.CENTERX + this.cardWidth, this.header.bottom + 100, 'back');
    this.back2.anchor.setTo(0.5);
    
    // hand
    this.hand = this.add.sprite(-100, this.front1.y, 'hand');
    this.hand.anchor.setTo(0.5);

    // instructions under the cards
    this.footer = this.add.bitmapText(this.CENTERX, this.front1.bottom + 75, 'minecraftia', 'MATCH 2 CARDS TO\nCLEAR THE BOARD', 30);
    this.footer.anchor.setTo(0.5);

    // action to play the game
    if(Phaser.Device.desktop) {
      this.add.bitmapText(this.CENTERX, this.world.height - 100, 'minecraftia', 'CLICK TO PLAY', 20).anchor.setTo(0.5);
    }

    // reveal the stage
    this.camera.flash(0x000);
    this.camera.onFlashComplete.add(() => {
      this.fadeComplete = true;
      this._playAnimation();
    }, this);

    this.input.onDown.add(this._nextState, this);
  }

  _playAnimation() {
    // hand animation
    const moveToFirstCard = this.add.tween(this.hand).to({ x: this.back1.x }, 1000, Phaser.Easing.Cubic.Out, true);
    const moveToSecondCard = this.add.tween(this.hand).to({ x: this.back2.x }, 1000, Phaser.Easing.Cubic.Out, false, 100);
    const moveOutside = this.add.tween(this.hand).to({ x: this.world.width + 100 }, 1000, Phaser.Easing.Cubic.Out, false, 100);
    
    // bug with chaining tweens with array params (they are repeated forever)
    // TODO: fix it!
    const click1 = this.add.tween(this.hand.scale).to({ x: [0.7, 1], y: [0.7, 1] }, 100, Phaser.Easing.Linear.None, false);
    const click2 = this.add.tween(this.hand.scale).to({ x: [0.7, 1], y: [0.7, 1] }, 100, Phaser.Easing.Linear.None, false);

    // card1 animation
    const back1Flip = this.add.tween(this.back1.scale).to({ x: 0 }, 75, Phaser.Easing.Linear.None, false);
    const front1Flip = this.add.tween(this.front1.scale).to({ x: 1 }, 75, Phaser.Easing.Linear.None, false);

    // card2 animation
    const back2Flip = this.add.tween(this.back2.scale).to({ x: 0 }, 75, Phaser.Easing.Linear.None, false);
    const front2Flip = this.add.tween(this.front2.scale).to({ x: 1 }, 75, Phaser.Easing.Linear.None, false);

    moveToFirstCard.chain(click1, back1Flip, front1Flip, moveToSecondCard, click2, back2Flip, front2Flip, moveOutside);
  }

  _nextState() {
    if(this.fadeComplete) {
      this.camera.fade(0x000, 500);

      this.camera.onFadeComplete.add(() => {
        this.state.start('Game');
      }, this);
    }  
  }
} 
