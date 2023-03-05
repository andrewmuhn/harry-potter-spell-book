
let spellSelectEl = document.querySelector('#spell-select');

const searchApi = (requestUrl) => {

  fetch(requestUrl)
    .then((response) => {

      return response.json();
    })
    .then((data) => {
      console.log('Fetch Response \n----------------');
      console.log(data);
      generateOptions(data);
    })
}



const generateOptions = (data) => {

  for (let i = 0; i < data.length; i++) {
    const spellName = data[i].name;

    let spellOptionEl = document.createElement('option');
    spellOptionEl.value = spellName.toLowerCase();
    spellOptionEl.textContent = spellName;

    spellSelectEl.append(spellOptionEl);
  }
}

searchApi('https://hp-api.onrender.com/api/spells');