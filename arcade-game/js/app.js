/* Overlay and pop up window code has been copied and edited from my previous
project: Memory Game */

'use strict';

const POINTS = document.getElementsByClassName("points");
const LIVES = document.getElementById("hearts");
const POPUP = document.querySelector(".popUpWindow");
const OVERLAY = document.querySelector(".overlay");
const PLAYAGAINMODAL = document.getElementById("playAgain");
/* allEnemies array, that will be filled with the enemies objects*/
let allEnemies = [];
let player;

Player.prototype.updateScores = function(){
  /* getElementsByClassName returns a nodeList object, access both point-showing elements by index*/
  POINTS[0].textContent = this.points;
  POINTS[1].textContent = this.points;
};

Player.prototype.updateLives = function(){
  /* check how many lives player has left and update the  page */
  switch(player.lives){
    case 3:
    LIVES.textContent ="  ❤ ❤ ❤  ";
    break;
    case 2:
    LIVES.textContent ="  ❤ ❤  ";
    break;
    case 1:
    LIVES.textContent ="  ❤  ";
    break;
    /* Game over */
    default:
    LIVES.textContent ="  ";
    /*remove all enemies by emptying the array*/
    allEnemies = [];
    /* open pop up */
    showPopUp();
    break;
  }
};

/*TODO: Maybe a game class*/

/* TODO: Player can choose the avatar him/herself*/
initialize("images/char-cat-girl.png");

function initialize(avatar){
  /*populate allEnemies*/
  allEnemies = createEnemies(5);
  /*create a player object*/
  player = new Player(avatar);
  player.updateScores();
  player.updateLives();
}

/* enemy constructor*/
function Enemy(speed, x, y){
  /* every enemy has speed, x- and y- coordinate* and "image"/sprite */
  this.speed = speed;
  this.x = x;
  this.y = y;
  /* Image for all enemies */
  this.sprite = 'images/enemy-bug.png';
}

/* function that calls the enemy constructor with how many enemies should created (num) */
function createEnemies(num){
  let speed, x, y;
  /* for loop runs as many times there should be enemies (num)*/
  for(let i = 0; i < num; i++){
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
function createRandoms(){
  /* x will be negative, so the enemy does not show up immediately */
  let randomX = -50 - Math.floor(Math.random()*300);
  /* we do not want enemies on the grass or on the "river": y = 50 - 225 */
  let randomY = 50 + Math.floor(Math.random() * 175);
  /* speed should be over 50, but not over 400*/
  let randomSpeed = 50 + Math.floor(Math.random()*350);
  /*when returned in array, values can be set directly to multiple variables, when they are in array*/
  return [randomSpeed, randomX, randomY];
}

/*Update the enemy's position
Parameter: dt, a time delta between ticks*/
Enemy.prototype.update = function(dt){
    /*if the x is not over border, then add dt adjusted length that enemy has traveled in its speed*/
    if(this.x < 500){
      this.x += (this.speed * dt);
    }
    //check for going off canvas, "reset" enemy with new x and y.
    if(this.x >= 500){
      [this.speed, this.x, this.y] = createRandoms();
    }
    /* check collision */
    /* Is the player approximately at the same loc at y-axis: */
      if(Math.abs(this.y - player.y) < 30){
        /* Is the player aprox. at the same loc at the x-axis */
        if(Math.abs(this.x - player. x) < 50){
          /* player is in enemy's "hitzone" -> crash */
          player.crash();
        }
      }
};

/* Draw the enemy on the screen */
Enemy.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Player constructor */
function Player(avatar){
    this.x = 200;
    this.y = 400;
    this.sprite = avatar;
    /* For the "scoreBoard" */
    this.lives = 3;
    this.points = 0;
}

/* Handles when player and enemy has "crashed", 1 life is taken,
player starts from start position if there is lives left */
Player.prototype.crash = function(){
  player.lives -= 1;
  player.updateLives();
  if(player.lives > 0){
    player.startPos();
  }
};
/* player's start position */
Player.prototype.startPos = function(){
  this.x = 200;
  this.y = 400;
};

Player.prototype.update = function(){
    /*Following are "border" checks*/
    if (this.x > 415){
      this.x = 415;
    }
      else if(this.x < -15){
        this.x = -15;
      }
        else if(this.y > 440) {
          this.y = 440;
        }
          else if(this.y < 0) {
            this.y = 0;
          }
    /*If the player reaches the river.*/
    if(this.y <= 0){
      /*Player back to the start position*/
      this.x = 200;
      this.y = 400;
      this.points += 200;
      this.updateScores();
    }
};

Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Function get a key as a parametr and moves player accordingly. */
Player.prototype.handleInput  = function(key){
  /* Check if the game still continues */
  if(player.lives > 0){
    /* Compare the key input and move player accordingly */
    switch(key){

    case "left":
        /* player goes 100px left */
        this.x -= 100;
        break;

    case "right":
        /* player goes 100px right */
        this.x += 100;
        break;

    case "up":
        /* player goes 50px up */
        this.y -= 50;
        break;

    case "down":
        /* player goes 50px down */
        this.y +=50;
        break;
    /* If something strange happens. */
    default:
        console.log("Something strange happened.");
    }
  }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function showPopUp(){
  //When function called show modal/pop up and overlay by adding class that has visibility: visible.
  if(POPUP.classList){
    POPUP.classList.add("showPopUp");
    OVERLAY.classList.add("showPopUp");
  //Event listeners for playAgain button.
  PLAYAGAINMODAL.addEventListener('click', doPlayAgain);
  }
}
//This removes the class that gives visibility to pop up/modal and overlay
function doPlayAgain(){
  POPUP.classList.remove("showPopUp");
  OVERLAY.classList.remove("showPopUp");
  /* initialize game: new player, new enemies and score values */
  initialize("images/char-cat-girl.png");
}
