let numSquares = 6;
let colors = [];
let squares = document.querySelectorAll(".square");
let pickedColor;
let colorDisplay = document.getElementById("colorDisplay");
let messageDisplay = document.getElementById("message");
let h1 = document.querySelector("h1");
let resetButton = document.getElementById("reset");
let modeButtons = document.querySelectorAll(".mode");

init();

function init(){
  setUpModeButtons();
  setUpSquares();
}

function setUpModeButtons(){

  for(let i = 0; i < modeButtons.length; i++){
    modeButtons[i].addEventListener("click", function() {
      modeButtons[0].classList.remove("selected");
      modeButtons[1].classList.remove("selected");
      this.classList.add("selected");
      this.textContent === "Hard" ? numSquares = 6 : numSquares = 3;
      reset();
    });
  }
}

function setUpSquares(){
  for(let i=0; i < squares.length; i++){
    //Add eventlisteners to squares
    squares[i].addEventListener("click", function() {
      //Grab color of clicked square
      let clickedColor = this.style.backgroundColor;
      //compare color to pickedColor
      if(clickedColor === pickedColor){
      messageDisplay.textContent = "Correct";
      resetButton.textContent = "Play Again?";
      changeColors(clickedColor);
      h1.style.backgroundColor = clickedColor;
      } else {
      this.style.backgroundColor = "#232323";
      messageDisplay.textContent = "Try Again";
      }
    });
  }
  reset();
}

function reset(){
  //Generate all new colors.
  colors = generateRandomColors(numSquares);
  //Pick a new random color.
  pickedColor = pickColor();
  //change colorDisplay to match picked color.
  colorDisplay.textContent = pickedColor;
  //change colors of squares.
  for(let i=0; i < squares.length; i++){
    //Add initial colors to squares
    if(colors[i]){
      squares[i].style.display = "block";
      squares[i].style.backgroundColor = colors[i];
    } else {
      squares[i].style.display = "none";
      }
    }
  h1.style.backgroundColor = "#4682b4";
  resetButton.textContent = "New Colors";
  messageDisplay.textContent = "";
}

resetButton.addEventListener("click", function(){
  reset();
});

function changeColors(color){

  //Loop through all squares
  for(let i=0; i < squares.length; i++){
  //Change each color to match given color
    squares[i].style.backgroundColor = color;
  }
}

function pickColor(){
  let random = Math.floor(Math.random()*colors.length);
  return colors[random];
}

function generateRandomColors(num){
  //Make an array
  let arr = [];
  //repeat num times
  for(let i=0; i < num; i++){
    //Get random color and push into arr
      arr.push(randomColor());
  }
  //Return that array
  return arr;
}

function randomColor(){

  //Pick a "red" from 0-255.
  let r = Math.floor(Math.random()*256);
  //Pick a "green" from 0-255.
  let g = Math.floor(Math.random()*256);
  //Pick a "blue" from 0-255.
  let b = Math.floor(Math.random()*256);

  return "rgb(" + r + ", " + g + ", " + b +")";

}
