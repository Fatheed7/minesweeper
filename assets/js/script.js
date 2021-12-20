const gameArea = document.getElementById("game-area");

window.addEventListener(
  "contextmenu",
  function (e) {
    rightClick();
    leftClick();
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
    gameArea.appendChild(squareInner).className = "ms-cell";
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

  const locOfBombs = new Set();
  while (locOfBombs.size !== numOfBombs) {
    locOfBombs.add(Math.floor(Math.random() * (rows * cols)) + 1);
  }

  for (loc of locOfBombs) {
    $(".ms-cell:nth-of-type(" + loc + "").text("💣");
  }
}

function rightClick() {
  $(document).on("contextmenu", ".ms-cell", function () {
    $(this).text("🚩");
  });
}

function leftClick() {
  $(document).on("click", ".ms-cell", function () {
    $(this).text("Test!");
  });
}
