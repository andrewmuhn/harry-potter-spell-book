const hpSpellApi = 'https://hp-api.onrender.com/api/spells'
const searchFormEl = document.querySelector('#search-form');
const spellSelectEl = document.querySelector('#spell-select');
const spellCardEl = document.querySelector('#spell-cards');
const spellNameEl = document.querySelector('#spell-name');
const spellDescriptionEl = document.querySelector('#spell-description');
const favSpellCardEl = document.querySelector('.favCards');

let favCounter = 0;
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
}

//handles dom manip and creation of favorite list card
const newFavCard = (index, data) => {
  console.log("Creating Card");
  let spellName = data[index].name;
  let spellDescription = data[index].description;

  let cardEl = document.createElement('section');
  cardEl.setAttribute('class', 'card');

  let cardHeader = document.createElement('header');
  
  let spellNameEl = document.createElement('p');
  spellNameEl.setAttribute('id', 'spell-name');
  spellNameEl.textContent = spellName;

  let spellDescriptionEl = document.createElement('p');
  spellDescriptionEl.setAttribute('id', 'spell-description');
  spellDescriptionEl.textContent = spellDescription;
  let unfavoriteButton = document.createElement('button');
  unfavoriteButton.setAttribute('id', 'unFavoriteButton');
  unfavoriteButton.textContent = 'unFavorite';

  cardHeader.append(spellNameEl);
  cardEl.append(cardHeader);
  cardEl.append(spellDescriptionEl);
  favSpellCardEl.append(cardEl);
  cardEl.append(unfavoriteButton);
}

//displays a random card on load
const displayRandomCard = (data) => {
  spellCardEl.innerHTML = '';
  let randomIndex = Math.floor(Math.random() * 78);
  newCard(randomIndex, data);
  enableTTS();
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
  enableTTS();
  favoriteButton();
}

//Activates when a card is pressed
const favoriteCard = () => {
  console.log("Favorite Button Registered");
  var spellName = document.querySelector("#spell-name").textContent;
  console.log(spellName);

  localStorage.setItem("favSpell" + favCounter, spellName);
  //increments favCounter for this current session
  favCounter = favCounter + 1;

  //finds specific spell and passes it in for this session.
  for (let i = 0; i < dataHolder.length; i++) {
    if (dataHolder[i].name === spellName) {
      newFavCard(i, dataHolder);
    }
  }
}

//Generates favorites from local storage and counts favorites
function showFavorites(){
  for(var i = 0; i < dataHolder.length; i++){
    if(localStorage.getItem("favSpell" + favCounter)){
      favCounter = favCounter + 1;
      newFavCard(i, dataHolder);
    }
  }
}

//Initial call to hp-api to get spell list
searchApi(hpSpellApi);

//Shows favorite cards on page load
// showFavorites();

//listens for clicks on form submit button
searchFormEl.addEventListener('submit', handleFormSubmit);

//Listener for TextToSpeech
const enableTTS = () => {
  speechButton = document.querySelector("#textSpeechButton");
  speechButton.addEventListener("click", function () {
    var givenSpell = speechButton.nextElementSibling.textContent;
    responsiveVoice.speak(givenSpell);
  });
}

// //Listener for Favorite Button
const favoriteButton = () => {
  favButton = document.querySelector("#favoriteButton");
  favButton.addEventListener("click", function(){
    console.log("Favorite clicked.");
    favoriteCard();
  });
}