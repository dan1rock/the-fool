'use strict';

const { Board } = require('./board.js');

const startNewGame = (event) => {
  const board = new Board();

  board.createBoard('Player1', 'Player2');

  event.target.removeEventListener('click', startNewGame);

  document.querySelector('.startPage').style.display = 'none';
  document.querySelector('.game__body').style.display = 'grid';
};

module.exports = { startNewGame };
