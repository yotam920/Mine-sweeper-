'use strict';

var FLAG = '🚩'; /**another option: ⛳ */
var BOMB = '💣'; /**another option: 💥 */
var WALL = '🔳'; /**another option: ⬜  ⬛  🔲 */
var NORMAL = '🙂';
var LOSE = '🥺';
var VIN = '😎';

var gBeginner = 4;
var gMedium = 8;
var gExpert = 12;
var gBorad;
var firstClick;
var gLIVES;
var gLastlevel;
var gTimerInterval;
var gTimer = '0:00.000';
var gExplposin;

var gLevel = {
    SIZE: 4, //08  //12
    MINES: 2 //12 //30
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function initGame(size) {
    gGame = gGameSetup();
    gLIVES = 3;
    gExplposin = 0;
    gLevel = gLevelInit(size);
    gLastlevel = gLevel.SIZE;
    gBorad = bulidBorad(size);
    renderBoard(gBorad);
    firstClick = false;
    resetTimer();
    renderLives();
    renderSmiley();
    renderMarkedCount();
}

function gLevelInit(size) {
    var level;
    if (size === gBeginner) {
        var level = {
            SIZE: 4,
            MINES: 2
        };
        gLIVES = 1;
    } else if (size === gMedium) {
        var level = {
            SIZE: 8,
            MINES: 12
        };
    } else {
        var level = {
            SIZE: 12,
            MINES: 30
        };
    }
    return level;
}

function gGameSetup() {
    var game = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    return game
}

function bulidBorad(size) {
    var borad = [];
    for (var i = 0; i < size; i++) {
        borad[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            borad[i][j] = cell;
        }
    }
    return borad;
}

function setMinesNegscount(board = gBorad) {
    var len = board.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            board[i][j].minesAroundCount = matrixNegs(i, j, len, board);
        }
    }
    renderBoard(gBorad);
}

//setMinesNegscount help function
function matrixNegs(i, j, len, board) {
    var count = 0;
    for (var k = Math.max(i - 1, 0); k < Math.min(i + 2, len); k++) {
        for (var m = Math.max(j - 1, 0); m < Math.min(j + 2, len); m++) {
            if (board[k][m].isMine === true) {
                count++;
            }
        }
    } //end search in negs matrix 
    return count;
}

/*on right-click mark/unmark flag*/
function cellMarked(ev, elCell) {
    var cellPos = getCellPos(elCell.id);
    var i = cellPos.i
    var j = cellPos.j
    if (gBorad[i][j].isShown) return;
    else if (!gBorad[i][j].isMarked) {
        gBorad[i][j].isMarked = true;
        elCell.innerHTML = FLAG;
        gGame.markedCount++;
    } else {
        gBorad[i][j].isMarked = false;
        elCell.innerHTML = WALL;
        gGame.markedCount--;
    }
    ev.preventDefault();
    checkVictory(gBorad);
    renderMarkedCount();
}

//the func get gborad[i][j] object 
function cellClicked(elCell) {
    if (!gGame.isOn) return;

    var cellPos = getCellPos(elCell.id);
    var i = cellPos.i
    var j = cellPos.j
    var cell = gBorad[i][j];

    if (cell.isMine === false) {
        cell.isShown = true;
        elCell.innerHTML = cell.minesAroundCount;
    } else {
        gLIVES--;
        cell.isShown = true;
        cell.isMarked = true; // for checkVictory calc
        elCell.innerHTML = BOMB;
        if (gLIVES > 0) {
            gExplposin++;
            console.log(gExplposin);
            renderLives(gLIVES);
            alert('You stepped on Mine'); //explposin
            return;
        }
        renderLives(gLIVES);
        gGame.isOn = false;
        clearInterval(gTimerInterval);
        alert('GAME-OVER You stepped on Mine'); //explposin after last life
        revealMine(gBorad);
    }
    // set radom mines after first click
    if (!firstClick) {
        firstClick = true
        setRandomMines();
        timer();
    }
    checkVictory(gBorad);
    renderSmiley();
    renderMarkedCount();
}

//help func -  get 'cell-2-7' and returns {i:2, j:7}
function getCellPos(strCellClass) {
    var cell = {};
    var parts = strCellClass.split('-');
    cell.i = +parts[1]
    cell.j = +parts[2];
    return cell;
}

function setRandomMines(num1 = gLevel.MINES, num2 = gLevel.SIZE) {
    var createMine = 0;
    while (createMine !== num1) {
        var row = getRandomInteger(0, num2);
        var columm = getRandomInteger(0, num2);
        if (gBorad[row][columm].isMine === false && gBorad[row][columm].isShown === false) {
            gBorad[row][columm].isMine = true;
            createMine++;
        }
    }
    setMinesNegscount();
}

/*the game is ends when all the mines are marked and all the other are shown */
function checkVictory(board) {
    var countMineMarked = 0;
    var countEmptyShown = 0
    var len = gLevel.SIZE;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            if (board[i][j].isMine && board[i][j].isMarked) {
                countMineMarked++;
            }
            if (!board[i][j].isMine && board[i][j].isShown) {
                countEmptyShown++;
            }
        }
    }
    var isVictory = (countMineMarked + countEmptyShown === (len ** 2));
    if (isVictory) {
        gGame.isOn = false;
        clearInterval(gTimerInterval);
    }
    return isVictory;
}

function timer() {
    var milSecElapsed = 0;
    gTimerInterval = setInterval(function() {
        milSecElapsed += 5;
        renderTimer(milSecElapsed);
    }, 5);
}

function resetTimer() {
    clearInterval(gTimerInterval);
    renderTimer(0);
}

function renderTimer(time) {
    var elTimer = document.querySelector('.timer');
    gTimer = new Date(time).toISOString().slice(15, -1);
    gGame.secsPassed = gTimer;
    elTimer.innerText = 'Time: ' + gTimer;
}

function renderLives(live) {
    var elLives = document.querySelector('.lives');
    elLives.innerHTML = 'Lives: ' + gLIVES;
}

function renderSmiley() {
    var elSmiley = document.querySelector('.smiley-button');
    if (!gGame.isOn && gLIVES === 0) elSmiley.innerHTML = LOSE;
    else if (!gGame.isOn) elSmiley.innerHTML = VIN;
    else elSmiley.innerHTML = NORMAL;

}
// the function display marked count cell
function renderMarkedCount() {
    var LeftMark = gLevel.MINES - gGame.markedCount - gExplposin;
    console.log("left mark:", gExplposin);
    console.log('after exp:', LeftMark)
    var elMark = document.querySelector('.mraked-mine');
    elMark.innerHTML = LeftMark;
}

function revealMine(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (board[i][j].isMine && !board[i][j].isMarked) {
                board[i][j].isShown = true;
            }
        }
    }
    renderBoard(gBorad);
}