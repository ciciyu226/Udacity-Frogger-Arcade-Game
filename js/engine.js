/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    var date = new Date();
    var time = 0

    canvas.width = canW;
    canvas.height = canH;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
var start = true;
var frameID = 0;
var collideEnemy = false;
var collideGoal = false;
var collideHeart = false;
var collideGem = false;
var score = 0;
var lifeCount = 3;
var record = 0;
var delay = 0;
var collideBlueGem = false;
var collideGreenGem = false;
var collideRedGem = false;
var gameOver = false;
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */

        if(start){
            var now = Date.now(),
                dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
            update(dt);
            render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
            lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
            frameID = win.requestAnimationFrame(main);
        }
        else{
             win.cancelAnimationFrame(frameID); // stop frame for now
             //check if animation needs to be paused for better interaction.
             if(collideHeart | collideGem){
                delay = 0   // if player collides with items, then no need to
                            //pause.
             }
             else{
                delay = 200; // if player wins or lose, then need to pause.
             }
             setTimeout(reset, delay);
             win.requestAnimationFrame(main);
        }
    }


    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();

    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function checkCollisions() {
        //Check if player collides with enemies -lose
        allEnemies.forEach(function(enemy){
            if(player.y == enemy.y && player.x + blockW - 30 > enemy.x && player.x + 30 < enemy.x + blockW){
                collideEnemy = true;
                if(collideEnemy){
                    start = false;
                    //console.log(frameID);
                }
            }
        });
        if(player.y < blockH - TOP_OFFSET){
            console.log(player.y);
            collideGoal = true;
            start = false;
        }
        //TODO: extension: check if collides gems (and hearts and key).
        if(player.x == heart.x && player.y == heart.y){
            collideHeart = true;
            if(collideHeart){
                start = false;
                heart.x = -100; // make heart disappear when collides with player
                heart.y = -100;


            }
        }
        // check player collision with gems
        gems.forEach(function(gem){
            if(player.x + 10 > gem.x && player.x < gem.x +10 && player.y + 10 > gem.y && player.y < gem.y + 10){
                collideGem = true;
                if(collideGem){
                    start = false;
                    gem.x = -100;
                    gem.y = -100;
                    if(gemSprites.indexOf(gem.sprite) == 0){
                        collideBlueGem = true;
                    }
                    else if(gemSprites.indexOf(gem.sprite) == 1){
                        collideGreenGem = true;
                    }
                    else if(gemSprites.indexOf(gem.sprite) == 2){
                        collideRedGem = true;
                    }
                }
            }



        });


    }
    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = NUM_ROW,
            numCols = NUM_COL,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        //draw text on the image created
        ctx.font = "20px Comic Sans MS";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "start";
        ctx.fillText("Score: " + score, 10, 80);
        //draw time count down
        ctx.fillStyle = "yellow";
        ctx.fillText("Lives: " + lifeCount, 10, 570);
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */


    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        heart.render();
        gems.forEach(function(gem){
            gem.render();
        });

    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        //if player wins or loses, reset position of player

        //TODO: if player wins, increases level and score. (can have requirement of passing each level)
        if(collideGoal){
            //update score when player wins
            player.x = PlayerStartX;
            player.y = PlayerStartY;
            score += 1000;
            //TODO: increase level and difficulty when player wins
        }
        else if(collideHeart){
            lifeCount++;
            score += 10;

        }
        else if(collideGem){
            if(collideBlueGem){
                score += 100;
            }
            else if(collideGreenGem){
                score += 200;
            }
            else if(collideRedGem){
                score += 500;
            }
        }

        else if(collideEnemy){
            player.x = PlayerStartX;
            player.y = PlayerStartY;
            if(lifeCount > 0){
                lifeCount--;
            }
            else {

                gameOver = true;
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText('Game over noob! Press space to restart.', canW/2, 6*blockH + 20);
                document.addEventListener("keydown", function(event){// if player presses space, game will restart
                    if(event.keyCode == 32){
                        location.reload();
                    }
                });


            }
        }
        if(!gameOver){
            start = true;
        }
        collideGoal = false;
        collideEnemy = false;
        collideHeart = false;
        collideGem = false;
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Heart.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
