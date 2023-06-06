'use strict';

const { Deck } = require('./src/deck.js');
const { Player } = require('./src/player.js');

const deck = new Deck();
const player1 = new Player('Player1');

deck.generateDeck();
deck.shuffleDeck();
deck.dealCards(player1);

console.log(deck.cards.length);
