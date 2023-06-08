'use strict';

const { Player } = require('./player.js');
const { Deck } = require('./deck.js');

class Board {
  constructor() {
    this.players = [];
    this.deck = new Deck();
    this.turn = '';
  }

  createBoard(player1, player2) {
    this.players.push(new Player(player1), new Player(player2));

    this.deck.generateDeck();
    this.deck.shuffleDeck();

    this.deck.defineTrump();

    this.deck.renderDeck();

    this.deck.dealCards(this.players[0]);
    this.deck.dealCards(this.players[1]);

    this.turn = this.deck.defineFirstTurn(this.players);
  }
}

module.exports = { Board };
