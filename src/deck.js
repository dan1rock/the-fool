'use strict';

const { Card } = require('./card.js');

class Deck extends Card {
  constructor() {
    super();
    this.cards = [];
    this.discardedCards = [];
    this.trump = null;

    this.$deck = null;
    this.$opponentHand = null;
    this.$playerHand = null;
  }

  generateDeck() {
    const suits = ['spades', 'diamonds', 'hearts', 'clubs'];
    const ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const values = [6, 7, 8, 9, 10, 11, 12, 13, 14];

    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < ranks.length; j++) {
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

      if (this.$deck.childNodes.length > 0) {
        if (player.name === 'Player1') {
          this.$playerHand.appendChild(this.$deck.childNodes[0]);
        } else {
          this.$opponentHand.appendChild(this.$deck.childNodes[0]);
        }
      }
    }
  }

  defineTrump() {
    if (this.cards.length > 0) {
      this.trump = this.cards[this.cards.length - 1];
    }
  }

  defineFirstTurn(players) {
    let minValue = 15;
    let firstTurn;

    for (const p of players) {
      for (const c of p.cards) {
        if (c.value < minValue && c.suit === this.trump.suit) {
          minValue = c.value;
          firstTurn = p.name;
        }
      }
    }

    if (minValue === 15) return players[0].name;

    return firstTurn;
  }

  renderDeck() {
    this.$deck = document.querySelector('.deck');
    this.$opponentHand = document.querySelector('.opponentHand');
    this.$playerHand = document.querySelector('.playerHand');

    let indent = 0;

    this.cards.forEach((c, i, d) => {
      const card = super.renderCard(c);

      if (c === d[d.length - 1]) {
        card.classList.add('card__trump');
      } else {
        card.style.right = `${indent}em`;
        card.style.bottom = `${indent}em`;
        indent += 0.02;
      }

      this.$deck.appendChild(card);
    });
  }

  clearDeck() {
    this.cards = [];
    this.discardedCards = [];
    this.trump = null;
  }
}

module.exports = { Deck };
