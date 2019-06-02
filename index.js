/**
* This program is a boilerplate code for the standard tic tac toe game
* Here the “box” represents one placeholder for either a “X” or a “0”
* We have a 2D array to represent the arrangement of X or O is a grid
* 0 -> empty box
* 1 -> box with X
* 2 -> box with O
*
* Below are the tasks which needs to be completed:
* Imagine you are playing with the computer so every alternate move should be done by the computer
* X -> player
* O -> Computer
*
* Winner needs to be decided and has to be flashed
*
* Extra points will be given for approaching the problem more creatively
* 
*/

const grid = [];
const GRID_LENGTH = 3;
let turn = 'X';

let GRID_MOVE_CHOICES = [1, 2]  // 1=> player, 2=>computer

/* This provides a convenient way of choosing a grid coordinate
 ['1', '2', '3',
  '4', '5', '6',
  '7', '8', '9']
*/
let grid_coordinate_mapping = {
  1: '0,0',
  2: '0,1',
  3: '0,2',
  4: '1,0',
  5: '1,1',
  6: '1,2',
  7: '2,0',
  8: '2,1',
  9: '2,2'
};

// To maintain the empty slots during the game runtime
let empty_slots = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

let GAME_STATE_MESSAGES = {
  'O': 'Your move!',  // Game state is open
  'H': 'You have won!',  // Human has won
  'C': 'Computer has won, May be next time!',  // Computer has won
  'S': 'It is a stalemate. Nobody wins..', // Stalemate, no more moves left
}

// Coordinate object - Represents a cell in the grid
// (0,0)=>top-left and (2,2)=>bottom-right
var Coordinate = function(x, y){
  this.x = String(x);
  this.y = String(y);
}

// Global variables to track winner line
// within the grid
let win_start = null;
let win_end = null;

function initializeGrid() {
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    const tempArray = [];
    for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
      tempArray.push(0);
    }
    grid.push(tempArray);
  }
}

function getRowBoxes(colIdx) {
  let rowDivs = '';

  for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
    let additionalClass = 'darkBackground';
    let content = '';
    const sum = colIdx + rowIdx;
    if (sum%2 === 0) {
      additionalClass = 'lightBackground'
    }
    const gridValue = grid[colIdx][rowIdx];
    if(gridValue === 1) {
      content = '<span class="cross">X</span>';
    }
    else if (gridValue === 2) {
      content = '<span class="zero">O</span>';
    }
    rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
      additionalClass + '">' + content + '</div>';
  }
  return rowDivs;
}

function getColumns() {
  let columnDivs = '';
  for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
    let coldiv = getRowBoxes(colIdx);
    coldiv = '<div class="rowStyle">' + coldiv + '</div>';
    columnDivs = columnDivs + coldiv;
  }
  return columnDivs;
}

function renderMainGrid() {
  const parent = document.getElementById("grid");
  const columnDivs = getColumns();
  parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function drawWinningLine(start, end){
  // Get the mid coordinate
  mid = null;
  if(start.x == end.x){
    mid = new Coordinate(start.x, '1');
  }else if(start.y == end.y){
    mid = new Coordinate('1', start.y);
  }else{
    mid = new Coordinate('1', '1');
  }

  // Paint the three coordinates
  boxes = document.getElementsByClassName("box");
  for (var i = 0; i < boxes.length; i++) {
    coordinates = grid_coordinate_mapping[i+1].split(',');
    x_coord = String(coordinates[0]);
    y_coord = String(coordinates[1]);
    if(
      (x_coord == start.x && y_coord == start.y) ||
      (x_coord == mid.x && y_coord == mid.y) ||
      (x_coord == end.x && y_coord == end.y)
    ){
      // paint the winning style in this box
      boxes[i].classList.add('winner');
    }
  }
}

function has_someone_won(grid, move){
  /** Check if someone has won the game yet */

  // checking row wise
  for(var i=0; i< 3; i++){
    var count = 0
    for(var j=0; j<3; j++){
      if(grid[i][j] != move){
        break;
      } else{
        count += 1;
      }
    }
    if(count == 3){
      win_start = new Coordinate(i, 0);
      win_end = new Coordinate(i, 2);
      return true;
    }
  }

  // checking column wise
  for(var j=0; j< 3; j++){
    var count = 0
    for(var i=0; i<3; i++){
      if(grid[i][j] != move){
        break;
      } else{
        count += 1;
      }
    }
    if(count == 3){
      win_start = new Coordinate(0, j);
      win_end = new Coordinate(2, j);
      return true;
    }
  }

  // checking top-left to bottom-right diagonal
  var count = 0
  for(var i=0; i< 3; i++){
    if(grid[i][i] != move)
      break;
    else
      count += 1;
  }
  if(count == 3){
    win_start = new Coordinate(0, 0);
    win_end = new Coordinate(2, 2);
    return true;
  }

  // checking bottom-right to top-left diagonal
  var count = 0
  for(var i=0; i< 3; i++){
    if(grid[i][2-i] != move)
      break;
    else
      count += 1;
  }
  if(count == 3){
    win_start = new Coordinate(0, 2);
    win_end = new Coordinate(2, 0);
    return true;
  }

}

function checkgamestate(){
  /**
  * Function to validate the state of the game during runtime
  * Returns a game state out of 'C', 'H', 'S', 'O' 
  */

  var game_state = 'O';  //default is that game is running

  mapping = {1: 'H', 2: 'C'}

  // return appropriate game_state if someone has won
  for(var i=0; i<GRID_MOVE_CHOICES.length; i++){
    m = GRID_MOVE_CHOICES[i];
    if(has_someone_won(grid, m)){
      return mapping[m];
    }
  }

  // check if the game has gone into a stalemate
  if(empty_slots.length == 0){
    return 'S';
  } else{
    return 'O';
  }

}

function randomChoice(arr) {
  /**
   * Choose a random item out of an array
   */

  return arr[Math.floor(arr.length * Math.random())];
}

function updateGridValues(rowId, colId, newValue){
  /**
   * Function to update the cell value of the grid
   * based on the move of human or computerMove
   */

  grid[rowId][colId] = newValue;

  // update the empty_slots list by kicking out used slot
  var coordinate = String(rowId) + ',' + String(colId);
  var used_slot_key = -1;
  for(var key in grid_coordinate_mapping){
    if(grid_coordinate_mapping[key] == coordinate){
      used_slot_key = key;
    }
  }

  // kick out the filled slots of the empty_slots array
  kick_out_index = empty_slots.indexOf(used_slot_key);
  empty_slots.splice(kick_out_index, 1);

  game_state = checkgamestate();

  // Validate game state
  if(game_state=='C' || game_state == 'H' || game_state == 'S'){
    // display appropriate message
    flashMessages(game_state);
  }
  return game_state;
}

function computerMove(){
  /**
   * Update the grid slot value to 2 if empty.
   * Returns the updated game_state
   */

  var random_slot = randomChoice(empty_slots);
  var coordinate = grid_coordinate_mapping[random_slot].split(',');
  var rowId = coordinate[0];
  var colId = coordinate[1];
  var newValue = 2;
  return updateGridValues(rowId, colId, newValue);
}


function humanMove(rowId, colId){
  /**
   * Update the grid slot value to 1.
   * Returns the updated game_state
   */

  var newValue = 1;
  return updateGridValues(rowId, colId, newValue);
}

function onBoxClick() {
  /**
   * Perform action when human clicks on
   * an empty cell
   */

  // Transposing the cell index across the top-down diagonal
  var colId = this.getAttribute("rowIdx");
  var rowId = this.getAttribute("colIdx");

  // Actuate human move
  result = humanMove(rowId, colId);

  // If moves are left, let the computer move
  if(result!='H' && result != 'S'){
    result = computerMove();
  }

  // Redraw Grid to update the markers
  renderMainGrid();
  addClickHandlers();

  // Paint winning color in case of a winner
  if(result=='C' || result=='H'){
    drawWinningLine(win_start, win_end);
  }

}

function addClickHandlers() {
  /**
   * Add click event listeners in the cells
   * of the grid which are empty.
   */

  var boxes = document.getElementsByClassName("box");
  for (var i = 0; i < empty_slots.length; i++) {
    empty_index = empty_slots[i]-1;
    boxes[empty_index].addEventListener('click', onBoxClick, false);
  }

}

function flashMessages(game_state='O'){
  /**
   * Show messages in a message area
   * in the HTML
   */

  message = GAME_STATE_MESSAGES[game_state];

  // Intentionally left this console message
  console.log(message);

  const messageDiv = document.getElementById("messages");
  messageDiv.innerHTML = '<p>'+message+'</p>';
}

initializeGrid();
renderMainGrid();
addClickHandlers();
flashMessages();
