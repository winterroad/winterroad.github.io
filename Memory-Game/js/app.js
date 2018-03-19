//Game- variable does not change. Cards will be added to game.
const GAME = document.getElementById("game-container");
const moveCounter = document.getElementById("moveCounter");
const pairsCounter = document.getElementById("pairsCounter");
const reset = document.getElementById("resetButton");
const time = document.getElementById("time");

//For modal, TODO: will be deleted when not needed anymore
const popUp = document.querySelector(".popUpWindow");
const overlay = document.querySelector(".overlay");
const pairsModal = document.getElementById("pairContainer");
const movesModal = document.getElementById("moveContainer");
const starsModal = document.getElementById("starContainer");
const timeModal = document.getElementById("timeContainer");
const playAgainModal = document.getElementById("playAgain");
const closeModal = document.querySelector(".close");
//END FOR MODAL

//All pictures in an array. Includes all the needed html for the "card", including the card div that is the thing that "masks" the picture.
//TODO: Put this info in a db, mongo db. Pictures fetched with randomized id, which is 1 to [max card id].
//TODO: Smaller pictures, 100 X 100 as a option.
const ALL_PICTURES = [
  "<div class='card unselected'></div><img src='img/01-150.png' alt='Long haired kitten. Front profile.'>",
  "<div class='card unselected'></div><img src='img/02-150.png' alt='A cat and a bag.'>",
  "<div class='card unselected'></div><img src='img/03-150.png' alt='A kittensleeps below shelf.'>",
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

let cardsInGame = 8; //How many different cards . CardsInGame x 2 = all cards in the game.
let pairsFound;
let stars;
let startTime;
let moves;
let move1;
let move2;
let pic1;
let pic2;

playGame();

function init(){

  let chosenPictures = [];
  //Lets select the pictures (1 each). After this these are added to game in randomized order (2 each). -> function createGame().
  chosenPictures = generateRandomPictures(cardsInGame);

  //Create a game based  on these pictures.
  createGame(chosenPictures);
  resetMovePic();
  updateStartValues();
}

function updateStartValues(){
  //Reset values
  startTime = Date.now();
  pairsFound = 0;
  pairsCounter.textContent = " " + pairsFound;
  stars = 3;
  starsCounter.textContent =  " ✰ ✰ ✰ ";
  endTime = 0;
  moves = 0;
  moveCounter.textContent = " " + moves;
  time.textContent = " ";
  winning = false;
}

function resetMovePic(){
  move1 = "";
  move2 = "";
  pic1 = "";
  pic2 = "";
}

//Generate chosenPicture-array (includes picture once).
function generateRandomPictures(num){
  //Empty array for randomized pic-info
  let picArr = [];
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
    //Push picture-info into picArr
    picArr.push(picture);
  }
  //Return the array
  return picArr;
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
    //DOTO: all use randomize function that use for all randomizing needs.
    //Lets randomize an index.
    index = Math.floor(Math.random()*allCardsSize);
    //Lets remove the element with previous index, save it variable element.
    let element = allCards.splice(index, 1);
    //Create a div that will be the card.
    let elementToBeAdded = document.createElement("div");
    //Add a card - class, with this should work even with IE 8.
    if (elementToBeAdded.classList){
      elementToBeAdded.classList.add("card-container");
    //This is for older IE.
    } else {
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

function playGame(){
  //Initialize the game.
  init();
  //Add evenlistener to parent. With event delegation, no need to assign every child their own listener.
  GAME.addEventListener('click', chooseCard);
  //If the player wants to start the game from start.
  reset.addEventListener('click', resetGame);
}

function resetGame(){
  //Reset board, did not use remove (node.remove()) as IE does not understand it. So going old school.
  while (GAME.firstChild) {
    GAME.removeChild(GAME.firstChild);
  }
  //create a new game
  init();
}

//In choose a card-function card is revealed with class selected, if it is not .selected already.
function chooseCard(e) {

  if(e.target && e.target.nodeName == "DIV" && e.target.className == "card unselected"){
    e.target.classList.add("selected");
    e.target.classList.remove("unselected");

    if(move1===""){
      move1 = e.target;
      pic1 = move1.nextSibling.alt;
    } else if (move2==="") {
        move2 = e.target;
        pic2 = move2.nextSibling.alt;
      }

    //Setting timeout so player has time to see the other card.
    setTimeout(updatingClasses, 500);
} }

function checkScore(){
  //Change to inline
  if(moves >= (cardsInGame * 1.75) && moves < (cardsInGame * 2.5)){
    starsCounter.textContent = " ✰ ✰ ";
    stars = 2;
  } else if(moves >= (cardsInGame * 2.5) && moves < (cardsInGame * 3.75)) {
    starsCounter.textContent = " ✰ ";
    stars = 1;
  } else if(moves >= (cardsInGame * 3.75)) {
    starsCounter.textContent = " " + 0 + " ";
    stars = 0;
  }
}

function updatingClasses() {

  if (move1!="" && move2!=""){
    //TODO: Make update moves function.
    moves++;
    moveCounter.textContent = " " + moves + " ";
    checkScore();
    move1.classList.remove("selected");
    move2.classList.remove("selected");
  //Check if the moves are the same picture.
  if(pic1 == pic2){
      pairsFound++;
      move1.classList.add("paired");
      move2.classList.add("paired");
      pairsCounter.textContent = " " + pairsFound + " ";

      if(pairsFound >= cardsInGame) {
         let endTime = Date.now()-startTime;
         endTime = convertMillis(endTime);
         time.textContent = "You finished in " + endTime;
         updateModalValues(pairsFound, moves, stars, endTime);
         showPopUp();
      }
  } else {
      move1.classList.add("unselected");
      move2.classList.add("unselected");
    }
  resetMovePic();
  }
}

  function convertMillis(ms){
    //Whole minutes are milliseconds divided by 60000 rounded by Math-floor to whole minutes.
    let mins = Math.floor(ms/60000);
    //Whole seconds are modulo (remainder) rounded by Math.floor down by nearest whole minute. The secs are reminder, when whole mins have been counted.
    let secs = Math.floor(ms%60000/1000);

    //If the seconds is under 10, then 0 before the secs, if secs is over 10, then add "nothing".
    return (mins + ":" + (secs < 10 ? "0" : "") + secs);

    //Above ternary returns the "same" as if/else below
    //if(secs < 10){
    //   return mins + ":" + "0" + secs;
    //} else{
    //   mins + ":" + secs;
      //}
  }

//FOR MODAL, WILL BE DELETED WHEN NOT NEEDED ANYMORE
function showPopUp(){
  if (popUp.classList){
    popUp.classList.add("showPopUp");
    overlay.classList.add("showPopUp");
  //This is for older IE.
  } else {
      popUp.className += ' ' + "showPopUp";
      overlay.className += ' ' + "showPopUp";
    }

  playAgainModal.addEventListener('click', doPlayAgain);
  closeModal.addEventListener('click', closePopUp);
}

function updateModalValues(pairs, moves, stars, time){
  pairsModal.textContent = pairs;
  movesModal.textContent = moves;
  starsModal.textContent = stars;
  timeModal.textContent = time;
  //playAgainModal

}

function closePopUp(){
  popUp.classList.remove("showPopUp");
  overlay.classList.remove("showPopUp");
}

function doPlayAgain(){
  resetGame();
  closePopUp();
}
//END MODAL
