//Game- variable does not change. Cards will be added to GAME.
const GAME = document.getElementById("game-container");
//Counters will be the same during the game, so consts.
const MOVECOUNTER = document.getElementById("moveCounter");
const PAIRSCOUNTER = document.getElementById("pairsCounter");
const RESET = document.getElementById("resetButton");
const TIME = document.getElementById("time");

//For modal, TODO: will be deleted when not needed anymore
//TODO: Modal maybe removed in future. This is why modal and "tools" have ids and are seperate.
const POPUP = document.querySelector(".popUpWindow");
const OVERLAY = document.querySelector(".overlay");
const PAIRSMODAL = document.getElementById("pairContainer");
const MOVESMODAL = document.getElementById("moveContainer");
const STARSMODAL = document.getElementById("starContainer");
const TIMEMODAL = document.getElementById("timeContainer");
const PLAYAGAINMODAL = document.getElementById("playAgain");
const CLOSEMODAL = document.querySelector(".close");
//END FOR MODAL

//All pictures in an array. Includes all the needed html for the "card", including the card div that is the thing that "masks" the picture.
//TODO: Put this info in a db, mongo db. Pictures fetched with randomized id, which is 1 to [max card id].

const ALL_PICTURES = [
  "<div class='card unselected'></div><img src='img/01-150.png' alt='Long haired kitten. Front profile.'>",
  "<div class='card unselected'></div><img src='img/02-150.png' alt='A cat and a bag.'>",
  "<div class='card unselected'></div><img src='img/03-150.png' alt='A kitten sleeps below shelf.'>",
  "<div class='card unselected'></div><img src='img/04-150.png' alt='A big happy cat sleeps on a carpet.'>",
  "<div class='card unselected'></div><img src='img/05-150.png' alt='Two cats eating beside each other.'>",
  "<div class='card unselected'></div><img src='img/06-150.png' alt='A young, mostly white cat sleeps on the sofa.'>",
  "<div class='card unselected'></div><img src='img/07-150.png' alt='A long cat sleeps half inside in a bicycle basket.'>",
  "<div class='card unselected'></div><img src='img/08-150.png' alt='A mostly white kitten lays on a sofa and licks his lips.'>",
  "<div class='card unselected'></div><img src='img/09-150.png' alt='A fat cat sleeps in a roll.'>",
  "<div class='card unselected'></div><img src='img/10-150.png' alt='A long haired young cat meows.'>",
  "<div class='card unselected'></div><img src='img/11-150.png' alt='A cat scratches a mat.'>",
  "<div class='card unselected'></div><img src='img/12-150.png' alt='A big cat sleeps on corner and looks happy.'>",
  "<div class='card unselected'></div><img src='img/13-150.png' alt='A longhaired cat poses like sphynx, side profile.'>",
  "<div class='card unselected'></div><img src='img/14-150.png' alt='A cat lays on a living room table, partly hanging over.'>",
  "<div class='card unselected'></div><img src='img/15-150.png' alt='A big cat and a kitten sleep on sofa.'>",
  "<div class='card unselected'></div><img src='img/16-150.png' alt='A cat sleeps in front of a computer display.'>"
];

//How many different cards . CardsInGame x 2 = all cards in the game.
//TODO: Game asks how many pairs/cards.
let cardsInGame = 8;
//These global as needed in several functions
let pairsFound;
let stars;
let startTime;
let moves;
let move1;
let move2;
let pic1;
let pic2;
let count;
let timerValue;
let countingUp

//Let's play
playGame();

function playGame(){
  //initialize the game.
  initialize();
  //Add evenlistener to parent. With event delegation, no need to assign every child their own listener.
  GAME.addEventListener('click', chooseCard);
  //If the player wants to start the game from start.
  RESET.addEventListener('click', resetGame);
}

//Initialize: select images, greate game, reset/update start values.
function initialize(){
  //Array for chosen pictures
  let chosenPictures = [];
  //Lets select the pictures (1 each). After this these are added to game in randomized order (2 each). -> function createGame().
  chosenPictures = generateRandomPictures(cardsInGame);
  //Create a game based  on these pictures.
  createGame(chosenPictures);
  //Reset move1, move2, pic1 and pic2 values.
  resetMovePic();
  //Updates the start values.
  updateStartValues();
}

//Generate chosenPicture-array (includes picture once).
function generateRandomPictures(num){
  //Empty array for randomized pic-info
  let randomPics = [];
  let picture = "";
  //Lets copy info from the original pic array, so the original array is not modified.
  let arrayForRandomizing = ALL_PICTURES.slice(0);
  let randomArraySize;

  //Repeat num times (cardsInGame)
  for(let i=0; i < num; i++){
    //As arrayForRandomizing-array's size changes, the size is checked before creating random index.
    randomArraySize = arrayForRandomizing.length;
    //Lets randomize index (for getting a pic-info from array, random is multiplied by no between 0 - randomArraySize,
    //floor will round the no down, random will create no between 0 and up to but not inclunding 1)
    let picIndex = Math.floor(Math.random()*randomArraySize);
    //Let's use the index to get pic-info from array, then the item in that index will be removed, so it it will not be used again in the game.
    picture = arrayForRandomizing.splice(picIndex, 1);
    //Push picture-info into randomPics
    randomPics.push(picture);
  }
  //Return the array
  return randomPics;
}

//Function for creating a game.
function createGame(chosenPictures){
  //Lets add array that has pictures once to itself, a new array has been formed. Old arrays not affected.
  let allCards = chosenPictures.concat(chosenPictures);
  //We need all cards array's size for for-loop.
  let allCardsNum = allCards.length;

  //To prevent reflow and repaint, lets create a document fragment. https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
  const fragment = document.createDocumentFragment();

  //For loop that goes as many "rounds" as there is elements in the array.
  for(let i=0; i < allCardsNum; i++){
    //As the size of the array will change we have to check the size of the array, so we do not pick a index that is out of bounds.
    let allCardsSize = allCards.length;
    //SHUFFLE :)
    //TODO: all use randomize function that can be used for all randomizing needs.
    //Lets randomize an index.
    index = Math.floor(Math.random()*allCardsSize);
    //Lets remove the element with the index, save it variable element.
    let element = allCards.splice(index, 1);
    //Create a div that will be the card.
    let elementToBeAdded = document.createElement("div");
    //Add a card-container - class, with this should work even with IE 8.
    if (elementToBeAdded.classList){
      elementToBeAdded.classList.add("card-container");
    //This is for older IE.
    }else{
      elementToBeAdded.className += ' ' + "card-container";
    }
    //Add img info inside div.
    elementToBeAdded.innerHTML = element[0][0];
    //Add card div with img info to document fragment.
    fragment.appendChild(elementToBeAdded);
  }
  //Add the document fragment that has all the divs with pic-info to the game-div.
  GAME.appendChild(fragment);
}

//Reset move and pic values.
function resetMovePic(){
  move1 = "";
  move2 = "";
  pic1 = "";
  pic2 = "";
}

function updateStartValues(){
  //Reset values
  stars = 3;
  moves = 0;
  pairsFound = 0;
  /*startTime = Date.now();
  endTime = 0;*/
  count = 0;
  paintTheStars(stars);
  //Update the values to the page
  MOVECOUNTER.textContent = " " + moves;
  PAIRSCOUNTER.textContent = " " + pairsFound;
  TIME.textContent = convertCounts(count);
  countingUp = setInterval(function(){ timer() }, 1000);
}

function paintTheStars(howMany){
  //Use switch to "draw correct no of stars."
  switch(howMany){
    case 3:
    starsCounter.textContent =  " ✰ ✰ ✰ ";
    break;
    case 2:
    starsCounter.textContent =  " ✰ ✰ ";
    break;
    case 1:
    starsCounter.textContent =  " ✰ ";
    break;
    case 0:
    starsCounter.textContent =  0;
    break;
  }
}

function timer(){
  count++;
  timerValue = convertCounts(count);
  TIME.textContent = timerValue;
}

function convertCounts(c){
  //Whole minutes are counts divided by 60 rounded by Math-floor to whole minutes.
  let mins = Math.floor(c/60);
  //Whole seconds are modulo (remainder) rounded by Math.floor. The secs are reminder, when whole mins have been counted.
  let secs = Math.floor(c%60);
  //If the seconds is under 10, then 0 before the secs, if secs is over 10, then add "nothing".
  return (mins + " : " + (secs < 10 ? " 0" : "") + secs);
  //Above ternary returns the "same" as if/else below
  //if(secs < 10){
  //   return mins + ":" + "0" + secs;
  //} else{
  //   mins + ":" + secs;
    //}
}

//In choose a card-function card is revealed with class selected, if it is not .selected already.
function chooseCard(e){
  if(/*e.target && e.target.nodeName == "DIV" &&*/ e.target.className == "card unselected"){
    e.target.classList.add("selected");
    e.target.classList.remove("unselected");

    if(move1==""){
      move1 = e.target;
      pic1 = move1.nextSibling.alt;
    }else if(move2==""){
          move2 = e.target;
          pic2 = move2.nextSibling.alt;
     }
  }
  //If move1 and move2 have a value (2 cards selected). Then we have to check and uodated classes.
  if (move1!="" && move2!=""){
      //Setting timeout, so player has time to see the other card.
      setTimeout(updatingClasses, 300);
  }
}

function updatingClasses(){
  //TODO: Make update moves function.
  moves++;
  MOVECOUNTER.textContent = " " + moves + " ";
  checkScore();
  move1.classList.remove("selected");
  move2.classList.remove("selected");
  //Check if the moves are the same picture.
  if(pic1 == pic2){
      //Update the counter, add text to img elemnt and update class.
      pairsFound++;
      move1.classList.add("paired");
      move1.textContent = "paired";
      move2.classList.add("paired");
      move2.textContent = "paired";
      PAIRSCOUNTER.textContent = " " + pairsFound + " ";
      //Let's check if all pairs have been found, timeout so that the modal does appear too quickly.
      if(pairsFound >= cardsInGame) {
         setTimeout(allPairsFound, 500);
      }
  //If the pictures were not a pair, cards go back unselected.
  }else{
      move1.classList.add("unselected");
      move2.classList.add("unselected");
  }
  //Reset calues that new ones can optained (choose a card).
  resetMovePic();
}

//Logic for the score (stars).
function checkScore(){
  //TODO: Use the paint the stars function.
  if(moves >= (cardsInGame * 2) && moves < (cardsInGame * 2.75)){
    starsCounter.textContent = " ✰ ✰ ";
    stars = 2;
  }else if(moves >= (cardsInGame * 2.75) && moves < (cardsInGame * 4)){
    starsCounter.textContent = " ✰ ";
    stars = 1;
  }
}

//When all pairs are found,
function allPairsFound(){
  clearInterval(countingUp);
  updateModalValues(pairsFound, moves, stars, timerValue);
  showPopUp();
}

function resetGame(){
  //Reset board, did not use remove (node.remove()) as IE does not understand it. So going old school. Remove child elements as long as there is one.
  while (GAME.firstChild){
    GAME.removeChild(GAME.firstChild);
  }
  //create a new game
  initialize();
}

//FOR MODAL, WILL BE DELETED WHEN NOT NEEDED ANYMORE
function showPopUp(){
  //When cuntion called show moda/pop up and overlay by adding class that has visibility: visible;
  if(POPUP.classList){
    POPUP.classList.add("showPopUp");
    OVERLAY.classList.add("showPopUp");
  //This is for older IE.
  }else{
      POPUP.className += ' ' + "showPopUp";
      OVERLAY.className += ' ' + "showPopUp";
  }
  //Event listeners for playAgain button and x for close.
  PLAYAGAINMODAL.addEventListener('click', doPlayAgain);
  CLOSEMODAL.addEventListener('click', closePopUp);
}

//Function for updating the values for modal/pop up
function updateModalValues(pairs, moves, stars, time){
  PAIRSMODAL.textContent = pairs;
  MOVESMODAL.textContent = moves;
  STARSMODAL.textContent = stars;
  TIMEMODAL.textContent = time;
}

//This removes the class that gives visibility to pop up/modal and overlay
function closePopUp(){
  POPUP.classList.remove("showPopUp");
  OVERLAY.classList.remove("showPopUp");
}

//If player chooses to play again, game is resetted and pop up/modal is closed.
function doPlayAgain(){
  resetGame();
  closePopUp();
}
//END MODAL
