const gameArea = document.getElementById("game-area");

function gameType(rows, cols) {
  gameSize(rows, cols);
  applyStyle(rows, cols);
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

function gameSize(rows, cols) {
  clearGame();
  for (square = 0; square < rows * cols; square++) {
    let squareInner = document.createElement("div");
    squareInner.innerText = square + 1;
    gameArea.appendChild(squareInner).className = "ms-cell";
  }
}

function clearGame() {
  gameArea.innerHTML = "";
}
