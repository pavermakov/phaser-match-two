import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    this.variations = [
      'card1', 'card1',
      'card2', 'card2',
      'card3', 'card3',
      'card4', 'card4',
      'card5', 'card5',
      'card6', 'card6',
      'card7', 'card7',
      'card8', 'card8',
    ];

    this.CENTERX = this.world.centerX;
    this.CENTERY = this.world.centerY;
    this.elapsedTime = 0;
    this.totalMoves = 0;
    this.openedCards = [];
    this.blockedUI = false;
  }

  create() {
    // !!! ORDER MATTERS !!!

    // background
    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'wall');

    // cards 
    this.cards = this.add.group();

    // overlay
    this.overlay = this.add.sprite(0, 0, this._createOverlayTexture());
    this.overlay.alpha = 0;

    // timer in the top left corner
    this.gameTimeText = this.add.bitmapText(10, 0, 'minecraftia', 'TIME: 0' , 30);
    this.gameTimer = this.time.create(false);
    this.gameTimer.loop(1000, this._incrementTimer, this);
    this.gameTimer.start();

    // moves counter in the top right corner
    this.movesCounterText = this.add.bitmapText(this.world.width - 10, 0, 'minecraftia', 'MOVES: 0' , 30);
    this.movesCounterText.anchor.setTo(1, 0);

    // sound button in the bottom right corner
    this.soundControl = this.add.button(this.world.width - 15, this.world.height - 15, 'sound', this._toggleSound, this);
    this.soundControl.scale.setTo(0.8);
    this.soundControl.anchor.setTo(1);
    this.soundControl.frame = this.sound.mute ? 1 : 0;

    this._createBoard();

    // win text
    this.winText = this.make.bitmapText(this.CENTERX, this.world.height * 0.25, 'minecraftia', 'YOU WON!', 30);
    this.winText.anchor.setTo(0.5);

    // play again text
    this.playAgainText = this.make.bitmapText(this.CENTERX, this.world.height * 0.75, 'minecraftia', 'PLAY AGAIN?', 30);
    this.playAgainText.anchor.setTo(0.5);
    this.playAgainText.inputEnabled = true;
    this.playAgainText.input.useHandCursor = true;
    this.playAgainText.events.onInputDown.add(this._restart, this);

    // sounds
    this.flipSound = this.add.audio('flip', 0.5, false);
    this.matchSound = this.add.audio('match', 0.5, false);

    // reveal the stage
    this.camera.flash(0x000);
  }

  _createBoard() {
    let card;
    let key;
    let index;
    let horizontalGap = 97;
    let verticalGap = 120;

    for(let row = 1; row <= 4; row++) {
      for(let col = 1; col <= 4; col++) {
        key = this.rnd.pick(this.variations);
        index = this.variations.indexOf(key);

        card = this.cards.create(row * horizontalGap, col * verticalGap, 'back');
        card.inputEnabled = true;
        card.input.useHandCursor = true;
        card.anchor.setTo(0.5);
        card.scale.setTo(0.8);
        card.data.key = key;

        card.events.onInputDown.add(this._handleInput, this);

        this.variations.splice(index, 1);
      }
    }

    this.cards.centerX = this.CENTERX;
    this.cards.centerY = this.CENTERY;

    this.cards.children.forEach((card) => {
      this.add.tween(card).from({ x: this.CENTERX, y: -200 }, 800, Phaser.Easing.Linear.None, true);
    }, this);
  }

  _handleInput(card) {
    if(!this.blockedUI && this.openedCards.indexOf(card) === -1) {
      this.blockedUI = true;

      this._flipCard(card);
      this.openedCards.push(card);


      if(this.openedCards.length === 2) {
        this.time.events.add(500, this._checkMatch, this); 
      } else {
        this.blockedUI = false;
      }
    }
  }

  _flipCard(card) {
    this.add.tween(card.scale).to({ x: 0 }, 75, Phaser.Easing.Linear.None, true).onComplete.add(() => {
      if(card.key === 'back') {
        card.loadTexture(card.data.key);
      } else {
        card.loadTexture('back');
      }

      this.add.tween(card.scale).to({ x: 0.8 }, 75, Phaser.Easing.Linear.None, true);     
    }, this);

    this.flipSound.play();
  }

  _checkMatch() {
    const [ card1, card2 ] = this.openedCards;

    if(card1.key === card2.key) {
      this.matchSound.play();
      // fade them out and check if the game is over
      // TODO: simplify, separate into 2 functions
      this.openedCards.forEach((card) => {
        this.add.tween(card).to({ y: '-100', alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
          .onComplete.add(this._removeCard, this);
      }, this);
         
    } else {
      this._flipCard(card1);
      this._flipCard(card2);
    }

    // clearing the opened cards array
    this.openedCards.length = 0;
    this.blockedUI = false;
    this._incrementMoves();
  }

  _removeCard(card) {
    this.cards.removeChild(card);

    if(this.cards.length === 0) {
      this._gameOver();
    }
  }

  _incrementTimer() {
    this.elapsedTime += 1;
    this.gameTimeText.text = `TIME: ${this.elapsedTime}`;
  }

  _incrementMoves() {
    this.totalMoves += 1;
    this.movesCounterText.text = `MOVES: ${this.totalMoves}`;
  }

  _toggleSound() {
    this.sound.mute = !this.sound.mute;
    this.soundControl.frame = this.sound.mute ? 1 : 0;
  }

  _createOverlayTexture() {
    const bmd = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    bmd.fill(0, 0, 0, 0.95);

    return bmd;
  }

  _toggleOverlay() {
    this.add.tween(this.overlay).to({ alpha: 1 }, 1000, 'Linear', true);
  }

  _shiftResults() {
    this.add.tween(this.gameTimeText).to({ centerX: this.CENTERX, centerY: this.CENTERY - 25 }, 1000, 'Linear', true);
    return this.add.tween(this.movesCounterText).to({ centerX: this.CENTERX, centerY: this.CENTERY + 25 }, 1000, 'Linear', true);
  }

  _revealEndText() {
    this.add.existing(this.winText);
    this.add.existing(this.playAgainText);
  }

  _gameOver() {
    this.gameTimer.stop();
    this.soundControl.visible = false;
    
    // game over animation
    this._toggleOverlay();

    // shift game timer and moves counter
    this._shiftResults().onComplete.add(this._revealEndText, this);
  }

  _restart() {
    this.camera.fade(0x000, 500);

    this.camera.onFadeComplete.add(() => {
      this.state.start('Game');
    }, this);
  }
}
