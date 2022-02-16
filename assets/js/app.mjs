import { getCoords, getIndex } from "./lib.mjs";
let bombNo = document.getElementById("bombNo");
let flagNo = document.getElementById("flagNo");
let gameState = 0;
let secondCounter = -1;
let timeCounter = "";
let bombCells = [];
let storage = window.localStorage;

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

/**
 * On document load, add functionality to the newgame buttons
 */
document.addEventListener("DOMContentLoaded", function () {
    $(`#newgame-beginner`).click(() => {
        newGame(9, 9, 10);
        $("#grid").css("width", "45%");
        document.getElementById("gameWrap").classList.remove("d-none");
        gameState = 1;
    });
    $(`#newgame-intermediate`).click(() => {
        newGame(16, 16, 40);
        $("#grid").css("width", "45%");
        document.getElementById("gameWrap").classList.remove("d-none");
        gameState = 1;
    });
    $(`#newgame-expert`).click(() => {
        newGame(30, 16, 99);
        $("#grid").css("width", "75%");
        document.getElementById("gameWrap").classList.remove("d-none");
        gameState = 1;
    });

    if (storage.getItem("Hide") === null) {
        defaultSettings();
    }
    loadSettings();
    rightClick();

    if (storage.getItem("Hide")) {
        welcome();
        $(".helpModal").modal("show");
    }
});

window.addEventListener(
    "contextmenu",
    function (e) {
        e.preventDefault();
    },
    false
);

const newGame = (width, height, bombCount) => {
    gameState = 1;
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
    applySettingsStyle();
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
    } else if (cell.surroundingBombs > 0) {
        // Cell is not a bomb but has a nearby bomb. Reveal it.
        cell.revealed = true;
    } else {
        // Cell has no neighbouring bombs. Start exploring!
        revealArea(index);
    }
    if (gameState !== 0) {
        if (cells.filter((c) => c.revealed).length == game.width * game.height - game.bombCount) {
            winGame();
            clearInterval(timeCounter);
        }
    } else {
        showAllBombs();
        loseGame();
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
            if (flagNo.innerHTML == 0) return;
            else {
                cells[i].hasFlag = true;
                flagNo.innerHTML--;
            }
        }
        drawGrid();
    });
};

function loseGame() {
    loseContent();
    $(".helpModal").modal("show");
}

function winGame() {
    gameState = 0;
    winContent();
    $(".helpModal").modal("show");
}

function showAllBombs() {
    bombCells.forEach((bomb) => {
        (cells[bomb].hasFlag = false),
            ((cells[bomb].hasQuestion = false),
            $(".grid-cell:nth-of-type(" + bomb + ")").text(`💥`),
            (cells[bomb].revealed = true));
    });
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
$(".helpFloat").click(function () {
    helpContent();
});

$(".settingsFloat").click(function () {
    settings();
});

//
// Modal Content
//
const helpContent = () => {
    $(".modal-title").text("How to play Minesweeper!");
    $("#helpModalBody").load("assets/html/helpContent.html");
    $(".modalButton").text("Close Help!");
};

const settings = () => {
    $("#deleteStorage").removeClass("d-none");
    $("#storageConfirm").addClass("d-none");
    loadSettings();
};

const welcome = () => {
    $(".modal-title").text("Welcome to Minesweeper!");
    $("#helpModalBody").load("assets/html/welcomeContent.html");
    $(".modalButton").text("Close window!");
};

const winContent = () => {
    $(".modal-title").text("Congratulations!");
    $("#helpModalBody").html("You win! 😀");
    $(".modalButton").text("Play again?");
};

const loseContent = () => {
    $(".modal-title").text("Kaboom!");
    $("#helpModalBody").html("You lost! 😞");
    $(".modalButton").text("Play again?");
};

$("#deleteStorage").click(function () {
    $("#deleteStorage").addClass("d-none");
    $("#storageConfirm").removeClass("d-none");
});

$("#storageYes").click(function () {
    $("#deleteStorage").removeClass("d-none");
    $("#storageConfirm").addClass("d-none");
    defaultSettings();
    applySettingsStyle();
});

$("#storageNo").click(function () {
    $("#deleteStorage").removeClass("d-none");
    $("#storageConfirm").addClass("d-none");
});

$("#saveSettings").click(function () {
    storage.setItem("Unrevealed", unrevealedColour.value);
    storage.setItem("Empty", emptyColour.value);
    storage.setItem("Hide", document.getElementById("welcomeCheckbox").checked);
    applySettingsStyle();
});

$(".modalButton").click(function () {
    if (gameState == 0) {
        if (document.getElementById("grid").innerHTML.length > 0) {
            if (game.width == 9) {
                newGame(9, 9, 10);
            } else if (game.width == 16) {
                newGame(16, 16, 40);
            } else {
                newGame(30, 16, 99);
            }
        }
    }
});

function loadSettings() {
    document.getElementById("unrevealedColour").value = storage.Unrevealed;
    document.getElementById("emptyColour").value = storage.Empty;
    console.log(storage);
    if (storage.getItem("Hide")) {
        $("#welcomeCheckbox").checked = true;
    } else {
        $("#welcomeCheckbox").checked = false;
    }
    if (storage.getItem("Animation")) {
        $("#animationCheckbox").checked = true;
    } else {
        $("#animationCheckbox").checked = false;
    }
}

function defaultSettings() {
    storage.clear();
    storage.setItem("Unrevealed", "#ababab");
    storage.setItem("Empty", "#d3d3d3");
    storage.setItem("Hide", false);
    storage.setItem("Animation", false);
    document.getElementById("unrevealedColour").value = storage.Unrevealed;
    document.getElementById("emptyColour").value = storage.Empty;
    document.getElementById("welcomeCheckbox").checked = false;
    document.getElementById("animationCheckbox").checked = false;
}

function applySettingsStyle() {
    let untouched = document.querySelectorAll(".untouched");
    for (let i = 0; i < untouched.length; i++) {
        untouched[i].style.backgroundColor = storage.Unrevealed;
    }
    let empty = document.querySelectorAll(".empty-cell");
    for (let i = 0; i < empty.length; i++) {
        empty[i].style.backgroundColor = storage.Empty;
    }
}

// End of Modal Content
