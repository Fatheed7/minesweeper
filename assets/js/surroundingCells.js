/**
 * This function checks the surrounding cells for any mines present.
 */
export default function surroundingCells(cellClicked) {
  let thisCell = cellCoords(cellClicked);

  if (
    // Check if cellClicked is a top left corner (or Cell 0)
    cellClicked == 0
  ) {
    bombCount = 0;
    surroundingBombCheck(thisCell.x, thisCell.y + 1);
    surroundingBombCheck(thisCell.x + 1, thisCell.y);
    surroundingBombCheck(thisCell.x + 1, thisCell.y + 1);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + "").text(bombCount);
  } else if (cellClicked == gameWidth - 1) {
    // Check if cellClicked is a top right corner (or Cell of number gameWidth minus one)
    bombCount = 0;
    surroundingBombCheck(thisCell.x, thisCell.y - 1);
    surroundingBombCheck(thisCell.x + 1, thisCell.y);
    surroundingBombCheck(thisCell.x + 1, thisCell.y - 1);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + "").text(bombCount);
  } else if (cellClicked == gameWidth * (gameWidth - 1)) {
    // Check if cellClicked is a top right corner (or Cell of number gameWidth multiplied by gameWidth minus one)
    bombCount = 0;
    surroundingBombCheck(thisCell.x - 1, thisCell.y);
    surroundingBombCheck(thisCell.x - 1, thisCell.y + 1);
    surroundingBombCheck(thisCell.x, thisCell.y + 1);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + "").text(bombCount);
  } else if (cellClicked == gameWidth * gameHeight - 1) {
    // Check if cellClicked is a top right corner (or Cell of number gameWidth multiplied by gameHeight minus one)
    bombCount = 0;
    surroundingBombCheck(thisCell.x - 1, thisCell.y);
    surroundingBombCheck(thisCell.x - 1, thisCell.y - 1);
    surroundingBombCheck(thisCell.x, thisCell.y - 1);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + "").text(bombCount);
  } else if (cellClicked < gameWidth) {
    // Check if cellClicked is in the top row
    bombCount = 0;
    surroundingBombCheck(thisCell.x, thisCell.y - 1);
    surroundingBombCheck(thisCell.x, thisCell.y + 1);
    surroundingBombCheck(thisCell.x + 1, thisCell.y - 1);
    surroundingBombCheck(thisCell.x + 1, thisCell.y);
    surroundingBombCheck(thisCell.x + 1, thisCell.y + 1);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + "").text(bombCount);
  } else if (cellClicked / gameWidth >= 8) {
    // Check if cellClicked is in the bottom row
    bombCount = 0;
    surroundingBombCheck(thisCell.x, thisCell.y - 1);
    surroundingBombCheck(thisCell.x, thisCell.y + 1);
    surroundingBombCheck(thisCell.x - 1, thisCell.y - 1);
    surroundingBombCheck(thisCell.x - 1, thisCell.y);
    surroundingBombCheck(thisCell.x - 1, thisCell.y + 1);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + "").text(bombCount);
  } else if (cellClicked % gameWidth == 0) {
    // Check if cellClicked is in the left column
    bombCount = 0;
    surroundingBombCheck(thisCell.x - 1, thisCell.y);
    surroundingBombCheck(thisCell.x + 1, thisCell.y);
    surroundingBombCheck(thisCell.x - 1, thisCell.y + 1);
    surroundingBombCheck(thisCell.x, thisCell.y + 1);
    surroundingBombCheck(thisCell.x + 1, thisCell.y + 1);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + "").text(bombCount);
  } else if (cellClicked % gameWidth == 8) {
    // Check if cellClicked is in the right column
    bombCount = 0;
    surroundingBombCheck(thisCell.x - 1, thisCell.y);
    surroundingBombCheck(thisCell.x + 1, thisCell.y);
    surroundingBombCheck(thisCell.x - 1, thisCell.y - 1);
    surroundingBombCheck(thisCell.x, thisCell.y - 1);
    surroundingBombCheck(thisCell.x + 1, thisCell.y - 1);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + "").text(bombCount);
  } else {
    // Else cell must be in the inner part of the grid
    bombCount = 0;
    surroundingBombCheck(thisCell.x - 1, thisCell.y - 1);
    surroundingBombCheck(thisCell.x - 1, thisCell.y);
    surroundingBombCheck(thisCell.x - 1, thisCell.y + 1);
    surroundingBombCheck(thisCell.x, thisCell.y - 1);
    surroundingBombCheck(thisCell.x, thisCell.y + 1);
    surroundingBombCheck(thisCell.x + 1, thisCell.y - 1);
    surroundingBombCheck(thisCell.x + 1, thisCell.y);
    surroundingBombCheck(thisCell.x + 1, thisCell.y + 1);
    $(".ms-cell:nth-of-type(" + convertCoords(thisCell) + "").text(bombCount);
  }
}
