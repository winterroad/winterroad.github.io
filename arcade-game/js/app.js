/* Overlay and pop up window code has been copied and edited from my previous
project: Memory Game */
'use strict';

const POINTS = document.getElementsByClassName("points");
const LIVES = document.getElementById("hearts");
const POPUP = document.querySelector(".popUpWindow");
const OVERLAY = document.querySelector(".overlay");
const PLAYAGAINMODAL = document.getElementById("playAgain");
/* allEnemies array, that will be filled with the enemies objects */
let allEnemies = [];
let player;

Player.prototype.updateScores = function() {
    /* getElementsByClassName returns a nodeList object, access both point-showing elements by index */
    POINTS[0].textContent = this.points;
    POINTS[1].textContent = this.points;
};

/* check how many lives player has left and update the page */
Player.prototype.updateLives = function() {
    let hearts = " ";
    if (this.lives == 0) {
        LIVES.textContent = "  ";
        /* remove all enemies by emptying the array */
        allEnemies = [];
        /* open pop up */
        showPopUp();
    } else {
        for (let i = 0; i < this.lives; i++) {
            hearts += "❤"
        }
        LIVES.textContent = " " + hearts;
    }
};

/*TODO: Maybe a game class, character class which subclasses are enemy and player */

/* TODO: Player can choose the avatar him/herself*/
initialize("images/char-cat-girl.png");

function initialize(avatar) {
    /*populate allEnemies*/
    allEnemies = createEnemies(5);
    /*create a player object*/
    player = new Player(avatar);
    player.updateScores();
    player.updateLives();
}

/* enemy constructor*/
function Enemy(speed, x, y) {
    /* every enemy has speed, x- and y- coordinate* and "image"/sprite */
    this.speed = speed;
    this.x = x;
    this.y = y;
    /* Image for all enemies */
    this.sprite = 'images/enemy-bug.png';
    this.width = 90;
    this.height = 70;
}

/* function that calls the enemy constructor with how many enemies should created (num) */
function createEnemies(num) {
    let speed, x, y;
    /* for loop runs as many times there should be enemies (num)*/
    for (let i = 0; i < num; i++) {
        /* create randoms: returns speed, x and y and they are set in one go as return
        statement returns an array */
        [speed, x, y] = createRandoms();
        /* lets use the random values to create an enemy */
        let enemy = new Enemy(speed, x, y);
        /* Add new enemy to the allEnemies array */
        allEnemies.push(enemy);
    }
    return allEnemies;
}

/*randomize new values for new enemy and when the enemy is over the "border" */
function createRandoms() {
    /* x will be negative, so the enemy does not show up immediately */
    let randomX = -50 - Math.floor(Math.random() * 300);
    /* we do not want enemies on the grass or on the "river": y = 50 - 225 */
    let randomY = 50 + Math.floor(Math.random() * 175);
    /* speed should be over 50, but not over 400*/
    let randomSpeed = 50 + Math.floor(Math.random() * 350);
    /* when returned in array, values can be set directly to multiple variables, when they are in array */
    return [randomSpeed, randomX, randomY];
}

/*Update the enemy's position, Parameter: dt, a time delta between ticks*/
Enemy.prototype.update = function(dt) {
    /* if the x is not over border, then add dt adjusted length that enemy has traveled in its speed */
    if (this.x < 500) {
        this.x += (this.speed * dt);
    }
    /* check for going off canvas, "reset" enemy with new x and y. */
    if (this.x >= 500) {
        [this.speed, this.x, this.y] = createRandoms();
    }
    checkCollision(this, player);
};

function checkCollision(enemy, player) {
    /* check collision */
    /* Source: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection */
    /* Axis-Aligned Bounding Box */

    /* Broad phase, check if they are even approx. on the same row */
    if (Math.abs(enemy.y - player.y) < 100) {
        /* Narrow phase */
        /* check if rectangle around the char would collide other char's "retangle" */
        if ((enemy.x < player.x + player.width) &&
            (enemy.x + enemy.width > player.x) &&
            (enemy.y < player.y + player.height) &&
            (enemy.y + enemy.height > player.y)) {
            player.crash();
        }
    }
}

/* Draw the enemy on the screen */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Player constructor */
function Player(avatar) {
    this.x = 200;
    this.y = 400;
    this.sprite = avatar;
    /* For the "scoreBoard" */
    this.lives = 3;
    this.points = 0;
    this.width = 50;
    this.height = 90;
}

/* Handles when player and enemy has "crashed", 1 life is taken,
player starts from start position if there is lives left */
Player.prototype.crash = function() {
    this.lives -= 1;
    this.updateLives();
    if (this.lives > 0) {
        this.startPos();
    }
};
/* player's start position */
Player.prototype.startPos = function() {
    this.x = 200;
    this.y = 400;
};

Player.prototype.update = function() {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Function get a key as a parameter and moves player accordingly. */
Player.prototype.handleInput = function(key) {
    /* Check if the game still continues */
    if (this.lives > 0) {
        /* Compare the key input and move player accordingly */
        switch (key) {

            case "left":
                /* check borders before moving */
                if (this.x > 50) {
                    /* player goes 100px left */
                    this.x -= 100;
                }
                break;

            case "right":
                /* check border before moving */
                if (this.x <= 350) {
                    /* player goes 100px right */
                    this.x += 100;
                /* dont cross the border */
                } else {
                    this.x = 400;
                }
                break;

            case "up":
                /* check border before moving */
                if (this.y >= 60) {
                    /* player goes 50px up */
                    this.y -= 50;
                /* player has reached the river */
                } else {
                    /* player back to the start position*/
                    this.x = 200;
                    this.y = 400;
                    this.points += 200;
                    this.updateScores();
                }
                break;

            case "down":
                /* check border before moving */
                /* player goes 50px down */
                if (this.y <= 390) {
                    this.y += 50;
                /* dont cross the border */
                } else {
                    this.y = 440;
                }
                break;

            /* If something strange happens. */
            default:
                console.log("Something strange happened.");
        }
    }
};

/* This listens for key presses and sends the keys to your Player.handleInput() method. */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function showPopUp() {
    /* When function called show modal/pop up and overlay by adding class that has visibility: visible. */
    if (POPUP.classList) {
        POPUP.classList.add("showPopUp");
        OVERLAY.classList.add("showPopUp");
        /* Event listeners for playAgain button. */
        PLAYAGAINMODAL.addEventListener('click', doPlayAgain);
    }
}
/* This removes the class that gives visibility to pop up/modal and overlay */
function doPlayAgain() {
    POPUP.classList.remove("showPopUp");
    OVERLAY.classList.remove("showPopUp");
    /* initialize game: new player, new enemies and score values */
    initialize("images/char-cat-girl.png");
}
