const gameArea = document.getElementById("game-area");
let bombCells = [];
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
    bombCells = [];
    locOfBombs(10, rows, cols);
  } else if (rows == 16 && cols == 16) {
    gameArea.classList.add("intermediate");
    gameWidth = cols;
    bombCells = [];
    locOfBombs(40, rows, cols);
  } else if (rows == 16 && cols == 30) {
    gameArea.classList.add("expert");
    gameWidth = cols;
    bombCells = [];
    locOfBombs(99, rows, cols);
  }
}

function locOfBombs(numOfBombs, rows, cols) {
  while (bombCells.length < numOfBombs) {
    let cell = {
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

function rightClick() {
  $(document).on("contextmenu", ".ms-cell", function () {
    $(this).text("🚩");
  });
}

function leftClick(thisCell) {
  $(document).on("click", ".ms-cell", function () {
    let cellClicked = $(this).index();
    this.classList.remove("untouched");
    this.classList.add("empty-cell");
    let thisCell = cellCoords(cellClicked);

    let isMine = bombCells.some(
      (bomb) => bomb.x == thisCell.x && bomb.y == thisCell.y
    );
    if (isMine) {
      revealBombs();
    } else surroundingCells();
  });
}

function cellCoords(cellClicked) {
  let xCell = Math.floor(cellClicked / gameWidth);
  let yCell = Math.floor(cellClicked % gameWidth);
  return { x: xCell, y: yCell };
}

function revealBombs() {
  let convertedCells = [];
  for (let i = 0; i < bombCells.length; i++) {
    let number = bombCells[i].x * gameWidth + (bombCells[i].y + 1);
    convertedCells.push(number);
  }
  for (cell of convertedCells) {
    $(".ms-cell:nth-of-type(" + cell + "").text("💥");
  }
}

function surroundingCells() {}
