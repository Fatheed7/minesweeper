import $ from "jquery";
import { getCoords, getIndex } from "./lib";
const bombNo = document.getElementById("bombNo");
const flagNo = document.getElementById("flagNo");
let gameState = 0;
let secondCounter = -1;
let timeCounter = "";
let bombCells = [];

// Holds all the cells in a left to right, top to bottom order.
const cells = [
    // index is used to keep track of coords
    // {
    //     revealed: false,
    //     isBomb: false,
    //     hasFlag: false,
    //     hasQuestion: false
    //     surroundingBombs: 0,
    // }
];

const game = {
    width: 9,
    height: 9,
    bombCount: 10,
};

// Get flag count
// cells.filter((c) => c.hasFlag).length;
// cells.filter((c) => c.isBomb).length;

/**
 * On document load, add functionality to the newgame buttons
 */
$(() => {
    $(`#newgame-beginner`).click(() => {
        newGame(9, 9, 10);
        $("#grid").css("width", "45%");
        document.getElementById("gameWrap").classList.remove("d-none");
        gameState = 1;
    });
    $(`#newgame-intermediate`).click(() => {
        newGame(16, 16, 40);
        $("#grid").css("width", "45%");
        $("gameWrap").removeClass("d-none");
        document.getElementById("gameWrap").classList.remove("d-none");
        gameState = 1;
    });
    $(`#newgame-expert`).click(() => {
        newGame(30, 16, 99);
        $("#grid").css("width", "75%");
        $("gameWrap").removeClass("d-none");
        document.getElementById("gameWrap").classList.remove("d-none");
        gameState = 1;
    });
    rightClick();
});

window.addEventListener(
    "contextmenu",
    function (e) {
        e.preventDefault();
    },
    false
);

const newGame = (width, height, bombCount) => {
    bombCells = [];
    cells.length = 0;
    game.width = width;
    game.height = height;
    game.bombCount = bombCount;
    $(bombNo).text(bombCount);
    $(flagNo).text(bombCount);
    document.getElementsByClassName("counters")[1].classList.remove("d-none");
    document.getElementsByClassName("counterContainer")[0].classList.remove("d-none");
    document.getElementsByClassName("welcome")[0].classList.add("d-none");
    document.getElementById("gameWrap").classList.remove("d-none");
    clearInterval(timeCounter);
    timeCounter = setInterval(gameTimer, 1000);
    secondCounter = -1;
    gameTimer();

    for (let i = 0; i < width * height; i++) {
        cells.push({
            revealed: false,
            isBomb: false,
            hasFlag: false,
            hasQuestion: false,
            surroundingBombs: 0,
        });
    }

    plantBombs(bombCount);
    calculateSurroundings();
    drawGrid();
};

const plantBombs = (bombCount) => {
    while (bombCells.length < bombCount) {
        let bomb = Math.floor(Math.random() * (game.width * game.height));
        if (bombCells.indexOf(bomb) === -1) bombCells.push(bomb);
    }
    for (let i = 0; i < bombCells.length; i++) {
        cells[bombCells[i]].isBomb = true;
    }
};

const gameTimer = () => {
    ++secondCounter;
    let seconds = secondCounter;
    document.getElementById("gameTimer").innerHTML = seconds;
};

const drawGrid = () => {
    const grid = $(`#grid`);
    grid.css(`grid-template-columns`, `repeat(${game.width}, 1fr)`);
    grid.empty();

    for (let [i, cell] of cells.entries()) {
        const $cell = $(`<div class="grid-cell untouched"></div>`);
        $cell.click(() => clickCell(i));

        if (cell.revealed) {
            $cell.addClass("empty-cell");
            $cell.removeClass("untouched");
            // add some classes to visual the cell state
            if (cell.isBomb) {
                $cell.hasFlag = false;
                $cell.hasQuestion = false;
                $cell.text(`💥`);
                $cell.revealed = true;
            } else if (cell.hasFlag) $cell.text(`🚩`);
            else if (cell.surroundingBombs > 0) {
                $cell.text(cell.surroundingBombs);
            } else {
                $cell.text(``);
            }
        }

        if (cell.hasFlag) $cell.text(`🚩`);
        if (cell.hasQuestion) $cell.text(`❓`);
        grid.append($cell);
    }
};

const clickCell = (index) => {
    if (gameState == 0) return;
    const cell = cells[index];

    if (cell.revealed) return;

    if (cell.hasFlag || cell.hasQuestion) {
        cell.hasFlag = false;
        cell.hasQuestion = false;
    }
    if (cell.isBomb) {
        cell.revealed = true;
        clearInterval(timeCounter);
        gameState = 0;
        loseGame();
    } else if (cell.surroundingBombs > 0) {
        // Cell is not a bomb but has a nearby bomb. Reveal it.
        cell.revealed = true;
    } else {
        // Cell has no neighbouring bombs. Start exploring!
        revealArea(index);
    }
    drawGrid();
};

const rightClick = () => {
    $(document).on("contextmenu", ".grid-cell", function () {
        if (gameState == 0) return;
        const i = $(this).index();

        if (cells[i].revealed) return;

        if (cells[i].hasFlag) {
            flagNo.innerHTML++;
            cells[i].hasFlag = false;
            cells[i].hasQuestion = true;
        } else if (cells[i].hasQuestion) {
            cells[i].hasQuestion = false;
        } else {
            cells[i].hasFlag = true;
            flagNo.innerHTML--;
        }
        drawGrid();
    });
};

function loseGame() {
    loseContent();
}

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
    const candidates = [index];
    const visited = [];

    while (candidates.length > 0) {
        const candidateIndex = candidates.pop();

        // Keep track of the fact that weve already considered this cell
        visited.push(candidateIndex);

        // If this index is not valid (out of bounds), skip it
        if (candidateIndex === null) continue;

        const candidate = cells[candidateIndex];

        // Cell is already revealed, we dont need to check its neighbours
        if (candidate.revealed) continue;

        // Cell is hidden, lets turn it on
        candidate.revealed = true;

        // If that cell has bombs surrounding it, we dont keep going
        if (candidate.surroundingBombs > 0) continue;

        // Lets check the neighbours
        const { x, y } = getCoords(candidateIndex, game.width, game.height);

        const neighbouringIndexes = [
            getIndex(x + 1, y, game.width, game.height),
            getIndex(x - 1, y, game.width, game.height),
            getIndex(x, y + 1, game.width, game.height),
            getIndex(x, y - 1, game.width, game.height),
            getIndex(x - 1, y - 1, game.width, game.height),
            getIndex(x - 1, y + 1, game.width, game.height),
            getIndex(x + 1, y - 1, game.width, game.height),
            getIndex(x + 1, y + 1, game.width, game.height),
        ];

        neighbouringIndexes.forEach((i) => {
            if (i !== null && !visited.includes(i)) {
                candidates.push(i);
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
    $(".modal-title").text("Customise your settings!");
    $(".modal-body").load("assets/html/settings.html ");
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
