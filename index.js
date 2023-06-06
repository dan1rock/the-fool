'use strict';

const { Deck } = require('./src/deck.js');
const { Player } = require('./src/player.js');

const deck = new Deck();
const players = [];
players.push(new Player('Player1'));
players.push(new Player('Player2'));

deck.generateDeck();
deck.shuffleDeck();
deck.defineTrump();
deck.dealCards(players[0]);
deck.dealCards(players[1]);
console.log(deck.defineFirstTurn(players));

console.log(deck.cards.length);
