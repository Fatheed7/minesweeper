import { getCoords, getIndex } from "./lib.mjs";
let bombNo = document.getElementById("bombNo");
let flagNo = document.getElementById("flagNo");
let gameState = 0;
let secondCounter = -1;
let timeCounter = "";
let bombCells = [];
let storage = window.localStorage;
let hide = JSON.parse(storage.getItem("Hide"));

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

/**
 * Constant holding game width, height and bomb count
 */
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
        gameGridWidth("beginner");
        document.getElementById("gameWrap").classList.remove("d-none");
        gameState = 1;
    });
    $(`#newgame-intermediate`).click(() => {
        newGame(16, 16, 40);
        gameGridWidth("intermediate");
        document.getElementById("gameWrap").classList.remove("d-none");
        gameState = 1;
    });
    $(`#newgame-expert`).click(() => {
        newGame(30, 16, 99);
        gameGridWidth("expert");
        document.getElementById("gameWrap").classList.remove("d-none");
        gameState = 1;
    });

    //Checks if Local Storage settings exists. If not, creates settings.
    if (storage.getItem("Hide") === null) {
        defaultSettings();
    }
    //Loads settings from Local Storage
    loadSettings();
    rightClick();

    //If Hide setting is not true, then show welcome modal.
    if (!hide) {
        welcome();
        $(".helpModal").modal("show");
    }
});

function gameGridWidth(difficulty) {
    if ($(window).height < 281) {
        switch (difficulty) {
            case "beginner":
                $("#grid").css("width", "18vw");
                break;
            case "intermediate":
                $("#grid").css("width", "25vw");
                $("#gameWrap").css("padding", "5px");
                $(".buttons").css("padding", "0px");
                break;
            case "expert":
                $("#grid").css("width", "25vw");
                $("#gameWrap").css("padding", "5px");
                $(".buttons").css("padding", "0px");
                break;
        }
    } else {
        switch (difficulty) {
            case "beginner":
                $("#grid").css("width", "25vw");
                break;
            case "intermediate":
                $("#grid").css("width", "27vw");
                break;
            case "expert":
                $("#grid").css("width", "46vw");
                break;
        }
    }
}

/**
 * Disables Right Click Context Menu
 */
window.addEventListener(
    "contextmenu",
    function (e) {
        e.preventDefault();
    },
    false
);

/**
 * Checks orientation and hides small screen warning if
 * in landscape view already.
 */
window.addEventListener("orientationchange", function () {
    if (window.matchMedia("(orientation: landscape)").matches) {
        $("#smallScreen").removeClass("d-none");
    } else if (window.matchMedia("(orientation: portrait)").matches) {
        $("#smallScreen").addClass("d-none");
    }
});

/**
 * Accepts game width, height and bomb count.
 * Clears cells array, clears bombCells array
 * Hides default message on Stats Bar and shows counters
 * Resets timer and starts a new timer
 */
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

/**
 * Generates random coordinates and places bombs within the game.
 */
const plantBombs = (bombCount) => {
    while (bombCells.length < bombCount) {
        let bomb = Math.floor(Math.random() * (game.width * game.height));
        if (bombCells.indexOf(bomb) === -1) bombCells.push(bomb);
    }
    for (let i = 0; i < bombCells.length; i++) {
        cells[bombCells[i]].isBomb = true;
    }
};

/**
 * Counts seconds and applies them to #gameTimer
 */
const gameTimer = () => {
    ++secondCounter;
    let seconds = secondCounter;
    document.getElementById("gameTimer").innerHTML = seconds;
};

/**
 * Is called by clickCell and rightClick and updates the board on user
 * actions, removing untouched class and applying empty-cell class
 * where needed.
 */
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

/**
 * Gets the index of the cell clicked and determines what is contained
 * within the cell
 */
const clickCell = (index) => {
    if (gameState == 0) return;
    const cell = cells[index];

    if (cell.revealed) return;

    if (cell.hasFlag || cell.hasQuestion) {
        cell.hasFlag = false;
        flagNo.innerHTML++;
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

/**
 * Checks game state
 * Returns if game has ended or cell is empty.
 * Adds flag if cell is unrevealed
 * Removes flag and adds ? if cell already contains flag
 * Removes ? and returns cell to original state if cell already contains
 */
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

/**
 * Updates the content of the modal
 * and displays it.
 */
function loseGame() {
    navigator.vibrate(1000);
    loseContent();
    $(".helpModal").modal("show");
}

/**
 * Updates the content of the modal
 * and displays it.
 */
function winGame() {
    gameState = 0;
    winContent();
    $(".helpModal").modal("show");
}

/**
 * Displays all bombs on the board when the game is lost.
 */
function showAllBombs() {
    bombCells.forEach((bomb) => {
        (cells[bomb].hasFlag = false),
            (cells[bomb].hasQuestion = false),
            $(".grid-cell:nth-of-type(" + bomb + ")").text(`💥`),
            (cells[bomb].revealed = true);
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

        // Keep track of the fact that we've already considered this cell
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

        // Check the neighbours
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
/**
 * On click, updates modal content to helpContent()
 */
$(".helpFloat").click(function () {
    helpContent();
});

/**
 * On click, updates modal content to settings()
 */
$(".settingsFloat").click(function () {
    settings();
});

//
// Modal Content
//

/**
 * Used to detect if .modalButton is clicked.
 * If game state is zero, and a game is in progress,
 * don't restart the game.
 */
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

/**
 * Code between lines 387 - 419 update the content
 * of the helpModal, allowing a single modal to be used
 * and reducing the amount of HTML needed.
 */
const helpContent = () => {
    $(".modal-title").text("How to play Minesweeper!");
    $("#helpModalBody").load("assets/html/helpcontent.html");
    $(".modalButton").text("Close Help!");
};

const settings = () => {
    $("#deleteStorage").removeClass("d-none");
    $("#deleteConfirm").addClass("d-none");
    $("#resetStorage").removeClass("d-none");
    $("#resetConfirm").addClass("d-none");
    $(".modal-title").text("Customise your settings!");
    $(".modalButton").text("Close window!");
    loadSettings();
};

const welcome = () => {
    $(".modal-title").text("Welcome to Minesweeper!");
    $("#helpModalBody").load("assets/html/welcomecontent.html");
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

// Reset Storage Settings
/**
 * When #resetStorage is clicked,
 * hide button and show confirmation buttons.
 */
$("#resetStorage").click(function () {
    $("#resetStorage").addClass("d-none");
    $("#resetConfirm").removeClass("d-none");
});

/**
 * When #resetYes is clicked
 * hide confirm buttons and make
 * original button visible.
 * Reset local storage to default values and
 * reveal text to confirm reset.
 */
$("#resetYes").click(function () {
    $("#resetStorage").removeClass("d-none");
    $("#resetConfirm").addClass("d-none");
    defaultSettings();
    applySettingsStyle();
    $(".resetConfirmMessage").removeClass("d-none");
    setTimeout(function () {
        $(".resetConfirmMessage").addClass("d-none");
    }, 3000);
});

/**
 * When #resetNo is clicked
 * hide confirm buttons and make
 * original button visible.
 */
$("#resetNo").click(function () {
    $("#resetStorage").removeClass("d-none");
    $("#resetConfirm").addClass("d-none");
});

// Delete Store Settings
/**
 * When #deleteStorage is clicked,
 * hide button and show confirmation buttons.
 */
$("#deleteStorage").click(function () {
    $("#deleteStorage").addClass("d-none");
    $("#deleteConfirm").removeClass("d-none");
});

/**
 * When #deleteYes is clicked
 * hide confirm buttons and make
 * original button visible.
 * Delete local storage and reveal text
 * to confirm deletion.
 */
$("#deleteYes").click(function () {
    $("#deleteStorage").removeClass("d-none");
    $("#deleteConfirm").addClass("d-none");
    $(".deleteConfirmMessage").removeClass("d-none");
    setTimeout(function () {
        $(".deleteConfirmMessage").addClass("d-none");
    }, 3000);
    storage.clear();
});

/**
 * When #deleteNo is clicked
 * hide confirm buttons and make
 * original button visible.
 */
$("#deleteNo").click(function () {
    $("#deleteStorage").removeClass("d-none");
    $("#deleteConfirm").addClass("d-none");
});

/**
 * Saves the requested settings to local storage.
 */
$("#saveSettings").click(function () {
    storage.setItem("Unrevealed", unrevealedColour.value);
    storage.setItem("Empty", emptyColour.value);
    storage.setItem("Hide", document.getElementById("welcomeCheckbox").checked);
    applySettingsStyle();
});

/**
 * Loads the settings after they've been saved so they can be applied to the board
 */
function loadSettings() {
    document.getElementById("unrevealedColour").value = storage.Unrevealed;
    document.getElementById("emptyColour").value = storage.Empty;
    if (hide == true) {
        document.getElementById("welcomeCheckbox").checked = true;
    } else {
        document.getElementById("welcomeCheckbox").checked = false;
    }
}

/**
 * Writes default settings to Local Storage
 */
function defaultSettings() {
    storage.clear();
    storage.setItem("Unrevealed", "#ababab");
    storage.setItem("Empty", "#d3d3d3");
    storage.setItem("Hide", false);
    document.getElementById("unrevealedColour").value = storage.Unrevealed;
    document.getElementById("emptyColour").value = storage.Empty;
    document.getElementById("welcomeCheckbox").checked = false;
}

/**
 * If settings are reset, deleted or saves, applies the style to the board.
 */
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
