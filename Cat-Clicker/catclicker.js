const CATS = document.getElementById("sideCatBox");
const MAINCAT = document.getElementById("mainCatBox");
let catArray;

CATS.addEventListener('click', countUp);
addTheCats(createCats(5));

function Cat (id,  name, count, smallPicURL, picURL){
    this.id = id;
    this.name = name;
    this.count = count;
    this.smallPicURL = smallPicURL;
    this.picURL = picURL;
    this.alt = "Added later";
}

function  createCats(num){
//create cat objects to fill cat array
catArray = [];

  for(let i = 0; i < num; i++){
    let catName = nameTheCat(i);
    let cat = new Cat(i,catName,0,"catSmall"+i+".png", "cat"+i+".png");
    catArray.push(cat);
  }
  return catArray;
}

function addTheCats(catsInArr){
  //go through catarray, create an element for each, add it to the document fragment, when ready add it to
  //div-element: CATS
    let elementToBeAdded;
    const fragment = document.createDocumentFragment();
    howManyCats = catsInArr.length;
    for(let i=0; i < howManyCats; i++){
      let cat = catsInArr[i];
      //Add img info inside div.
      let elementToBeAdded = document.createElement("div");
      elementToBeAdded.innerHTML = "<div class='catName'>"+cat.name+"</div><div class='counter'>"+cat.count+"</div><img class='clickable' id='"+cat.id+"' src='"+cat.smallPicURL+"'' alt='"+cat.alt+"'>";
      //Add card div with img info to document fragment.
      fragment.appendChild(elementToBeAdded);
    }
    //Add the document fragment that has all the divs with pic-info to the game-div.
    CATS.appendChild(fragment);
  }

function nameTheCat(nameNum){
  //randomize a name from nameArray and return it
  let nameArray = ["Jack Bauer", "Jone Nikula", "Misse", "Sisu", "Tiuku", "Karvinen", "Tahvo", "Rölli", "Kisu", "Rambo", "Tiikeri", "Kissi"];
  return nameArray[nameNum];
}

function countUp(e){
  let id = e.target.id;
  theCat = catArray[id];
  let mainPic = theCat.picURL;
  theCat.count++;
  document.getElementById(id).previousSibling.textContent = theCat.count;
  MAINCAT.innerHTML = "";
  MAINCAT.innerHTML = "<img src='"+mainPic+"'>";
//Check the id, check the right object from array, take the right property/attribute
//picURL
}
