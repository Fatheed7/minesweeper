import { bombCount, cellCoords } from "../script.mjs";
import { topLeftSearch } from "../script.mjs";
import { topMiddleSearch } from "../script.mjs";
import { topRightSearch } from "../script.mjs";
import { middleLeftSearch } from "../script.mjs";
import { middleRightSearch } from "../script.mjs";
import { bottomLeftSearch } from "../script.mjs";
import { bottomMiddleSearch } from "../script.mjs";
import { bottomRightSearch } from "../script.mjs";
import { gameWidth } from "../script.mjs";
import { gameHeight } from "../script.mjs";

/**
 * Checks the surrounding cells for any mines present.
 */

export const surroundingCells = (cellClicked) => {
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
