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

    this.openedCards = [];
    this.blockedUI = false;
  }

  create() {
    // background
    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'wall');

    // cards
    this.cards = this.add.group();

    // sound button
    this.sound = this.add.button(this.world.width - 15, this.world.height - 15, 'sound', null, this);
    this.sound.anchor.setTo(1);

    this._createBoard();

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
  }

  _handleInput(card) {
    if(!this.blockedUI && this.openedCards.indexOf(card) === -1) {
      this.blockedUI = true;

      this._flipCard(card);
      this.openedCards.push(card);

      this.time.events.add(500, () => {
        if(this.openedCards.length === 2) {
          this._checkMatch();
        }
        
        this.blockedUI = false;
      }, this); 
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
  }

  _checkMatch() {
    const [ card1, card2 ] = this.openedCards;

    if(card1.key === card2.key) {
      // fade them out and check if the game is over
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
  }

  _removeCard(card) {
    this.cards.removeChild(card);

    if(this.cards.length === 0) {
      this._gameOver();
    }
  }

  _gameOver() {
    console.log('Game over');
  }
}
