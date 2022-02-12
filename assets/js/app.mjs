import $ from "jquery";
import { getCoords, getIndex } from "./lib";

// Holds all the cells in a left to right, top to bottom order.
const cells = [
    // index is used to keep track of coords
    // {
    //     revealed: false,
    //     isBomb: false,
    //     hasFlag: false,
    //     surroundingBombs: 0,
    // }
];

const game = {
    width: 10,
    height: 10,
    bombCount: 10,
};

// Get flag count
// cells.filter((c) => c.hasFlag).length;
// cells.filter((c) => c.isBomb).length;

/**
 * On document load, add functionality to the newgame buttons
 */
$(() => {
    $(`#newgame-beginner`).click(() => newGame(9, 9, 10));
    $(`#newgame-intermediate`).click(() => newGame(13, 13, 20));
    $(`#newgame-expert`).click(() => newGame(25, 25, 30));

    newGame(10, 10, 10);
});

const newGame = (width, height, bombCount) => {
    cells.length = 0;
    game.width = width;
    game.height = height;
    game.bombCount = bombCount;

    for (let i = 0; i < width * height; i++) {
        cells.push({
            revealed: false,
            isBomb: Math.random() < 0.1,
            hasFlag: false,
            surroundingBombs: 0,
        });
    }

    // make a function called plantBombs(bombCount) which randomly adds bombs, until that amount has been reached

    calculateSurroundings();
    drawGrid();

    // make a function called renderStats() which updates the stats on the page
};

const drawGrid = () => {
    const grid = $(`#grid`);
    grid.css(`grid-template-columns`, `repeat(${game.width}, 1fr)`);
    grid.empty();

    for (let [i, cell] of cells.entries()) {
        const $cell = $(`<div class="grid-cell"></div>`);
        $cell.click(() => clickCell(i));
        if (cell.revealed) {
            // add some classes to visual the cell state
            if (cell.isBomb) $cell.text(`💣`);
            else if (cell.hasFlag) $cell.text(`🚩`);
            else if (cell.surroundingBombs > 0) $cell.text(cell.surroundingBombs);
            else $cell.text(`0`);
        }

        // Just for debugging
        // $cell.text(cell.surroundingBombs);
        // if (cell.isBomb) $cell.text(`💣`);
        // cell.contextmenu(cellRightClicked);

        grid.append($cell);
    }
};

const clickCell = (index) => {
    const cell = cells[index];

    if (cell.revealed) return;

    if (cell.isBomb) {
        // Cell is a bomb, just reveal it
        // Fatheed can add gameover stuff here
        cell.revealed = true;
    } else if (cell.surroundingBombs > 0) {
        // Cell is not a bomb but has a nearby bomb. Reveal it and fuck off
        cell.revealed = true;
    } else {
        // Cell has no neighbouring bombs. Start exploring!
        revealArea(index);
    }

    drawGrid();
};

/**
 * Calculate the amount of surrounding bombs for a given cell index
 */
const calculateSurroundings = () => {
    for (let [i, cell] of cells.entries()) {
        const { x, y } = getCoords(i, game.width, game.height);

        for (let xx = -1; xx <= 1; xx++) {
            for (let yy = -1; yy <= 1; yy++) {
                let neighbouringCellIndex = getIndex(x + xx, y + yy, game.width, game.height);
                if (neighbouringCellIndex !== null && cells[neighbouringCellIndex].isBomb) {
                    cell.surroundingBombs++;
                }
            }
        }
    }
};

const revealArea = (index) => {
    // list of candidates (indexes)
    // list of visited (indexes)
    // add the clicked cell to candidates
    // start looping over candidates, until the list is empty
    // for each cell:
    // - check the state, if false, set it to true
    // - if already true, stop
    // - add neighbours to candidates, IF they`re not already in visited
    // - move self to visited

    const candidates = [index];
    const visited = [];

    while (candidates.length > 0) {
        const candidateIndex = candidates.pop();

        // Keep track of the fact that weve already considered this cell
        visited.push(candidateIndex);

        // If this index is not valid (out of bounds), skip it
        if (candidateIndex === null) continue;

        const candidate = cells[candidateIndex];
        console.log(candidateIndex, candidate);

        // Cell is already revealed, we dont need to check its neighbours and shit
        if (candidate.revealed) continue;

        // Cell is hidden, lets turn it on
        candidate.revealed = true;

        // If that cell has bombs surrounding it, we dont keep going
        if (candidate.surroundingBombs > 0) continue;

        // Lets check the neighbours
        const { x, y } = getCoords(candidateIndex, game.width, game.height);

        // However, we are efficient boyse. We just get a bunch of indexes and loop through them
        const neighbouringIndexes = [
            getIndex(x + 1, y, game.width, game.height), // right // number OR null if OOB
            getIndex(x - 1, y, game.width, game.height), // left
            getIndex(x, y + 1, game.width, game.height), // etc
            getIndex(x, y - 1, game.width, game.height),
            getIndex(x - 1, y - 1, game.width, game.height),
            getIndex(x - 1, y + 1, game.width, game.height),
            getIndex(x + 1, y - 1, game.width, game.height),
            getIndex(x + 1, y + 1, game.width, game.height),
        ];

        // Does the same thing with fewer lines of code, but far less readable
        // const neighbouringIndexes = [];
        // for (let xx = -1; xx <= 1; xx++) {
        //   for (let yy = -1; yy <= 1; yy++) {
        //     neighbouringIndexes.push(getIndex(x + xx, y + yy));
        //   }
        // }

        neighbouringIndexes.forEach((i) => {
            if (i !== null && !visited.includes(i)) {
                candidates.push(i);
            }
        });
    }
};
