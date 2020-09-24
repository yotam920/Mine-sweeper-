'use strict';
/**TO DO:
 * stop-watch
 * live func
 * rander level -> mines
 * smiley mode
 * Bonus tasks
 */
var FLAG = '🚩'; /**another option: ⛳ */
var BOMB = '💣'; /**another option:💥*/
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
document.querySelector('.vonMessage').style.display = 'none'

var gLevel = {
    SIZE: 4, //8 // 12
    MINES: 2 //12 //30
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function initGame(size) {
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gLIVES = 3;
    gBorad = bulidBorad(size);
    renderBoard(gBorad);
    firstClick = false;

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
            //search in negs matrix
            for (var k = i - 1; k < i + 2 && k < len; k++) {
                if (k < 0 || len - 1 < k) continue; // out of index
                for (var m = j - 1; m < j + 2 && m < len; m++) {
                    if (m < 0 || len <= m) continue; // out of index
                    if (board[k][m].isMine === true) {
                        board[i][j].minesAroundCount += 1;
                    }
                }
            } //end search in negs matrix 
        }
    }
}

/*on right-click mark/unmark flag*/
function cellMarked(ev, elCell) {
    var cellPos = getCellPos(elCell.id);
    var i = cellPos.i
    var j = cellPos.j
    console.log(cellPos);
    if (gBorad[i][j].isShown) return;
    if (!gBorad[i][j].isMarked) {
        gBorad[i][j].isMarked = true;
        elCell.innerHTML = FLAG;
    } else {
        gBorad[i][j].isMarked = false;
        elCell.innerHTML = WALL;
    }
    ev.preventDefault();
    checkGameOver(gBorad);
}

//the func get gborad[i][j] object 
function cellClicked(elCell) {
    if (!firstClick) {
        firstClick = true
        setRandomMines();
    }
    if (!gGame.isOn) return;

    var cellPos = getCellPos(elCell.id);
    var i = cellPos.i
    var j = cellPos.j
    var cell = gBorad[i][j];

    if (cell.isMine === false) {
        cell.isShown = true;
        elCell.innerHTML = cell.minesAroundCount;
    } else {
        elCell.innerHTML = BOMB;
        alert('You stepped on Mine '); //scould be after the explposin
    }
    checkGameOver(gBorad);
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
        if (gBorad[row][columm].isMine === false) {
            gBorad[row][columm].isMine = true;
            createMine++;
        }
    }
    setMinesNegscount();
}

/*the game is ends when all the mines are marked and all the other are shown */
function checkGameOver(board) {
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
    gGame.shownCount = countEmptyShown;
    gGame.markedCount = countMineMarked;
    var isGameOver = (countMineMarked + countEmptyShown === (len ** 2));
    if (isGameOver) {
        gGame.isOn = false;
        document.querySelector('.vonMessage').style.display = 'block'
    }
    return isGameOver;
}

// var gTime = '0:00.000';
// var elTimer = document.querySelector('.timer');

// function playTime(time) {
//     var elTimer = document.querySelector('.timer');
//     gTime = new Date(time).toISOString().slice(15, -1);
//     elTimer.innerText = 'Time: ' + gTime;
// }