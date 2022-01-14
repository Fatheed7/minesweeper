import surroundingCells from "./surroundingCells";

const gameArea = document.getElementById("game-area");
let bombCells = [];
let gameWidth;
let gameHeight;
let bombCount = 0;

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

/**
 * This function is called by the buttons on the main page.
 *
 * This function calls the gameSize function to generate the playing area, then calls
 * the applyStyle function to ensure the correct style is applied.
 *
 * @param rows The number of rows required for the game.
 * @param cols The number of columns required for the game.
 */
function newGame(rows, cols) {
  gameSize(rows, cols);
  applyStyle(rows, cols);
}

/**
 * This function generates the game area when called from newGame
 *
 * The function first calls the clearGame function.
 *
 * gameBoard is defined as a new array and is populated at the end of the function.
 *
 * Whilst x is less than the number of rows and, within that, whilst y is less than the
 * number of columns, the gameArea HTML is appended with a new div and given the classes
 * of "ms-cell" & "untouched".
 *
 * This is then pushed to the row array, which is in turn pushed to the gameBoard array to
 * be returned
 *
 * @param rows The number of rows required for the game.
 * @param cols The number of columns required for the game.
 * @returns The completed game area HTML.
 */
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

/**
 * This function clears the gameArea of all HTML to ensure the right game size grid is displayed.
 */
function clearGame() {
  gameArea.innerHTML = "";
}

/**
 * This function applies the required style to the game area, depending on which button is clicked.
 *
 * All styles are initially removed, before the new style is applied.
 *
 * The rows & cols are checked for values, which indicates the grid size and number of bombs required.
 *
 * The bombCells array is also cleared in preperation for new bomb coordinates to be added.
 */
function applyStyle(rows, cols) {
  gameArea.classList.remove("beginner", "intermediate", "expert");
  if (rows == 9 && cols == 9) {
    gameArea.classList.add("beginner");
    gameHeight = rows;
    gameWidth = cols;
    bombCells = [];
    locOfBombs(10, rows, cols);
  } else if (rows == 16 && cols == 16) {
    gameArea.classList.add("intermediate");
    gameHeight = rows;
    gameWidth = cols;
    bombCells = [];
    locOfBombs(40, rows, cols);
  } else if (rows == 16 && cols == 30) {
    gameArea.classList.add("expert");
    gameHeight = rows;
    gameWidth = cols;
    bombCells = [];
    locOfBombs(99, rows, cols);
  }
}

/**
 * This function is called by applyStyle and populates the bombCells array
 * with unique bomb coordinates for all the bombs required in the game.
 * @param {*} numOfBombs The number of bombs within the game.
 * @param {*} rows The number of rows within the game.
 * @param {*} cols The number of columns within the game.
 * @returns An array of the X & Y coordinates for all the bombs in a game.
 */
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
  document.getElementById("bombNo").innerHTML = numOfBombs;
  //checkForBomb(bombCells);
  return bombCells;
}

/**
 * This function checks if the generated bomb coordinates are present within the array.
 * @returns True if bomb coordinates are present within the array.
 */
function cellMatch(x, y) {
  return x.x === y.x && y.x === y.y;
}

/**
 * This function detects the user right clicking on the game area and sets the cell content to a flag.
 */
function rightClick() {
  $(document).on("contextmenu", ".ms-cell", function () {
    $(this).text("🚩");
  });
}

/**
 * This function detects the user left clicking on the game area and defines cellClicked as the cell number clicked.
 *
 * It then removes the  * class "untouched" and adds the class "empty-cell" the the cell clicked.
 *
 * The function then passes the cell number to the cellCoords function to convert it to X & Y coordinates, which is
 * checked against the bombCells array. If a matching bomb is found, isMine is called, otherwise surroundingCells is called.
 */
function leftClick() {
  $(document).on("click", ".ms-cell", function () {
    let cellClicked = $(this).index();
    this.classList.remove("untouched");
    this.classList.add("empty-cell");
    let thisCell = cellCoords(cellClicked);
    let isBomb = bombCells.some(
      (bomb) => bomb.x == thisCell.x && bomb.y == thisCell.y
    );
    if (isBomb) {
      revealBombs();
    } else surroundingCells(cellClicked);
  });
}

/**
 * This function is given the number of the cell clicked and converts it to an X & Y coordinate
 */
function cellCoords(cellClicked) {
  let xCell = Math.floor(cellClicked / gameWidth);
  let yCell = Math.floor(cellClicked % gameWidth);
  return { x: xCell, y: yCell };
}

function convertCoords(cellClicked) {
  let cell =
    Math.floor(cellClicked.x * gameWidth) +
    Math.floor(cellClicked.y % gameWidth) +
    1;
  return cell;
}

/**
 * This function reveals all bombs on the game grid.
 */
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

function surroundingBombCheck(xCell, yCell) {
  let isBomb = bombCells.some((bomb) => bomb.x == xCell && bomb.y == yCell);
  if (isBomb) {
    bombCount++;
  }
}
