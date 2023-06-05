import { Card } from './card.js';

class Deck {
	constructor() {
		this.cards = [];
		this.discardedCards = [];
		this.trump = null;
	}

	generateDeck() {
		const suits = ['spades', 'diamonds', 'hearts', 'clubs'];
		const ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		const values = [6, 7, 8, 9, 10, 11, 12, 13, 14];

		for (let i = 0; i < suits.length; i++) {
			for (let j = 0; j < ranks.length; j++){
				this.cards.push(new Card(suits[i], ranks[j], values[j]));
			}
		}
	}

	shuffleDeck() {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
	}

	dealCards(player) {
		for (let i = player.cards.length; i < 6; i++) {
			player.cards.push(...this.cards.splice(0, 1));
		}
	}
}

export { Deck };
