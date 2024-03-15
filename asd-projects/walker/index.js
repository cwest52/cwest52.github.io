/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const key = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    a: 65,
    w: 87,
    d: 68,
    s: 83,
  }
  // Game Item Objects

  var walker = {
    x: 10, // the x-coordinate location for the box
    y: 10, // the y-coordinate location for the box
    xSpeed: 0, // the speed for the box along the x-axis
    ySpeed: 0, // the speed for the box along the y-axis
    it: -1
  }

  var playTwo = {
    x: 380,
    y: 380,
    xSpeed: 0,
    ySpeed: 0,
    it: 1
  }

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on("keydown", handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on("keyup", handleKeyUp);    

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
var tick = 0
  function newFrame() {
    tick += 1
    repositionGameItem()
    wallCollision()
    playerCollision()
    isIt()
    redrawGameItem()
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    if (event.which === key.left) {
      walker.xSpeed = -5
    }
    if (event.which === key.up) {
      walker.ySpeed = -5
    }
    if (event.which === key.right) {
      walker.xSpeed = 5
    }
    if (event.which === key.down) {
      walker.ySpeed = 5
    }
    if (event.which === key.a) {
      playTwo.xSpeed = -5
    }
    if (event.which === key.w) {
      playTwo.ySpeed = -5
    }
    if (event.which === key.d) {
      playTwo.xSpeed = 5
    }
    if (event.which === key.s) {
      playTwo.ySpeed = 5
    }
  }
  function handleKeyUp(event) {
    if (event.which === key.left) {
      walker.xSpeed = 0
    }
    if (event.which === key.up) {
      walker.ySpeed = 0
    }
    if (event.which === key.right) {
      walker.xSpeed = 0
    }
    if (event.which === key.down) {
      walker.ySpeed = 0
    }
    if (event.which === key.a) {
      playTwo.xSpeed = 0
    }
    if (event.which === key.w) {
      playTwo.ySpeed = 0
    }
    if (event.which === key.d) {
      playTwo.xSpeed = 0
    }
    if (event.which === key.s) {
      playTwo.ySpeed = 0
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
  function repositionGameItem(){
    walker.x += walker.xSpeed; // update the position of the walker along the x-axis
    walker.y += walker.ySpeed; // update the position of the walker along the y-axis
    playTwo.x += playTwo.xSpeed
    playTwo.y += playTwo.ySpeed
  }
  function redrawGameItem(){
    $("#walker").css("left", walker.x); // draw the walker in the new location, walker.x pixels away from the "left"
    $("#walker").css("top", walker.y); // draw the walker in the new location, walker.y pixels away from the "top"
    $("#playTwo").css("left", playTwo.x)
    $("#playTwo").css("top", playTwo.y)
  }
boardWandH = $("#board").width()
  function wallCollision(){
    if (walker.x === 0) {
      walker.x -= walker.xSpeed
    }
    if (walker.y === 0) {
      walker.y -= walker.ySpeed
    }
    if (walker.x === 390 ) { // the width of the board - the width of the walker
      walker.x -= walker.xSpeed
    }
    if (walker.y === 390) { // the height of the board - the height of the walker (It didn't work when I tried to soft-code it, and I tried about 5 different combinations)
      walker.y -= walker.ySpeed
    }
    if (playTwo.x === 0) {
      playTwo.x -= playTwo.xSpeed
    }
    if (playTwo.y === 0) {
      playTwo.y -= playTwo.ySpeed
    }
    if (playTwo.x === 390 ) { // the width of the board - the width of the walker
      playTwo.x -= playTwo.xSpeed
    }
    if (playTwo.y === 390) { // the height of the board - the height of the walker (It didn't work when I tried to soft-code it, and I tried about 5 different combinations)
      playTwo.y -= playTwo.ySpeed
    }
  }
  function playerCollision(){
    for (var i = -50; i < 50; i++){
      if (walker.x === playTwo.x - i){
        for (var j = -50; j < 50; j++){
          if (walker.y === playTwo.y - j) {
            walker.it *= -1
            playTwo.it *= -1
          }
        }
      }
    }
  }
  function isIt(){
    if (walker.it === 1) 
      $("#walker").css("background", "red")
      $("#playTwo").css("background", "cyan")
    } else if (playTwo.it === 1) {
      $("#walker").css("background", "cyan")
      $("#playTwo").css("background", "red")
    }
  }
}
