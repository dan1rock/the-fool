'use strict';

class Player {
  constructor(name) {
    this.name = name;
    this.cards = [];
  }

  static attack(turn, $card, whoTurn = 'Your') {
    const $table = document.querySelector('.table');
    const $actionBtn = document.querySelector('.actionBtn');
    $actionBtn.classList.add('active');

    const throwCard = ($c) => $table.appendChild($c);

    switch (turn) {
    case 'Player2':
      $actionBtn.innerHTML = `${whoTurn} Turn`;
      setTimeout(() => {
        throwCard($card);
        $actionBtn.innerHTML = `Your Turn`;
      }, 1000);
      break;

    case 'Player1':
      $actionBtn.innerHTML = `${whoTurn} Turn`;
      setTimeout(() => {
        throwCard($card);
        $actionBtn.innerHTML = 'Discard!';
        $actionBtn.classList.add('discardState');
      }, 1000);
      break;

    case 'playerAttack':
      throwCard($card);
      $actionBtn.innerHTML = 'Turn!';
      break;

    case 'playerDefer':
      throwCard($card);
      $actionBtn.innerHTML = 'Discard!';
      $actionBtn.classList.add('discardState');
      break;

    default:
      $actionBtn.innerHTML = `${whoTurn} Turn`;
      $actionBtn.classList.remove('discardState', 'grabState');
    }
  }
}

module.exports = { Player };
