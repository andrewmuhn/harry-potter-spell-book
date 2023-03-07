const hpSpellApi = 'https://hp-api.onrender.com/api/spells'

const searchFormEl = document.querySelector('#search-form');
const spellSelectEl = document.querySelector('#spell-select');
const speechButton = document.querySelector("#textSpeechButton");
const spellCardEl = document.querySelector('#spell-cards');
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
        console.log('hp test');
        generateOptions(data);
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

//gets user selected spell and check to see if it matches the name of any spells from the server if it does it will change the 
const handleFormSubmit = (event) => {
  event.preventDefault();
  spellCardEl.innerHTML = '';
  let spell = spellSelectEl.value;
  for (let i = 0; i < dataHolder.length; i++) {
    if (dataHolder[i].name === spell) {
      let spellDescription = dataHolder[i].description;

      let cardEl = document.createElement('section');
      cardEl.setAttribute('class', 'card');

      let cardHeader = document.createElement('header');
      let ttsButton = document.createElement('button');
      ttsButton.setAttribute('id', 'textSpeechButton');
      let ttsIcon = document.createElement('i');
      ttsIcon.setAttribute('class', 'fa-solid fa-volume-high')

      let spellNameEl = document.createElement('p');
      spellNameEl.setAttribute('id', 'spell-name');
      spellNameEl.textContent = spell;

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

  }
}


//Initial call to hp-api to get spell list
searchApi(hpSpellApi);

//listens for clicks on form submit button
searchFormEl.addEventListener('submit', handleFormSubmit);

//Listener for TextToSpeech
speechButton.addEventListener("click", function () {
  var givenSpell = speechButton.nextElementSibling.textContent;

  responsiveVoice.speak(givenSpell);
});