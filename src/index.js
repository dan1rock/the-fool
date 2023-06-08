'use strict';

require('./scss/index.scss');
const { startNewGame } = require('./start.js');

const newGameButton = '.startPage__newGameButton';
document.querySelector(newGameButton).addEventListener('click', startNewGame);
