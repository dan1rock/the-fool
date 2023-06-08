'use strict';

const { Card } = require('./card.js');

class Deck extends Card {
  constructor() {
    super();
    this.cards = [];
    this.discardedCards = [];
    this.defenceCards = [];
    this.trump = null;

    this.$deck = null;
    this.$opponentHand = null;
    this.$playerHand = null;
    this.$discard = null;
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

  dealCards(player, board) {
    for (let i = player.cards.length; i < 6; i++) {
      player.cards.push(...this.cards.splice(0, 1));

      if (this.$deck.childNodes.length > 0) {
        if (player.name === 'Player1') {
          board.addListener(this.$deck.childNodes[0]);
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
    this.$discard = document.querySelector('.discard');

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

  addCardsToDiscard(playersHandCards, board) {
    const that = this;

    function addCardsToDiscard() {
      const $cardsInGame = document.querySelector('.table');

      const [player, pc] = playersHandCards;
      const cards = Array.prototype.slice.call($cardsInGame.children);

      function compareCards(hand) {
        for (let i = cards.length - 1; i >= 0; i--) {
          hand.cards.forEach((c, n) => {
            if (
              c.suit === cards[i].dataset.suit &&
                c.rank === cards[i].dataset.rank
            ) {
              that.discardedCards.push(...hand.cards.splice(n, 1));
            }
          });
        }
      }
      compareCards(player);
      compareCards(pc);

      while ($cardsInGame.childNodes.length > 0) {
        that.$discard.appendChild($cardsInGame.firstChild);
      }

      // начинаем новый уровень
      board.newRound();
    }

    setTimeout(() => addCardsToDiscard(), 2000);
  }

  takeCardsToHand(target, players, board) {
    const [player, pc] = players;

    const $actionBtn = document.querySelector('.actionBtn');
    $actionBtn.innerHTML = `Take a Card`;
    $actionBtn.classList.remove('discardState');
    $actionBtn.classList.add('grabState');

    function takeCards(board) {
      const $cardsInGame = document.querySelector('.table');
      const $playerHand = document.querySelector(`.playerHand`);
      const $pcHand = document.querySelector(`.pcHand`);

      for (let $c = $cardsInGame.children.length - 1; $c >= 0; $c--) {

        target.cards.forEach((c, i) => {
          if (
            c.suit === $cardsInGame.children[$c].dataset.suit &&
              c.rank === $cardsInGame.children[$c].dataset.rank
          ) {
            target.name() === player.name() ?
              pc.cards.push(...player.cards.splice(i, 1)) :
              player.cards.push(...pc.cards.splice(i, 1));
          }
        });
      }

      while ($cardsInGame.childNodes.length > 0) {
        const newCard = $cardsInGame.childNodes[0];

        if (target.name === 'Player2') {
          board.addListener(newCard);
        }

        target.name === 'Player1' ?
          $pcHand.appendChild(newCard) :
          $playerHand.appendChild(newCard);
      }

      board.newRound();
    }

    setTimeout(() => takeCards(board), 2500);
  }

  findMinValCard(cards, trump) {
    if (cards.length > 1) {
      const cardsWithoutTrump = cards.filter(c => c.suit !== trump.suit);
      const cardsWithTrump = cards.filter(c => c.suit === trump.suit);

      return cardsWithoutTrump.length > 0 ?
      // eslint-disable-next-line max-len
        cardsWithoutTrump.reduce((prev, curr) => (prev.value < curr.value ? prev : curr), 0) :
      // eslint-disable-next-line max-len
        cardsWithTrump.reduce((prev, curr) => (prev.value < curr.value ? prev : curr), 0);
    } else {
      return cards[0];
    }
  }

  clearDeck() {
    this.cards = [];
    this.discardedCards = [];
    this.trump = null;
  }
}

module.exports = { Deck };
