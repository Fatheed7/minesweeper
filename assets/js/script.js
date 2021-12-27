const gameArea = document.getElementById("game-area");
let adjacent = 0;
const bombCells = [];
let gameWidth;

$("document").ready(function () {
  leftClick();
  rightClick();
});

window.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);

function newGame(rows, cols) {
  gameSize(rows, cols);
  applyStyle(rows, cols);
}

function gameSize(rows, cols) {
  clearGame();
  const gameBoard = [];
  for (let x = 0; x < rows; x++) {
    const row = [];
    for (let y = 0; y < cols; y++) {
      let squareInner = document.createElement("div");
      gameArea.appendChild(squareInner).className = "ms-cell untouched";

      const cell = {
        x,
        y,
      };
      row.push(cell);
    }
    gameBoard.push(row);
  }
  console.log(gameBoard);
  return gameBoard;
}

function clearGame() {
  gameArea.innerHTML = "";
}

function applyStyle(rows, cols) {
  gameArea.classList.remove("beginner", "intermediate", "expert");
  if (rows == 9 && cols == 9) {
    gameArea.classList.add("beginner");
    gameWidth = cols;
  } else if (rows == 16 && cols == 16) {
    gameArea.classList.add("intermediate");
    gameWidth = cols;
  } else if (rows == 16 && cols == 30) {
    gameArea.classList.add("expert");
    gameWidth = cols;
  }
}

function locOfBombs(numOfBombs, rows, cols) {
  while (bombCells.length < numOfBombs) {
    const cell = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    if (!bombCells.some((bomb) => cellMatch(bomb, cell))) {
      bombCells.push(cell);
    }
  }
  console.log(bombCells);

  //checkForBomb(bombCells);
  return bombCells;
}

function cellMatch(x, y) {
  return x.x === y.x && y.x === y.y;
}

function checkForBomb(cellNumber) {
  if (bombCells.includes(cellNumber)) {
    for (bomb of bombCells) {
      $(".ms-cell:nth-of-type(" + bomb + "").text("💥");
    }
  } else {
    return true;
  }
}

/*
function adjacentBombs(cellNumber) {
  adjacent = 0;
  bombCells.has(cellNumber + 1)
    ? adjacent++
    : bombCells.has(cellNumber - 1)
    ? adjacent++
    : bombCells.has(cellNumber + 9)
    ? adjacent++
    : bombCells.has(cellNumber - 9)
    ? adjacent++
    : "Test";
}
*/

function rightClick() {
  $(document).on("contextmenu", ".ms-cell", function () {
    $(this).text("🚩");
  });
}

function leftClick() {
  $(document).on("click", ".ms-cell", function () {
    let cellClicked = $(this).index();
    console.log(
      "X = " +
        Math.floor(cellClicked / gameWidth) +
        " Y = " +
        Math.floor(cellClicked % gameWidth)
    );
  });
}
