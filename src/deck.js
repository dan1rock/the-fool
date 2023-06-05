import card from './card.js';

class Deck{
	constructor() {
		this.cards = [];
		this.discardedCards = [];
		this.trump = null;
	}

	generateDeck(){
		const suits = ['spades', 'diamonds', 'hearts', 'clubs'];
		const ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		const values = [6, 7, 8, 9, 10, 11, 12, 13, 14];

		for (let i = 0; i < suits.length; i++) {
			for (let j = 0; j < ranks.length; j++){
				this.cards.push(new card(suits[i], ranks[j], values[j]));
			}
		}
	}
}

export default { Deck };