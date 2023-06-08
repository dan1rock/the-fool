'use strict';

const { Deck } = require('../src/deck.js');
const { Player } = require('../src/player.js');
const { Card } = require('../src/card');

const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('./src/index.html', 'utf8');

const dom = new JSDOM(html, {
  url: 'http://localhost'
});
const { document } = dom.window;

test('Newly generated deck length must be 36', () => {
  const deck = new Deck();
  deck.generateDeck();

  expect(deck.cards.length).toBe(36);
});

test('Dealed cards are removed from deck', () => {
  const deck = new Deck();
  const player = new Player('Player');

  deck.generateDeck();
  deck.$deck = document.querySelector('.deck');
  deck.dealCards(player);

  expect(deck.cards.length).toBe(30);
  expect(player.cards.length).toBe(6);
});

test('Trump defined properly', () => {
  const deck = new Deck();

  deck.generateDeck();
  deck.shuffleDeck();
  deck.defineTrump();

  expect(deck.trump).toBe(deck.cards[deck.cards.length - 1]);
});

test('First turn defined properly', () => {
  const deck = new Deck();
  const player1 = new Player('Player1');
  const player2 = new Player('Player2');

  deck.generateDeck();
  deck.shuffleDeck();
  deck.defineTrump();

  for (const c of deck.cards) {
    if (c.suit === deck.trump.suit && c.value === 6) {
      deck.cards.splice(deck.cards.indexOf(c), 1);
    }
  }

  player1.cards.push(new Card(deck.trump.suit, '6', 6));
  deck.$deck = document.querySelector('.deck');
  deck.dealCards(player1);
  deck.dealCards(player2);

  expect(deck.defineFirstTurn([player1, player2])).toBe('Player1');
});

test('Deck is cleared properly', () => {
  const deck = new Deck();

  deck.generateDeck();
  deck.shuffleDeck();
  deck.clearDeck();

  expect(deck.cards.length).toBe(0);
  expect(deck.discardedCards.length).toBe(0);
  expect(deck.trump).toBe(null);
});
