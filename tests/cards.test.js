'use strict';

const { Deck } = require('../src/deck.js');
const { Player } = require('../src/player.js');

test('Newly generated deck length must be 36', () => {
	const deck = new Deck();
	deck.generateDeck();

	expect(deck.cards.length).toBe(36);
});

test('Dealed cards are removed from deck', () => {
	const deck = new Deck();
	const player = new Player('Player');

	deck.generateDeck();
	deck.dealCards(player);

	expect(deck.cards.length).toBe(30);
	expect(player.cards.length).toBe(6);
});
