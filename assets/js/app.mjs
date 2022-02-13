import $ from "jquery";
import { getCoords, getIndex } from "./lib";
let gameState = 0;

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
    newGame(9, 9, 10);
});

const rightClick = () => {
    $(document).on("contextmenu", ".grid-cell", function () {
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

window.addEventListener(
    "contextmenu",
    function (e) {
        e.preventDefault();
    },
    false
);

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
        const $cell = $(`<div class="grid-cell untouched"></div>`);
        $cell.click(() => clickCell(i));
        if (cell.revealed) {
            // add some classes to visual the cell state
            if (cell.isBomb) {
                $cell.text(`💣`);
                gameState = 0;
            } else if (cell.hasFlag) $cell.text(`🚩`);
            else if (cell.surroundingBombs > 0) {
                $cell.text(cell.surroundingBombs);
                $cell.addClass("empty-cell");
            } else {
                $cell.text(``);
                $cell.addClass("empty-cell");
            }
        }

        grid.append($cell);
    }
};

const clickCell = (index) => {
    const cell = cells[index];

    if (cell.revealed) return;

    if (cell.isBomb) {
        // Cell is a bomb, just reveal it
        cell.revealed = true;
    } else if (cell.surroundingBombs > 0) {
        // Cell is not a bomb but has a nearby bomb. Reveal it.
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
