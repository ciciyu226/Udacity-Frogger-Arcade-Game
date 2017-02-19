/* Definition of global variables */
var canW = 505;
var canH = 606;
var blockW = 101, blockH = 83; //all elements used in this game have this dimension, so here generally call them block;
var startX = -blockW;



// var charSpeedX = blockW;
// var charSpeedY = blockH;

// Enemies our player must avoid


var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //if ememy moves outside of the canvas, move it back to the leftmost
    // start position and update its speed to another random speed.
    if(this.x > canW){
        this.x = startX;
        this.speed = Math.random()*speedMultiplier;
    }
    //if enemy is still inside canvas, update its position to move it
    //a step right.
    else{
        this.x += this.speed * dt;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y){
    this.x = x;
    this.y = y;
};
//This method handles player's movement, collision, and other actions.
Player.prototype.update = function(){
   // this.handleInput();


};

Player.prototype.render = function(){

};

Player.prototype.handleInput = function(keyChar){


};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player   (Math.floor(Math.random()*numEnemyTrails) + 1)* blockH
var allEnemies =[];
//
var numEnemyTrails = 3;  //there are 3 enemy trails at level 1.
var numEnemyPerRow = 1;  //each enemytrial will have 2 enemies at level 1.
var speedMultiplier = 100; // speed multiplier of enemy at level 1.
for(var i = 0 ; i < numEnemyTrails; i++ ){
    for(var j = 0; j < numEnemyPerRow; j++){
        var enemy = new Enemy(startX, (i+1) * blockH - 0.25 * blockH , Math.random()*speedMultiplier + 50);
        allEnemies.push(enemy);
    }
}
var player = new Player(100,100); // TODO: define x, y

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    condole.log(e.keyCode);
    player.handleInput(allowedKeys[e.keyCode]);
});
