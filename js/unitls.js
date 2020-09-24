'use strict';
//var gPicIdx = getRandomInteger(0, 4);

function renderBoard(board) {
    var htmlStr = '';
    for (var i = 0; i < board.length; i++) {
        htmlStr += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var cellId = 'cell-' + i + '-' + j;
            htmlStr += '<td id="' + cellId + '" onclick="cellClicked(this)" oncontextmenu="cellMarked(event,this)"> '; //+ cell + ' </td>'

            if (cell.isShown && cell.isMine) { //if open a bomb
                htmlStr += BOMB;
            } else if (!cell.isShown && cell.isMarked) { // if mark empty cell 
                htmlStr += FLAG;
            } else if (!cell.isShown) { // set empty cell
                htmlStr += WALL;
            } else if (!cell.isMine) { // if open empty cell
                strcellcell.minesAroundCount;
            }
            htmlStr += '\t</td>\n';
        }
        htmlStr += '</tr>\n';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = htmlStr;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}