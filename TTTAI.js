let ogBoard;
const humanPlayer = "O";
const aiPlayer = "X";
const cells = document.querySelectorAll(".cell");
const winCombs = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startGame();

function startGame() {
  document.querySelector(".winText").style.display = "none";
  ogBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    document.getElementById(i).style.color = "#fff";
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(elem) {
  if (typeof ogBoard[elem.target.id] == "number") {
    turn(elem.target.id, humanPlayer);
    if (!checkWin(ogBoard, humanPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer);
  }
}

function turn(elemId, player) {
  ogBoard[elemId] = player;
  document.getElementById(elemId).innerText = player;
  let gameWon = checkWin(ogBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombs.entries()) {
    if (win.every((el) => plays.indexOf(el) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombs[gameWon.index]) {
    document.getElementById(index).style.color =
      gameWon.player == humanPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == humanPlayer ? "You Win!" : "You Lose!");
}

function declareWinner(who) {
  document.querySelector(".winText").innerText = who;
  document.querySelector(".winText").style.display = "block";
}

function bestSpot() {
  return minimax(ogBoard, aiPlayer).index;
}

function emptyCell() {
  return ogBoard.filter((s) => typeof s == "number");
}

function checkTie() {
  if (emptyCell().length === 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.color = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  let availSpots = emptyCell();

  if (checkWin(newBoard, humanPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      let result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
