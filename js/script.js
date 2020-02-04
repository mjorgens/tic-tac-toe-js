const player = ['Player', 'Computer', 'Cat']; // Human, Computer, Tie
const marker = ['X', 'O'];
let currentBoard = Array(9);

let deletePrevious = (element) => {
  while (element.hasChildNodes()) {
    element.removeChild(element.firstChild);
  }
};

let buildBoard = () => {
  const parent = document.getElementById('board');
  // Delete board if previously played
  deletePrevious(parent);
  // Create board HTML
  let counter = 0;
  for (let i = 0; i < 3; i++) {
    let row = document.createElement('div');
    row.className = 'row';

    for (let j = 0; j < 3; j++) {
      let box = document.createElement('div');
      box.className = 'box';
      box.setAttribute('id', counter);
      box.setAttribute('onclick', 'playerTurn(this);');
      row.appendChild(box);
      counter++;
    }
    parent.appendChild(row);
  }

  document.getElementById('messageDisplay').innerText = 'Tic Tac Toe';
};

let turn = (divObject, currentPlayer) => {
  // Remove the ability to click again
  divObject.removeAttribute('onclick');
  // Add marker to board
  divObject.innerText = marker[currentPlayer];
  // Add move to board model
  currentBoard[Number(divObject.getAttribute('id'))] = currentPlayer;

  let winner = winnerCheck(currentBoard);

  if (winner !== -1) {
    return gameover(winner);
  }

  if (currentPlayer === 0) {
    return computerTurn();
  }
};

let playerTurn = (divObject) => {
  turn(divObject, 0);
};

let computerTurn = () => {
  let bestScore = -Infinity;
  let bestMove;
  // find the maximized score for computer and best move
  for (let i = 0; i < currentBoard.length; i++) {
    if (currentBoard[i] == null) {
      let copyBoard = [...currentBoard];
      copyBoard[i] = 1;
      let score = minimax(copyBoard, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  turn(document.getElementById(bestMove), 1);
};

let minimax = (board, maximizing) => {
  let winner = winnerCheck(board);

  // check for human win
  if (winner === 0) {
    return -10;
  }
  // check for computer win
  if (winner === 1) {
    return 10;
  }
  // check for tie
  if (winner === 2) {
    return 0;
  }

  let bestScore;
  if (maximizing) {
    bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] == null) {
        let copyBoard = [...board];
        copyBoard[i] = 1;
        let score = minimax(copyBoard, false);
        // find the maximized score
        if (score > bestScore) {
          bestScore = score;
        }
      }
    }
  } else {
    bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] == null) {
        let copyBoard = [...board];
        copyBoard[i] = 0;
        let score = minimax(copyBoard, true);
        // find the minimized score
        if (score < bestScore) {
          bestScore = score;
        }
      }
    }
  }
  return bestScore;
};

let disableBoard = () => {
  for (let i = 0; i < currentBoard.length; i++) {
    document.getElementById(i).removeAttribute('onclick');
  }
};

let gameover = (winner) => {
  document.getElementById('messageDisplay').innerText = `${player[winner]} Wins!`;
  document.getElementById('reset').classList.toggle('hidden');
  disableBoard();
};

let resetGame = () => {
  // reset variables
  currentBoard = Array(9);
  buildBoard();
  document.getElementById('reset').classList.toggle('hidden');
};

let winnerCheck = (board) => {
  // horziontal check
  for (let i = 0; i < board.length; i += 3) {
    if (board[i] === board[i + 1] && board[i + 1] === board[i + 2] && board[i] != null) {
      return board[i];
    }
  }
  // vertical check
  for (let i = 0; i < 3; i++) {
    if (board[i] === board[i + 3] && board[i + 3] === board[i + 6] && board[i] != null) {
      return board[i];
    }
  }
  // left->right check
  if (board[0] === board[4] && board[4] === board[8] && board[0] != null) {
    return board[0];
  }
  // right->left check
  if (board[2] === board[4] && board[4] === board[6] && board[2] != null) {
    return board[2];
  }
  // tie check
  if (tieCheck(board)) {
    return 2;
  }

  return -1;
};

let tieCheck = (board) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == null) {
      return false;
    }
  }
  return true;
};
