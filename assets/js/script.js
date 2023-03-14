const hpSpellApi = 'https://hp-api.onrender.com/api/spells'
const searchFormEl = document.querySelector('#search-form');
const spellSelectEl = document.querySelector('#spell-select');
const spellCardEl = document.querySelector('#spell-cards');
const spellNameEl = document.querySelector('#spell-name');
const spellDescriptionEl = document.querySelector('#spell-description');
const favSpellCardEl = document.querySelector('.favCards');
let localStoreArray = [];

let dataHolder;

// * Fetch request 
const searchApi = (requestUrl) => {
  fetch(requestUrl)
    .then((response) => {

      return response.json();
    })
    .then((data) => {
      console.log('Fetch Response \n----------------');
      console.log(data);
      if (requestUrl.includes('hp-api')) {
        dataHolder = data;
        generateOptions(data);
        displayRandomCard(data);
        showFavorites(data);
      }
    })
}

//takes server response and extracts spell names and generates options out of them
const generateOptions = (data) => {
  for (let i = 0; i < data.length; i++) {
    const spellName = data[i].name;
    let spellOptionEl = document.createElement('option');
    spellOptionEl.value = spellName;
    spellOptionEl.textContent = spellName;
    spellSelectEl.append(spellOptionEl);
  }
}

//handles all the dom manipulation for displaying a new card
const newCard = (index, data) => {
  let spellName = data[index].name;
  let spellDescription = data[index].description;

  let cardEl = document.createElement('section');
  cardEl.setAttribute('class', 'card');

  let cardHeader = document.createElement('header');
  let ttsButton = document.createElement('button');
  ttsButton.setAttribute('id', 'textSpeechButton');
  let ttsIcon = document.createElement('i');
  ttsIcon.setAttribute('class', 'fa-solid fa-volume-high')

  let spellNameEl = document.createElement('p');
  spellNameEl.setAttribute('id', 'spell-name');
  spellNameEl.textContent = spellName;

  let spellDescriptionEl = document.createElement('p');
  spellDescriptionEl.setAttribute('id', 'spell-description');
  spellDescriptionEl.textContent = spellDescription;
  let favoriteButton = document.createElement('button');
  favoriteButton.setAttribute('id', 'favoriteButton');
  favoriteButton.textContent = 'Favorite';

  ttsButton.append(ttsIcon);
  cardHeader.append(ttsButton);
  cardHeader.append(spellNameEl);
  cardEl.append(cardHeader);
  cardEl.append(spellDescriptionEl);
  spellCardEl.append(cardEl);
  cardEl.append(favoriteButton);

  ttsButton.addEventListener('click', function(){
    responsiveVoice.speak(spellName);
  });
}

//handles dom manip and creation of favorite list card
const newFavCard = (index, data) => {
  let spellName = data[index].name;
  let spellDescription = data[index].description;

  let cardEl = document.createElement('section');
  cardEl.setAttribute('class', 'card');

  let cardHeader = document.createElement('header');
  let ttsButton = document.createElement('button');
  ttsButton.setAttribute('id', 'favTextSpeechButton');
  let ttsIcon = document.createElement('i');
  ttsIcon.setAttribute('class', 'fa-solid fa-volume-high')
  
  let spellNameEl = document.createElement('p');
  spellNameEl.setAttribute('id', 'spell-name');
  spellNameEl.textContent = spellName;

  let spellDescriptionEl = document.createElement('p');
  spellDescriptionEl.setAttribute('id', 'spell-description');
  spellDescriptionEl.textContent = spellDescription;
  let unfavoriteButton = document.createElement('button');
  unfavoriteButton.setAttribute('id', 'unFavoriteButton');
  unfavoriteButton.textContent = 'unFavorite';

  ttsButton.append(ttsIcon);
  cardHeader.append(ttsButton);
  cardHeader.append(spellNameEl);
  cardEl.append(cardHeader);
  cardEl.append(spellDescriptionEl);
  favSpellCardEl.append(cardEl);
  cardEl.append(unfavoriteButton);

  ttsButton.addEventListener('click', function(){
    responsiveVoice.speak(spellName);
  });
}

//displays a random card on load
const displayRandomCard = (data) => {
  spellCardEl.innerHTML = '';
  let randomIndex = Math.floor(Math.random() * 78);
  newCard(randomIndex, data);
  favoriteButton();
}

//gets user selected spell and check to see if it matches the name of any spells from the server if it does it will change the 
const handleFormSubmit = (event) => {
  event.preventDefault();
  spellCardEl.innerHTML = '';
  let spell = spellSelectEl.value;
  for (let i = 0; i < dataHolder.length; i++) {
    if (dataHolder[i].name === spell) {
      newCard(i, dataHolder);
    }

  }
  favoriteButton();
}

//Checks when theres cards present in the favorite list
const checkFavDupes = (count, list) => {
  //Checks for duplicate card in list
  var spellName = document.querySelector("#spell-name").textContent;
  var spellArray = [];

  for(var i = 0; i < count; i++){
    if(list[i].textContent.includes(spellName)){
      spellArray.push(list[i]);
      console.log(spellArray);
      console.log("Dupe Found, ignoring addition of card.");
      return;
    }
  }
  
  //If none were found, finds card and adds it.
  console.log("No Dupes Found.");
  for (let i = 0; i < dataHolder.length; i++) {
    if (dataHolder[i].name === spellName) {
      localStoreArray = JSON.parse(localStorage.getItem('FavoriteSpells'));
      localStoreArray.push(spellName);
      localStorage.setItem('FavoriteSpells', JSON.stringify(localStoreArray));
      newFavCard(i, dataHolder);
      return;
    }
  }
}

//Activates when a card is pressed
const favoriteCard = () => {
  var spellName = document.querySelector("#spell-name").textContent;

  favSpells = favSpellCardEl.children;
  favSpellsCount = favSpells.length;

  //Checks if the list of spells is empty or not.
  //If it is not empty, run CheckFavDupes().
  if(favSpellsCount === 0){
    //finds specific spell and passes it in for this session.
    for (let i = 0; i < dataHolder.length; i++) {
      if (dataHolder[i].name === spellName) {
        localStoreArray.push(spellName);
        localStorage.setItem('FavoriteSpells', JSON.stringify(localStoreArray));
        newFavCard(i, dataHolder);
      }
    }
  }else{
    //Looks for duplicate favorites
    checkFavDupes(favSpellsCount, favSpells);
  }
}

//Generates favorites from local storage and counts favorites
function showFavorites(data){
  const favCardsArray = JSON.parse(localStorage.getItem('FavoriteSpells'));
  if(!favCardsArray){
    return;
  }

  for(var i = 0; i < favCardsArray.length; i++){
    var spellName = favCardsArray[i];
    console.log(spellName);
    for (var j = 0; j < data.length; j++) {
      if (data[j].name === spellName) {
        newFavCard(j, data);      
      }
    }
  }
}

//Initial call to hp-api to get spell list
searchApi(hpSpellApi);

//listens for clicks on form submit button
searchFormEl.addEventListener('submit', handleFormSubmit);

//Listener for Favorite Button
const favoriteButton = () => {
  favButton = document.querySelector("#favoriteButton");
  favButton.addEventListener("click", function(){
    favoriteCard();
  });
}