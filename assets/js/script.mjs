const bombNo = document.getElementById("bombNo");
const gameArea = document.getElementById("game-area");
const flagNo = document.getElementById("flagNo");
let bombCells = [];
let cellMap = [];
let cellsToCheck = [];
let gameHeight;
let gameState = 1;
let gameWidth;
let motionToggle = 0;
let remainingCells = 0;
let secondCounter = -1;
let timeCounter = "";
let bombCount = 0;

document.addEventListener("DOMContentLoaded", function () {
  leftClick();
  rightClick();
  helpContent();
  $("#help").modal("show");
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
  mapCells(rows, cols);
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

const mapCells = (rows, cols) => {
  cellMap = [];
  for (let i = 0; i < rows * cols; i++) {
    bombCount = 0;
    let cells = surroundingCells(i);
    cellMap.push(cells);
  }
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
export const cellCoords = (cellClicked) => {
  if (cellClicked < 0 || cellClicked > gameWidth * gameArea) return null;
  return {
    x: Math.floor(cellClicked / gameWidth),
    y: Math.floor(cellClicked % gameWidth),
  };
  //let xCell = Math.floor(cellClicked / gameWidth);
  //let yCell = Math.floor(cellClicked % gameWidth);
  //return { x: xCell, y: yCell };
};

const convertCoords = (cellClicked) => {
  let cell =
    Math.floor(cellClicked.x * gameWidth) +
    Math.floor(cellClicked.y % gameWidth) +
    1;
  return cell;
};

const convertCoordsBombCheck = (xCell, yCell) => {
  let cell = Math.floor(xCell * gameWidth) + Math.floor(yCell % gameWidth) + 1;
  return cell;
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
  for (cell of convertedCells) {
    $(".ms-cell:nth-of-type(" + cell + "").text("💥");
  }
  gameState = 0;
  loseContent();
  $("#help").modal("show");
  clearInterval(timeCounter);
};

const revealCell = (cellClicked) => {
  cellMap[cellClicked] == 0
    ? $(".ms-cell:nth-of-type(" + (cellClicked + 1) + "").text("")
    : $(".ms-cell:nth-of-type(" + (cellClicked + 1) + "").text(
        cellMap[cellClicked]
      );
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
    const { x, y } = cellCoords(cellIndex);
    cellsAlreadyChecked.push(cellIndex);

    let cellState = cellMap[cellIndex];
    if (cellState !== 0) continue;

    // Cell is off, lets turn it on
    //console.log($mscell[candidateIndex].innerHTML);
    let isBomb = bombCells.some((bomb) => bomb.x == x && bomb.y == y);
    if (!isBomb) {
      $mscell[cellIndex].classList.remove("untouched");
      $mscell[cellIndex].classList.add("empty-cell");
      $mscell[cellIndex].innerHTML = cellMap[cellIndex];
    }

    // Lets check the neighbours

    const neighbouringIndexes = [
      getIndex(x + 1, y),
      getIndex(x - 1, y),
      getIndex(x, y + 1),
      getIndex(x, y - 1),
    ];

    neighbouringIndexes.forEach((i) => {
      if (i !== null && !cellsAlreadyChecked.includes(i)) {
        cellsToCheck.push(i);
      }
    });
  }
};
//

//
// Search Patterns

/**
 * Searches only the top left cell.
 */
export const topLeftSearch = (thisCell) => {
  checkCells(thisCell.x - 1, thisCell.y - 1);
};

/**
 * Searches only the top middle cell.
 */
export const topMiddleSearch = (thisCell) => {
  checkCells(thisCell.x - 1, thisCell.y);
};

/**
 * Searches only the top right cell.
 */
export const topRightSearch = (thisCell) => {
  checkCells(thisCell.x - 1, thisCell.y + 1);
};

/**
 * Searches only the left middle cell.
 */
export const middleLeftSearch = (thisCell) => {
  checkCells(thisCell.x, thisCell.y - 1);
};

/**
 * Searches only the left right cell.
 */
export const middleRightSearch = (thisCell) => {
  checkCells(thisCell.x, thisCell.y + 1);
};

/**
 * Searches only the bottom left cell.
 */
export const bottomLeftSearch = (thisCell) => {
  checkCells(thisCell.x + 1, thisCell.y - 1);
};

/**
 * Searches only the bottom middle cell.
 */
export const bottomMiddleSearch = (thisCell) => {
  checkCells(thisCell.x + 1, thisCell.y);
};

/**
 * Searches only the bottom right cell.
 */
export const bottomRightSearch = (thisCell) => {
  checkCells(thisCell.x + 1, thisCell.y + 1);
};

const checkCells = (x, y) => {
  cellsToCheck.push({ x, y });
  surroundingBombCheck();
};

const surroundingBombCheck = () => {
  cellsToCheck.forEach(({ x, y }) => {
    let isBomb = bombCells.some((bomb) => bomb.x == x && bomb.y == y);
    if (isBomb) {
      bombCount++;
    }
    cellsToCheck.pop([0]);
  });
};

//
// Floating Button Code
//
$(".motionFloat").click(function () {
  if (motionToggle == 0) {
    $(this).css({ backgroundColor: "red" });
    $("#game-area").removeClass("transition");
    $(".modal").removeClass("fade");
    motionToggle = 1;
  } else {
    $(this).css({ backgroundColor: "green" });
    $("#game-area").addClass("transition");
    $(".modal").addClass("fade");
    motionToggle = 0;
  }
});

$(".helpFloat").click(function () {
  helpContent();
});

//
// Modal Content
//
const helpContent = () => {
  $(".modal-title").text("How to play Minesweeper!");
  $(".modal-body").html(
    "<h5>Help clear all the mines!</h5><ul><li>Click on a cell to reveal it.</li><li>If it's empty, you'll see how many of the neighbouring cells contain bombs. </li><li class='listSpacer'> But beware! If it's a bomb, all the bombs will explode!  </li>    <li>     Right click to place a flag on a cell you suspect to be a bomb.    </li>    <li class=listSpacer'>Right click again to remove it.</li> <li>When only cells containing bombs remain, you win!</li>    <li class='listSpacer'>      If you make the mines explode, you lose!    </li>    <li>The top bar of the game page shows:</li>    <li>Bombs - How many bombs the current difficulty contains.</li>    <li>      Flag - How many flags you have left (You start with a flag for each bomb). </li>   <li class='listSpacer'>      Time - How long you've been playing (in seconds).    </li>    <li>      The bar at the bottom of the page shows difficulty settings,      which are:    </li>    <li>Beginner - A 9 x 9 grid containing 10 bombs.</li>    <li>Intermediate - A 16 x 16 grid containing 40 bombs.</li>    <li class='listSpacer'>      Expert - A 30 x 16 grid containing 99 bombs.    </li>    <li>      Click the <i class='fa fa-expand-arrows-alt'></i> icon in the      bottom left corner to disable any animation effects.   </li>    <li>      Click the <i class='fa fa-question'></i> icon in the bottom      right corner to view these instructions again.    </li>  </ul>"
  );
  $(".modalButton").text("Lets play!");
};

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

const surroundingCells = (cellClicked) => {
  let thisCell = cellCoords(cellClicked);
  if (
    // Check if cellClicked is a top left corner (or Cell 0)
    cellClicked == 0
  ) {
    bombCount = 0;
    middleRightSearch(thisCell);
    bottomRightSearch(thisCell);
    bottomMiddleSearch(thisCell);
    return bombCount;
  } else if (cellClicked == gameWidth - 1) {
    // Check if cellClicked is a top right corner (or Cell of number gameWidth minus one)
    bombCount = 0;
    middleLeftSearch(thisCell);
    bottomLeftSearch(thisCell);
    bottomMiddleSearch(thisCell);
    return bombCount;
  } else if (cellClicked == gameWidth * (gameWidth - 1)) {
    // Check if cellClicked is a bottom left corner (or Cell of number gameWidth multiplied by gameWidth minus one)
    bombCount = 0;
    topMiddleSearch(thisCell);
    topRightSearch(thisCell);
    middleRightSearch(thisCell);
    return bombCount;
  } else if (cellClicked == gameWidth * gameHeight - 1) {
    // Check if cellClicked is a bottom right corner (or Cell of number gameWidth multiplied by gameHeight minus one)
    bombCount = 0;
    topMiddleSearch(thisCell);
    topLeftSearch(thisCell);
    middleLeftSearch(thisCell);
    return bombCount;
  } else if (cellClicked < gameWidth) {
    // Check if cellClicked is in the top row
    bombCount = 0;
    middleLeftSearch(thisCell);
    bottomLeftSearch(thisCell);
    bottomMiddleSearch(thisCell);
    bottomRightSearch(thisCell);
    middleRightSearch(thisCell);
    return bombCount;
  } else if (cellClicked / gameWidth >= gameWidth - 1) {
    // Check if cellClicked is in the bottom row
    bombCount = 0;
    middleLeftSearch(thisCell);
    topLeftSearch(thisCell);
    topMiddleSearch(thisCell);
    topRightSearch(thisCell);
    middleRightSearch(thisCell);
    return bombCount;
  } else if (cellClicked % gameWidth == 0) {
    // Check if cellClicked is in the left column
    bombCount = 0;
    topMiddleSearch(thisCell);
    topRightSearch(thisCell);
    middleRightSearch(thisCell);
    bottomRightSearch(thisCell);
    bottomMiddleSearch(thisCell);
    return bombCount;
  } else if (cellClicked % gameWidth == gameWidth - 1) {
    // Check if cellClicked is in the right column
    bombCount = 0;
    topMiddleSearch(thisCell);
    topLeftSearch(thisCell);
    middleLeftSearch(thisCell);
    bottomLeftSearch(thisCell);
    bottomMiddleSearch(thisCell);
    return bombCount;
  } else {
    // Else cell must be in the inner part of the grid
    bombCount = 0;
    topLeftSearch(thisCell);
    topMiddleSearch(thisCell);
    topRightSearch(thisCell);
    middleLeftSearch(thisCell);
    middleRightSearch(thisCell);
    bottomLeftSearch(thisCell);
    bottomMiddleSearch(thisCell);
    bottomRightSearch(thisCell);
    return bombCount;
  }
};
