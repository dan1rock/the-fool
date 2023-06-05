import { Deck } from './src/deck.js';

const deck = new Deck();
deck.generateDeck();
deck.shuffleDeck();

console.log(deck.cards);