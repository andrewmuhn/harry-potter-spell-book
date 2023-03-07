const hpSpellApi = 'https://hp-api.onrender.com/api/spells'

const searchFormEl = document.querySelector('#search-form');
const spellSelectEl = document.querySelector('#spell-select');
const spellCardEl = document.querySelector('#spell-cards');
const spellNameEl = document.querySelector('#spell-name');
const spellDescriptionEl = document.querySelector('#spell-description');
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
  let spell = spellSelectEl.value;
  for (let i = 0; i < dataHolder.length; i++) {
    if (dataHolder[i].name === spell) {
      let spellDescription = dataHolder[i].description;
      spellDescriptionEl.textContent = spellDescription;
      spellNameEl.textContent = spell;
    }

  }
}


//Initial call to hp-api to get spell list
searchApi(hpSpellApi);

//listens for clicks on form submit button
searchFormEl.addEventListener('submit', handleFormSubmit);