/* global $, sessionStorage*/

////////////////////////////////////////////////////////////////////////////////
///////////////////////// VARIABLE DECLARATIONS ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// HTML jQuery Objects
var board = $("#board");
var scoreElement = $("#score");
var highScoreElement = $("#highScore");

// TODO 4a: Create the snake, apple and score variables
// Game Variables

var snake = {}
var apple = {
  element: 0,
  row: 0,
  column: 0,
}
var score = 0


// Constant Variables
var ROWS = 20;
var COLUMNS = 20;
var SQUARE_SIZE = 20;
var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// interval variable required for stopping the update function when the game ends
var updateInterval;

// variable to keep track of the key (keycode) last pressed by the user
var activeKey;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// GAME SETUP //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// TODO: turn on keyboard inputs
$("body").on("keydown", handleKeyDown);

// start the game
init();

function init() {
  // TODO 4c-2: initialize the snake
  // initialize the snake's body as an empty Array
  snake.body = [];

  // make the first snakeSquare and set it as the head
  makeSnakeSquare(10, 10);
  snake.head = snake.body[0];
  // TODO 4b-2: initialize the apple
  makeApple()
  // TODO 5a: Initialize the interval
  // start update interval
  updateInterval = setInterval(update, 100);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////// PROGRAM FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/*
 * On each update tick update each bubble's position and check for
 * collisions with the walls.
 */
function update() {
  // TODO 5b: Fill in the update function's code block
  moveSnake();

  if (hasHitWall() || hasCollidedWithSnake()) {
    endGame();
  }

  if (hasCollidedWithApple()) {
    handleAppleCollision();
  }
}

function checkForNewDirection(event) {
  
  if (activeKey === KEY.LEFT && snake.head.direction !== "right") {
    snake.head.direction = "left";
  }

  // FILL IN THE REST
  else if (activeKey === KEY.RIGHT && snake.head.direction !== "left") {
    snake.head.direction = "right";
  } else if (activeKey === KEY.UP && snake.head.direction !== "down") {
    snake.head.direction = "up";
  } else if (activeKey === KEY.DOWN && snake.head.direction !== "up") {
    snake.head.direction = "down";
  }
}

function moveSnake() {
  /* 
  TODO 11: Move each part of the snake's body such that it's body follows the head.
  
  HINT: To complete this TODO we must figure out the next direction, row, and 
  column for each snakeSquare in the snake's body. The parts of the snake are 
  stored in the Array snake.body and each part knows knows its current 
  column/row properties. 
  
  */
  for (var a = snake.body.length - 1; a >= 1; a-- ) {
    var snakeSquare = snake.body[a];
    var nextSnakeSquare = snake.body[a-1];

    var nextRow = nextSnakeSquare.row;
    var nextColumn = nextSnakeSquare.column;
    var nextDirection = nextSnakeSquare.direction;

    snakeSquare.direction = nextDirection;
    snakeSquare.row = nextRow;
    snakeSquare.column = nextColumn;
    repositionSquare(snakeSquare);
}
  //Before moving the head, check for a new direction from the keyboard input
  checkForNewDirection();

  /* 
  TODO 7: determine the next row and column for the snake's head
  
  HINT: The snake's head will need to move forward 1 square based on the value
  of snake.head.direction which may be one of "left", "right", "up", or "down"
  */
  if (snake.head.direction === "left") {
    snake.head.column = snake.head.column - 1;
  }
  if (snake.head.direction === "right") {
    snake.head.column = snake.head.column + 1;
  }
  if (snake.head.direction === "up") {
    snake.head.row = snake.head.row - 1;
  }
  if (snake.head.direction === "down") {
    snake.head.row = snake.head.row + 1;
  }
  repositionSquare(snake.head);
  
}

function hasHitWall() {
  /* 
  TODO 8: Should return true if the snake's head has collided with the four walls of the
  board, false otherwise.
  
  HINT: What will the row and column of the snake's head be if this were the case?
  */
  if (snake.head.row === 21){
    return true
  } else if (snake.head.column === 21){
    return true
  } else if (snake.head.row === -1){
    return true
  } else if (snake.head.column === -1){
    return true
  } else {
    return false;
  }
}

function hasCollidedWithApple() {
  if (apple.row === snake.head.row && apple.column === snake.head.column){
    return true
  } else {
    return false;
  }
}

function handleAppleCollision() {
  // increase the score and update the score DOM element
  score++;
  scoreElement.text("Score: " + score);
  // Remove existing Apple and create a new one
  apple.element.remove();
  makeApple();
  var row = snake.tail.row;
  var column = snake.tail.column;

  if (snake.tail.direction === "left") {
    column++
  } else if (snake.tail.direction === "right") {
    column--
  } else if (snake.tail.direction === "up") {
    row++
  } else if (snake.tail.direction === "down") {
    row--
  }
  /* 
  TODO 10: determine the location of the next snakeSquare based on the .row,
  .column and .direction properties of the snake.tail snakeSquare
  
  HINT: snake.tail.direction will be either "left", "right", "up", or "down".
  If the tail is moving "left", place the next snakeSquare to its right. 
  If the tail is moving "down", place the next snakeSquare above it.
  etc...
  */
  

  // code to determine the row and column of the snakeSquare to add to the snake

  makeSnakeSquare(row, column);
}

function hasCollidedWithSnake() {
  /* 
  TODO 12: Should return true if the snake's head has collided with any part of the
  snake's body.
  
  HINT: Each part of the snake's body is stored in the snake.body Array. The
  head and each part of the snake's body also knows its own row and column.
  

  */

  for (var i = 1; i < snake.body.length; i++){
    if (snake.head.row === snake.body[i].row && snake.head.column === snake.body[i].column){
      return(true)
    }
  }
}

function endGame() {
  // stop update function from running
  clearInterval(updateInterval);

  // clear board of all elements
  board.empty();

  // update the highScoreElement to display the highScore
  highScoreElement.text("High Score: " + calculateHighScore());
  scoreElement.text("Score: 0");
  score = 0;

  // restart the game after 500 ms
  setTimeout(init, 500);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/* Create an HTML element for the apple using jQuery. Then find a random
 * position on the board that is not occupied and position the apple there.
 */
function makeApple() {
  // TODO 4b-1: Fill in the makeApple() code block
  /* Create an HTML element for the apple using jQuery. Then find a random
 * position on the board that is not occupied and position the apple there.
 */
  // make the apple jQuery Object and append it to the board
  apple.element = $("<div>").addClass("apple").appendTo(board);

  // get a random available row/column on the board
  var randomPosition = getRandomAvailablePosition();

  // initialize the row/column properties on the Apple Object
  apple.row = randomPosition.row;
  apple.column = randomPosition.column;

  // position the apple on the screen
  repositionSquare(apple);
}

/* Create an HTML element for a snakeSquare using jQuery. Then, given a row and
 * column on the board, position it on the screen. Finally, add the new
 * snakeSquare to the snake.body Array and set a new tail.
 */
function makeSnakeSquare(row, column) {
  // TODO 4c-1: Fill in this function's code block
  var snakeSquare = {};

  // make the snakeSquare.element Object and append it to the board
  snakeSquare.element = $("<div>").addClass("snake").appendTo(board);

  // initialize the row and column properties on the snakeSquare Object
  snakeSquare.row = row;
  snakeSquare.column = column;

  // set the position of the snake on the screen
  repositionSquare(snakeSquare);

  // if this is the head, add the snake-head id
  if (snake.body.length === 0) {
    snakeSquare.element.attr("id", "snake-head");
  }

  // add snakeSquare to the end of the body Array and set it as the new tail
  snake.body.push(snakeSquare);
  snake.tail = snakeSquare;
}

/* 
  event.which returns the keycode of the key that is pressed when the
  keydown event occurs
  
  The KEY Object creates a map for the Arrow Keys to their keycode:

    KEY.LEFT = 37
    KEY.UP = 38
    KEY.RIGHT = 39
    KEY.DOWN = 40
*/
function handleKeyDown(event) {
  // TODO 6a: make the handleKeyDown function register which key is pressed
  activeKey = event.which;
  console.log(activeKey);
}

/* Given a gameSquare (which may be a snakeSquare or the apple), position
 * the gameSquare on the screen.
 */
function repositionSquare(square) {
  var squareElement = square.element;
  var row = square.row;
  var column = square.column;

  var buffer = 20;

  // position the square on the screen according to the row and column
  squareElement.css("left", column * SQUARE_SIZE + buffer);
  squareElement.css("top", row * SQUARE_SIZE + buffer);
}

/* Returns a (row,column) Object that is not occupied by another game component
 */
function getRandomAvailablePosition() {
  var spaceIsAvailable = false;
  var randomPosition = {};
  while (!spaceIsAvailable) {
    randomPosition.column = Math.floor(Math.random() * COLUMNS);
    randomPosition.row = Math.floor(Math.random() * ROWS);
    for (var i = 0; i < snake.body.length; i++){
      if (randomPosition.row != snake.body[i].row && randomPosition.column != snake.body[i].column){
        spaceIsAvailable = true;
      }
    }
  }
  return randomPosition;
  }

function calculateHighScore() {
  // retrieve the high score from session storage if it exists, or set it to 0
  var highScore = sessionStorage.getItem("highScore") || 0;

  if (score > highScore) {
    sessionStorage.setItem("highScore", score);
    highScore = score;
    alert("New High Score!");
  }

  return highScore;
}
