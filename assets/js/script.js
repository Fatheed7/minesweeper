const gameArea = document.getElementById("game-area");
let bombCells;

$("document").ready(function () {
  rightClick();
  leftClick();
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
  generateBombs(rows, cols);
}

function gameSize(rows, cols) {
  clearGame();
  for (square = 0; square < rows * cols; square++) {
    let squareInner = document.createElement("div");
    gameArea.appendChild(squareInner).className = "ms-cell untouched";
  }
}

function clearGame() {
  gameArea.innerHTML = "";
}

function applyStyle(rows, cols) {
  gameArea.classList.remove("beginner", "intermediate", "expert");
  rows == 9 && cols == 9
    ? gameArea.classList.add("beginner")
    : rows == 16 && cols == 16
    ? gameArea.classList.add("intermediate")
    : rows == 30 && cols == 16
    ? gameArea.classList.add("expert")
    : "Test";
}

function generateBombs(rows, cols) {
  let numOfBombs = 0;
  rows == 9 && cols == 9
    ? (numOfBombs = 10)
    : rows == 16 && cols == 16
    ? (numOfBombs = 40)
    : rows == 30 && cols == 16
    ? (numOfBombs = 99)
    : "Test";
  $("#bombNo").text(numOfBombs);
  locOfBombs(numOfBombs, rows, cols);
}

function locOfBombs(numOfBombs, rows, cols) {
  bombCells = new Set();

  while (bombCells.size !== numOfBombs) {
    bombCells.add(Math.floor(Math.random() * (rows * cols)) + 1);
  }

  checkForBomb(bombCells);
}
function checkForBomb(cellNumber) {
  console.log(bombCells);
  if (bombCells.has(cellNumber)) {
    for (bomb of bombCells) {
      $(".ms-cell:nth-of-type(" + bomb + "").text("💥");
    }
  } else {
    return true;
  }
}

function rightClick() {
  $(document).on("contextmenu", ".ms-cell", function () {
    $(this).text("🚩");
  });
}

function leftClick() {
  $(document).on("click", ".ms-cell", function () {
    if (checkForBomb($(this).index() + 1)) {
      $(this).text("");
      this.classList.remove("untouched");
      this.classList.add("empty-cell");
    }
  });
}
