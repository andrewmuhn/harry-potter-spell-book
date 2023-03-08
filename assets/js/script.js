const hpSpellApi = 'https://hp-api.onrender.com/api/spells'

const searchFormEl = document.querySelector('#search-form');
const spellSelectEl = document.querySelector('#spell-select');
const speechButton = document.querySelector("#textSpeechButton");
const spellCardEl = document.querySelector('#spell-cards');
const spellNameEl = document.querySelector('#spell-name');
const spellDescriptionEl = document.querySelector('#spell-description');
let dataHolder;

var favoriteButton = document.querySelector("#favoriteButton");

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
        generateOptions(data);
        displayRandomCard(data);
        dataHolder = data;
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
  ttsButton.append(ttsIcon)
  cardHeader.append(ttsButton);
  cardHeader.append(spellNameEl);
  cardEl.append(cardHeader);
  cardEl.append(spellDescriptionEl);
  spellCardEl.append(cardEl);
}

const displayRandomCard = (data) => {
  spellCardEl.innerHTML = '';
  let randomIndex = Math.floor(Math.random() * 78);
  newCard(randomIndex, data);
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
}

//Activates when a card is pressed
function favoriteCard(){
  var spellID = 

  
}

//Initial call to hp-api to get spell list
searchApi(hpSpellApi);

//listens for clicks on form submit button
searchFormEl.addEventListener('submit', handleFormSubmit);

//Listener for TextToSpeech
speechButton.addEventListener("click", function () {
  var givenSpell = document.getElementById('spell-name');
  console.log(givenSpell);

  responsiveVoice.speak(givenSpell);
});

//Listener for favoriting spells
favoriteButton.addEventListener("click", favoriteCard());