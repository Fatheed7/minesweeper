const gameArea = document.getElementById("game-area");
const flagNo = document.getElementById("flagNo");
const bombNo = document.getElementById("bombNo");
let bombCells = [];
let gameWidth;
let gameHeight;
let bombCount = 0;
let gameState = 1;
let remainingCells = 0;
let timeCounter = "";
let secondCounter = -1;
let motionToggle = 0;
let cellsToCheck = [];
let checkedCells = [];

$("document").ready(function () {
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

function setWrapperWidth() {
  $(".wrapper").css("min-width", $("#game-stats").scrollWidth);
}

function gameTimer() {
  ++secondCounter;
  let seconds = secondCounter;
  document.getElementById("gameTimer").innerHTML = seconds;
}

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
  gameState = 1;
  gameSize(rows, cols);
  applyStyle(rows, cols);
  clearInterval(timeCounter);
  timeCounter = setInterval(gameTimer, 1000);
  secondCounter = -1;
  gameTimer();
  $("#counters").removeClass("d-none");
  $(".counterContainer").removeClass("d-none");
  $(".welcome").addClass("d-none");
  $("#gameWrap").removeClass("d-none");
  setWrapperWidth();
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
    remainingCells = rows * cols - 10;
    locOfBombs(10, rows, cols);
  } else if (rows == 16 && cols == 16) {
    gameArea.classList.add("intermediate");
    gameHeight = rows;
    gameWidth = cols;
    bombCells = [];
    remainingCells = rows * cols - 40;
    locOfBombs(40, rows, cols);
  } else if (rows == 16 && cols == 30) {
    gameArea.classList.add("expert");
    gameHeight = rows;
    gameWidth = cols;
    bombCells = [];
    remainingCells = rows * cols - 99;
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
  bombNo.innerHTML = numOfBombs;
  flagNo.innerHTML = numOfBombs;
  //checkForBomb(bombCells);
  return bombCells;
}

/**
 * This function checks if the generated bomb coordinates are present within the array.
 * @returns True if bomb coordinates are present within the array.
 */
function cellMatch(x, y) {
  return x.x === y.x && x.y === y.y;
}

/**
 * This function detects the user right clicking on the game area and sets the cell content to a flag.
 */
function rightClick() {
  $(document).on("contextmenu", ".ms-cell", function () {
    if (gameState == 0) {
      return;
    } else if (flagNo.innerHTML == 0) {
      if ($(this).text() == "🚩") {
        $(this).text("");
        flagNo.innerHTML++;
      } else {
        return;
      }
    } else {
      let number = $(this).text();
      if ($(this).text() == "🚩") {
        $(this).text("");
        flagNo.innerHTML++;
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
    if (gameState == 0) {
      return;
    } else {
      if ($(this).text() == "🚩") {
        flagNo.innerHTML++;
      }
      if ($(this).hasClass("empty-cell")) {
        return;
      } else {
        remainingCells--;
      }
      let cellClicked = $(this).index();
      $(this).removeClass("untouched");
      $(this).addClass("empty-cell");
      let thisCell = cellCoords(cellClicked);
      let isBomb = bombCells.some(
        (bomb) => bomb.x == thisCell.x && bomb.y == thisCell.y
      );
      if (isBomb) {
        revealBombs();
      } else {
        surroundingCells(cellClicked);
      }
      winCheck();
    }
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

function convertCoordsBombCheck(xCell, yCell) {
  let cell = Math.floor(xCell * gameWidth) + Math.floor(yCell % gameWidth) + 1;
  return cell;
}

function clearAreaCheck(xCell, yCell) {
  let cell = Math.floor(xCell * gameWidth) + Math.floor(yCell % gameWidth);
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
  gameState = 0;
  loseContent();
  $("#help").modal("show");
  clearInterval(timeCounter);
}

function checkCells(x, y) {
  cellsToCheck.push({ x, y });
  surroundingBombCheck();
}

function surroundingBombCheck() {
  cellsToCheck.forEach(({ x, y }) => {
    let isBomb = bombCells.some((bomb) => bomb.x == x && bomb.y == y);
    if (isBomb) {
      bombCount++;
    }
    cellsToCheck.pop([0]);
  });
}

/**
 * This function checks the surrounding cells for any mines present.
 */
function surroundingCells(cellClicked) {
  let thisCell = cellCoords(cellClicked);
  let isChecked = checkedCells.some(
    (cell) => cell.x == thisCell.x && cell.y == thisCell.y
  );
  if (isChecked) {
    return;
  } else {
    if (
      // Check if cellClicked is a top left corner (or Cell 0)
      cellClicked == 0
    ) {
      bombCount = 0;
      checkCells(thisCell.x, thisCell.y + 1);
      checkCells(thisCell.x + 1, thisCell.y);
      checkCells(thisCell.x + 1, thisCell.y + 1);
      addNumberToCell(thisCell, bombCount);
    } else if (cellClicked == gameWidth - 1) {
      // Check if cellClicked is a top right corner (or Cell of number gameWidth minus one)
      bombCount = 0;
      checkCells(thisCell.x, thisCell.y - 1);
      checkCells(thisCell.x + 1, thisCell.y);
      checkCells(thisCell.x + 1, thisCell.y - 1);
      addNumberToCell(thisCell, bombCount);
    } else if (cellClicked == gameWidth * (gameWidth - 1)) {
      // Check if cellClicked is a bottom left corner (or Cell of number gameWidth multiplied by gameWidth minus one)
      bombCount = 0;
      checkCells(thisCell.x - 1, thisCell.y);
      checkCells(thisCell.x - 1, thisCell.y + 1);
      checkCells(thisCell.x, thisCell.y + 1);
      addNumberToCell(thisCell, bombCount);
    } else if (cellClicked == gameWidth * gameHeight - 1) {
      // Check if cellClicked is a bottom right corner (or Cell of number gameWidth multiplied by gameHeight minus one)
      bombCount = 0;
      checkCells(thisCell.x - 1, thisCell.y);
      checkCells(thisCell.x - 1, thisCell.y - 1);
      checkCells(thisCell.x, thisCell.y - 1);
      addNumberToCell(thisCell, bombCount);
    } else if (cellClicked < gameWidth) {
      // Check if cellClicked is in the top row
      bombCount = 0;
      checkCells(thisCell.x, thisCell.y - 1);
      checkCells(thisCell.x, thisCell.y + 1);
      checkCells(thisCell.x + 1, thisCell.y - 1);
      checkCells(thisCell.x + 1, thisCell.y);
      checkCells(thisCell.x + 1, thisCell.y + 1);
      addNumberToCell(thisCell, bombCount);
    } else if (cellClicked / gameWidth >= gameWidth - 1) {
      // Check if cellClicked is in the bottom row
      bombCount = 0;
      checkCells(thisCell.x, thisCell.y - 1);
      checkCells(thisCell.x, thisCell.y + 1);
      checkCells(thisCell.x - 1, thisCell.y - 1);
      checkCells(thisCell.x - 1, thisCell.y);
      checkCells(thisCell.x - 1, thisCell.y + 1);
      addNumberToCell(thisCell, bombCount);
    } else if (cellClicked % gameWidth == 0) {
      // Check if cellClicked is in the left column
      bombCount = 0;
      checkCells(thisCell.x - 1, thisCell.y);
      checkCells(thisCell.x + 1, thisCell.y);
      checkCells(thisCell.x - 1, thisCell.y + 1);
      checkCells(thisCell.x, thisCell.y + 1);
      checkCells(thisCell.x + 1, thisCell.y + 1);
      addNumberToCell(thisCell, bombCount);
    } else if (cellClicked % gameWidth == gameWidth - 1) {
      // Check if cellClicked is in the right column
      bombCount = 0;
      checkCells(thisCell.x - 1, thisCell.y);
      checkCells(thisCell.x + 1, thisCell.y);
      checkCells(thisCell.x - 1, thisCell.y - 1);
      checkCells(thisCell.x, thisCell.y - 1);
      checkCells(thisCell.x + 1, thisCell.y - 1);
      addNumberToCell(thisCell, bombCount);
    } else {
      // Else cell must be in the inner part of the grid
      bombCount = 0;
      checkCells(thisCell.x - 1, thisCell.y - 1);
      checkCells(thisCell.x - 1, thisCell.y);
      checkCells(thisCell.x - 1, thisCell.y + 1);
      checkCells(thisCell.x, thisCell.y - 1);
      checkCells(thisCell.x, thisCell.y + 1);
      checkCells(thisCell.x + 1, thisCell.y - 1);
      checkCells(thisCell.x + 1, thisCell.y);
      checkCells(thisCell.x + 1, thisCell.y + 1);
      addNumberToCell(thisCell, bombCount);
    }
  }
  let x = thisCell.x;
  let y = thisCell.y;
  checkedCells.push({ x, y });
}

function addNumberToCell(thisCell, bombCount) {
  let cellClicked = clearAreaCheck(thisCell.x, thisCell.y);

  if (bombCount == 0) {
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + ")").text("");
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + ")").removeClass(
      "untouched"
    );
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + ")").addClass(
      "empty-cell"
    );
    if (
      // Check if cellClicked is a top left corner (or Cell 0)
      cellClicked == 0
    ) {
      bombCount = 0;
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y + 1));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y + 1));
    } else if (this == gameWidth - 1) {
      // Check if cellClicked is a top right corner (or Cell of number gameWidth minus one)
      bombCount = 0;
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y - 1));
    } else if (cellClicked == gameWidth * (gameWidth - 1)) {
      // Check if cellClicked is a bottom left corner (or Cell of number gameWidth multiplied by gameWidth minus one)
      bombCount = 0;
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y + 1));
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y + 1));
    } else if (cellClicked == gameWidth * gameHeight - 1) {
      // Check if cellClicked is a bottom right corner (or Cell of number gameWidth multiplied by gameHeight minus one)
      bombCount = 0;
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y - 1));
    } else if (cellClicked < gameWidth) {
      // Check if cellClicked is in the top row
      bombCount = 0;
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y + 1));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y + 1));
    } else if (cellClicked / gameWidth >= gameWidth - 1) {
      // Check if cellClicked is in the bottom row
      bombCount = 0;
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y + 1));
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y + 1));
    } else if (cellClicked % gameWidth == 0) {
      // Check if cellClicked is in the left column
      bombCount = 0;
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y + 1));
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y + 1));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y + 1));
    } else if (cellClicked % gameWidth == gameWidth - 1) {
      // Check if cellClicked is in the right column
      bombCount = 0;
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y - 1));
    } else {
      // Else cell must be in the inner part of the grid
      bombCount = 0;
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x - 1, thisCell.y + 1));
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x, thisCell.y + 1));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y - 1));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y));
      surroundingCells(clearAreaCheck(thisCell.x + 1, thisCell.y + 1));
    }
  } else {
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + ")").text(bombCount);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + ")").removeClass(
      "untouched"
    );
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + ")").addClass(
      "empty-cell"
    );
  }
  let x = thisCell.x;
  let y = thisCell.y;
  cellsToCheck.push({ x, y });
  if (cellsToCheck.length == 0) {
    return;
  } else {
    surroundingBombCheck();
  }
}

function winCheck() {
  if (remainingCells == 0) {
    gameState = 0;
    clearInterval(timeCounter);
    winContent();
    $("#help").modal("show");
  }
}

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

function helpContent() {
  $(".modal-title").text("How to play Minesweeper!");
  $(".modal-body").html(
    "<h5>Help clear all the mines!</h5><ul><li>Click on a cell to reveal it.</li><li>If it's empty, you'll see how many of the neighbouring cells contain bombs. </li><li class='listSpacer'> But beware! If it's a bomb, all the bombs will explode!  </li>    <li>     Right click to place a flag on a cell you suspect to be a bomb.    </li>    <li class=listSpacer'>Right click again to remove it.</li> <li>When only cells containing bombs remain, you win!</li>    <li class='listSpacer'>      If you make the mines explode, you lose!    </li>    <li>The top bar of the game page shows:</li>    <li>Bombs - How many bombs the current difficulty contains.</li>    <li>      Flag - How many flags you have left (You start with a flag for each bomb). </li>   <li class='listSpacer'>      Time - How long you've been playing (in seconds).    </li>    <li>      The bar at the bottom of the page shows difficulty settings,      which are:    </li>    <li>Beginner - A 9 x 9 grid containing 10 bombs.</li>    <li>Intermediate - A 16 x 16 grid containing 40 bombs.</li>    <li class='listSpacer'>      Expert - A 30 x 16 grid containing 99 bombs.    </li>    <li>      Click the <i class='fa fa-expand-arrows-alt'></i> icon in the      bottom left corner to disable any animation effects.   </li>    <li>      Click the <i class='fa fa-question'></i> icon in the bottom      right corner to view these instructions again.    </li>  </ul>"
  );
  $(".modalButton").text("Lets play!");
}

function winContent() {
  $(".modal-title").text("Congratulations!");
  $(".modal-body").html("You win! 😀");
  $(".modalButton").text("Play again?");
}

function loseContent() {
  $(".modal-title").text("Kaboom!");
  $(".modal-body").html("You lost! 😞");
  $(".modalButton").text("Play again?");
}
