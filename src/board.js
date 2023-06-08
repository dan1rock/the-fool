'use strict';

const { Player } = require('./player.js');
const { Deck } = require('./deck.js');
const { startNewGame } = require('./start.js');

class Board {
  constructor() {
    this.players = [];
    this.deck = new Deck();
    this.turn = '';
    this.turnState = '';
    this.isDiscard = false;
  }

  createBoard(player1, player2) {
    this.players.push(new Player(player1), new Player(player2));

    this.deck.generateDeck();
    this.deck.shuffleDeck();

    this.deck.defineTrump();

    this.deck.renderDeck();

    this.deck.dealCards(this.players[0], this);
    this.deck.dealCards(this.players[1], this);

    this.turn = this.deck.defineFirstTurn(this.players);
    this.turnState = `${this.turn}Attack`;

    this.whoTurn();
  }

  whoTurn() {
    if (this.turn === 'Player2') {
      this.turnState = `${this.turnState}`;
      this.pcTurn();
    } else if (this.turn === 'Player1') {
      this.turnState = `${this.turnState}`;
      Player.attack();
    }
  }

  pcTurn() {
    if (
      this.turn === 'Player2' &&
        this.turnState === 'Player2Attack'
    ) {
      // eslint-disable-next-line max-len
      const minCard = this.deck.findMinValCard(this.players[1].cards, this.deck.trump);
      const $firstCard = function() {
        const $pcHandCards = document.querySelector('.opponentHand').children;
        if ($pcHandCards.length > 0) {
          for (let i = 0; i < $pcHandCards.length; i++) {
            if ($pcHandCards[i].dataset.rank === minCard.rank &&
                $pcHandCards[i].dataset.suit === minCard.suit) {
              return $pcHandCards[i];
            }
          }
        } else {
          return $pcHandCards[0];
        }
      }();

      this.getCardsForDefer($firstCard);

      Player.attack('pcAttack', $firstCard, this.players[1].name);

      this.turn = 'Player1';
      this.turnState = 'Player1Defer';

      if (this.deck.cardsForDefer.length < 1) {
        this.deck.takeCardsToHand(this.players[1], this.players, this);
        this.turn = 'Player2';
        this.turnState = 'Player2Attack';
      }
    }

    if (
      this.turn === 'Player2' &&
        this.turnState === 'Player2Defer'
    ) {
      if (this.deck.cardsForDefer.length > 0) {
        for (let c = 0; c < this.deck.cardsForDefer.length; c++) {
          for (let $c = 0; $c < this.deck.$opponentHand.children.length; $c++) {

            if (
            // eslint-disable-next-line max-len
              this.deck.$opponentHand.children[$c].dataset.suit === this.deck.cardsForDefer[c].suit &&
                // eslint-disable-next-line max-len
                this.deck.$opponentHand.children[$c].dataset.rank === this.deck.cardsForDefer[c].rank &&
                this.turnState === 'Player2Defer'
            ) {

              // eslint-disable-next-line max-len
              Player.attack('pcDefer', this.deck.$opponentHand.children[$c], this.players[1].name);

              this.turn = 'Player2';
              this.turnState = 'Player2Attack';

              this.isDiscard = true;
              this.deck.addCardsToDiscard(this.players);
            }

          }
        }

      } else {
        this.deck.takeCardsToHand(this.players[1], this.players, this);

        this.turn = 'Player1';
        this.turnState = 'Player1Attack';
      }
    }
  }

  addListener($clickedCard) {
    const that = this;
    $clickedCard.addEventListener('click', addCardToTable);
    function addCardToTable() {
      function playerTakeStep(turnState) {
        Player.attack(turnState, $clickedCard);
        $clickedCard.removeEventListener('click', addCardToTable);
      }

      if (
        that.turn === 'Player1' &&
          that.turnState === 'playerAttack' &&
          !that.isDiscard
      ) {
        playerTakeStep(that.turnState);

        that.getCardsForDefer($clickedCard);

        that.turn = 'Player2';
        that.turnState = 'Player2Defer';

        if (that.deck.defenceCards.length > 0) {
          that.isDiscard = true;
          that.deck.addCardsToDiscard(that.players);
          that.pcTurn();

        } else {
          that.deck.takeCardsToHand(that.players[0], that.players, this);

          that.turn = 'Player1';
          that.turnState = 'Player1Attack';
        }
      }

      if (
        that.turn === 'Player1' &&
          that.turnState === 'Player1Defer'
      ) {
        for (let c = 0; c < that.deck.cardsForDefer.length; c++) {
          if (
            that.deck.cardsForDefer[c].suit === $clickedCard.dataset.suit &&
              that.deck.cardsForDefer[c].rank === $clickedCard.dataset.rank
          ) {
            playerTakeStep(that.turnState);

            that.showCardsForDefer({ isShow: false });


            if (that.deck.cardsForDefer.length > 0) {
              that.deck.addCardsToDiscard(that.players);
              that.pcTurn();

              that.isDiscard = true;

              that.turn = 'Player1';
              that.turnState = 'Player1Attack';

            } else {
              that.deck.takeCardsToHand(that.players[1], that.players, this);

              that.turn = 'Player2';
              that.turnState = 'Player2Attack';
            }
          }
        }
      }
    }
  }

  getCardsForDefer($card) {
    this.deck.cardsForDefer = [];
    let playerCards;

    if (this.turn === 'Player1') {
      playerCards = this.players[1].cards;
    } else if (this.turn === 'Player2') {
      playerCards = this.players[0].cards;
    }

    for (let c = 0; c < playerCards.length; c++) {
      if (
        this.deck.trump.suit === playerCards[c].suit &&
          playerCards[c].value > $card.dataset.value ||

          $card.dataset.suit === playerCards[c].suit &&
          playerCards[c].value > $card.dataset.value ||

          $card.dataset.suit !== this.deck.trump.suit &&
          this.deck.trump.suit === playerCards[c].suit
      ) {
        this.deck.defenceCards.push(playerCards[c]);
      }
    }

    // сортируем карты от меньшего к большему - сперва обычные, потом козыри
    this.deck.defenceCards.sort((a, b) => a.value - b.value);
    this.deck.defenceCards.sort((a, b) =>
      a.suit === this.deck.trump.suit > b.suit !== this.deck.trump.suit);

    this.showCardsForDefer({ isShow: true });

    console.log('Карты, которыми можно крыть: ', ...this.deck.defenceCards);
  }

  showCardsForDefer(options) {
    setTimeout(() => {
      for (let $c = 0; $c < this.deck.$playerHand.children.length; $c++) {
        this.deck.$playerHand.children[$c].classList.remove('cardsForDefer');

        if (options.isShow) {
          for (let c = 0; c < this.deck.defenceCards.length; c++) {
            if (
            // eslint-disable-next-line max-len
              this.deck.defenceCards[c].suit === this.deck.$playerHand.children[$c].dataset.suit &&
                // eslint-disable-next-line max-len
                this.deck.defenceCards[c].rank === this.deck.$playerHand.children[$c].dataset.rank
            ) {
              this.deck.$playerHand.children[$c].classList.add('cardsForDefer');
            }
          }
        }
      }
    }, 1000);
  }

  newRound() {
    if (
      this.players[0].cards.length > 0 &&
        this.players[1].cards.length > 0
    ) {
      this.deck.dealCards(this.players[0], this);
      this.deck.dealCards(this.players[1], this);
      this.isDiscard = false;
      this.whoTurn();

    } else {
      document.querySelector('.game__body').style.display = 'none';
      document.querySelector('.winPage').style.display = 'flex';
      document.querySelector('.winPage__newGameBtn')
        .addEventListener('click', startNewGame);

      // кто выйграл?
      const winPageTitle = document.querySelector('.winPage__title');
      this.players[0].cards.length === 0 &&
      this.players[1].cards.length === 0 ?
        winPageTitle.innerHTML = `GAME OVER! <br/><br/> DRAW IN THE GAME!` :
        this.players[0].cards.length > 0 ?
        // eslint-disable-next-line max-len
          winPageTitle.innerHTML = `GAME OVER! <br/><br/> THE ${this.players[1].name().toUpperCase()} WIN!` :
          winPageTitle.innerHTML = `GAME OVER! <br/><br/> YOU WIN!`;
    }
  }
}

module.exports = { Board };
