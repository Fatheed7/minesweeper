const bombNo = document.getElementById("bombNo");
const gameArea = document.getElementById("game-area");
const flagNo = document.getElementById("flagNo");
let bombCells = [];
let cellsToCheck = [];
let gameHeight;
let gameState = 1;
let gameWidth;
let motionToggle = 0;
let remainingCells = 0;
let secondCounter = -1;
let timeCounter = "";
let bombCount = 0;

const cookieCreate = () => {
  document.cookie =
    "ppkcookie1=testcookie; expires=Thu, 2 Aug 2021 20:47:11 UTC; path=/";
};

document.addEventListener("DOMContentLoaded", function () {
  leftClick();
  rightClick();
  helpContent();
  $("#help").modal("show");
  cookieCreate();
});

window.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);

const setWrapperWidth = () => {
  $(".wrapper").css("min-width", $("#game-stats").scrollWidth);
};

const gameTimer = () => {
  ++secondCounter;
  let seconds = secondCounter;
  document.getElementById("gameTimer").innerHTML = seconds;
};

/**
 * Is called by the buttons on the main page.
 *
 * This function calls the gameSize function to generate the playing area, then calls
 * the applyStyle function to ensure the correct style is applied.
 *
 * @param rows The number of rows required for the game.
 * @param cols The number of columns required for the game.
 */

const newGame = (window.newGame = (rows, cols) => {
  gameState = 1;
  gameSize(rows, cols);
  applyStyle(rows, cols);
  clearInterval(timeCounter);
  timeCounter = setInterval(gameTimer, 1000);
  secondCounter = -1;
  gameTimer();
  document.getElementsByClassName("counters")[1].classList.remove("d-none");
  document
    .getElementsByClassName("counterContainer")[0]
    .classList.remove("d-none");
  document.getElementsByClassName("welcome")[0].classList.add("d-none");
  document.getElementById("gameWrap").classList.remove("d-none");
  setWrapperWidth();
});

/**
 * Generates the game area when called from newGame
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
const gameSize = (rows, cols) => {
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
};

/**
 * Clears the gameArea of all HTML to ensure the right game size grid is displayed.
 */
const clearGame = () => {
  gameArea.innerHTML = "";
};

/**
 * Applies the required style to the game area, depending on which button is clicked.
 *
 * All styles are initially removed, before the new style is applied.
 *
 * The rows & cols are checked for values, which indicates the grid size and number of bombs required.
 *
 * The bombCells array is also cleared in preperation for new bomb coordinates to be added.
 */
const applyStyle = (rows, cols) => {
  gameArea.classList.remove("beginner", "intermediate", "expert");
  bombCells = [];
  let bombValue = 0;
  if (rows == 9 && cols == 9) {
    gameArea.classList.add("beginner");
    bombValue = 10;
  } else if (rows == 16 && cols == 16) {
    gameArea.classList.add("intermediate");
    bombValue = 40;
  } else if (rows == 16 && cols == 30) {
    gameArea.classList.add("expert");
    remainingCells = rows * cols - 99;
    bombValue = 99;
  }
  remainingCells = rows * cols - bombValue;
  locOfBombs(bombValue, rows, cols);
  gameHeight = rows;
  gameWidth = cols;
};

/**
 * Is called by applyStyle and populates the bombCells array
 * with unique bomb coordinates for all the bombs required in the game.
 * @param {*} numOfBombs The number of bombs within the game.
 * @param {*} rows The number of rows within the game.
 * @param {*} cols The number of columns within the game.
 * @returns An array of the X & Y coordinates for all the bombs in a game.
 */
const locOfBombs = (numOfBombs, rows, cols) => {
  while (bombCells.length < numOfBombs) {
    let cell = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    if (!bombCells.some((bomb) => cellMatch(bomb, cell))) {
      bombCells.push(cell);
    }
  }
  bombNo.innerHTML = numOfBombs;
  flagNo.innerHTML = numOfBombs;
  //checkForBomb(bombCells);
  return bombCells;
};

/**
 * Checks if the generated bomb coordinates are present within the array.
 * @returns True if bomb coordinates are present within the array.
 */
const cellMatch = (x, y) => {
  return x.x === y.x && x.y === y.y;
};

/**
 * Detects the user left clicking on the game area and defines cellClicked as the cell number clicked.
 *
 * It then removes the  * class "untouched" and adds the class "empty-cell" the the cell clicked.
 *
 * The function then passes the cell number to the cellCoords function to convert it to X & Y coordinates, which is
 * checked against the bombCells array. If a matching bomb is found, isMine is called, otherwise surroundingCells is called.
 */
const leftClick = () => {
  $(document).on("click", ".ms-cell", function () {
    if (gameState == 0) {
      return;
    }
    if ($(this).text() == "🚩") {
      flagNo.innerHTML++;
    }
    if ($(this).hasClass("empty-cell")) {
      return;
    }
    remainingCells--;
    let cellClicked = $(this).index();
    let thisCell = cellCoords(cellClicked);
    let isBomb = bombCells.some(
      (bomb) => bomb.x == thisCell.x && bomb.y == thisCell.y
    );
    isBomb ? revealBombs() : fill(cellClicked);
    winCheck();
  });
};

/**
 * Detects the user right clicking on the game area and sets the cell content to a flag.
 */
const rightClick = () => {
  $(document).on("contextmenu", ".ms-cell", function () {
    if (gameState == 0) {
      return;
    }
    if (flagNo.innerHTML == 0) {
      if ($(this).text() == "🚩") {
        $(this).text("");
        flagNo.innerHTML++;
      } else {
        return;
      }
    } else {
      let number = $(this).text();
      if ($(this).text() == "🚩") {
        $(this).text("❓");
        flagNo.innerHTML++;
      } else if ($(this).text() == "❓") {
        $(this).text("");
      } else if ($(this).text() == "💥") {
        return;
      } else if ($.isNumeric(number)) {
        return;
      } else {
        $(this).text("🚩");
        flagNo.innerHTML--;
      }
    }
  });
};

/**
 * Is given the number of the cell clicked and converts it to an X & Y coordinate
 */
const cellCoords = (cellClicked) => {
  if (cellClicked < 0 || cellClicked > gameWidth * gameArea) return null;
  return {
    x: Math.floor(cellClicked / gameWidth),
    y: Math.floor(cellClicked % gameWidth),
  };
};

/**
 * Reveals all bombs on the game grid.
 */
const revealBombs = () => {
  let convertedCells = [];
  for (let i = 0; i < bombCells.length; i++) {
    let number = bombCells[i].x * gameWidth + (bombCells[i].y + 1);
    convertedCells.push(number);
  }
  convertedCells.forEach((cell) => {
    $(".ms-cell:nth-of-type(" + cell + "").text("💥");
  });
  gameState = 0;
  loseContent();
  $("#help").modal("show");
  clearInterval(timeCounter);
};

const winCheck = () => {
  if (remainingCells == 0) {
    gameState = 0;
    clearInterval(timeCounter);
    winContent();
    $("#help").modal("show");
  }
};

//Test Code
const getIndex = (x, y) => {
  if (x < 0 || x >= gameHeight || y < 0 || y >= gameWidth) return null;
  return y * gameWidth + x;
};

const $mscell = document.getElementsByClassName(`ms-cell`);

const fill = (cellClicked) => {
  cellsToCheck = [cellClicked];
  const cellsAlreadyChecked = [];

  while (cellsToCheck.length > 0) {
    const cellIndex = cellsToCheck.pop();
    if (cellCoords(cellIndex) >= 0) continue;
    const { x, y } = cellCoords(cellIndex);
    cellsAlreadyChecked.push(cellIndex);

    const neighbouringIndexes = [
      { x: x + 1, y: y },
      { x: x - 1, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y - 1 },
      { x: x - 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y: y + 1 },
    ];

    console.log(neighbouringIndexes);

    neighbouringIndexes.forEach((i) => {
      if (
        bombCells.some(
          (bomb) =>
            bomb.x == neighbouringIndexes.x && bomb.y == neighbouringIndexes.y
        )
      ) {
        bombCount++;
      }
    });
    let isBomb = bombCells.some((bomb) => bomb.x == x && bomb.y == y);
    if (!isBomb) {
      $mscell[cellIndex].classList.remove("untouched");
      $mscell[cellIndex].classList.add("empty-cell");
      $mscell[cellIndex].innerHTML = bombCount;
    }

    neighbouringIndexes.forEach((i) => {
      if (i !== null && !cellsAlreadyChecked.includes(i)) {
        cellsToCheck.push(i);
      }
    });
  }
};

//
// Floating Button Code
//
$(".settingsFloat").click(function () {
  settings();
});

$(".helpFloat").click(function () {
  helpContent();
});

//
// Modal Content
//
const helpContent = () => {
  $(".modal-title").text("Welcome to Minesweeper!");
  $(".modal-body").load("assets/html/helpContent.html");
  $(".modalButton").text("Lets play!");
};

const settings = () => {
  $(".modal-title").text("Welcome to Minesweeper!");
  $(".modal-body").load("assets/html/settings.html");
  $(".modalButton").text("Lets play!");
};

$("#deleteCookies").click(function () {
  $(this).fadeOut(function () {
    $("#hideConfirm").fadeIn();
  });
});

const winContent = () => {
  $(".modal-title").text("Congratulations!");
  $(".modal-body").html("You win! 😀");
  $(".modalButton").text("Play again?");
};

const loseContent = () => {
  $(".modal-title").text("Kaboom!");
  $(".modal-body").html("You lost! 😞");
  $(".modalButton").text("Play again?");
};
