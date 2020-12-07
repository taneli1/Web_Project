'use strict';

const url = 'https://10.114.32.43/app'

let searched = localStorage.getItem('searched');
let adType = localStorage.getItem('adType');
const adTypeHiddenField = document.getElementById('adType');
let search_item = document.getElementById('new-item');
const ad_buy = document.getElementById('ad_buy');
const ad_sell = document.getElementById('ad_sell');
const category = document.getElementById('category');
const searchButton = document.getElementById('searchButtonS');
const searchPageS = document.getElementById('searchPageS');

console.log(searched);
console.log(adType);

/*Checks buy if search was made with buy and sell if sell*/
const selectedType = () => {
  if (adType === 'buy') {
    ad_buy.checked = true;
  }else {
    ad_sell.checked = true;
    
  }
};

selectedType();

const putCategoriesToForm = async () => {
  const fetchOptions = {
    method: 'GET',
  };
  const response = await fetch(url + '/ad/category/get', fetchOptions);
  const categories = await response.json();
  for (let i = 0; i < categories.length; i++) {
    let option = document.createElement('option');
    option.value = categories[i].ctg_id;
    option.text = categories[i].category;
    category.appendChild(option);
  }
};

putCategoriesToForm();

/*Gets the search result from main page*/
const getSearchResult = async () => {
  searchPageS.value = searched;
  const response = await fetch(url + '/ad/search/' + adType + '/' + searched + '/empty');
  const searchR = await response.json();

  await window.createNewItems(searchR);
};

const adTypeSwitch = () => {
  const value = document.querySelector(
      'input[name="ad_typeSelector"]:checked').value;
  if (value === 'buy') {
    adTypeHiddenField.value = 'buy';
  } else {
    adTypeHiddenField.value = 'sell';
  }
};

const adFilters = (type) => {
  type.addEventListener('click', async () => {
    adTypeSwitch();
    console.log(adTypeHiddenField.value);
    search_item.innerHTML = '';
    const searched = document.getElementById('searchPageS').value;
    const cateG = document.getElementById('category').value;

    if (adTypeHiddenField.value === 'buy' && searched !== '') {
      const response = await fetch(url + '/ad/search/buy/' + searched + '/' + cateG);
      const items = await response.json();

      await window.createNewItems(items);
    } else if (adTypeHiddenField.value === 'sell' && searched !== ''){
      const response = await fetch(url + '/ad/search/sell/' + searched + '/' + cateG);
      const items = await response.json();

      await window.createNewItems(items);
    }

    if (adTypeHiddenField.value === 'buy' && searched === '') {
      const response = await fetch(url + '/ad/category/buy/' + cateG);
      const searchResult = await response.json();

      await window.createNewItems(searchResult);
    }else if (adTypeHiddenField.value === 'sell' && searched === '') {
      const response = await fetch(url + '/ad/category/sell/' + cateG);
      const searchResult = await response.json();

      await window.createNewItems(searchResult);
    }
  });
};

/*Search with enter key*/
searchPageS.addEventListener('keydown', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();

   searchButton.click();
  }
});

/*Search with search button*/
const search = async () => {
    adTypeSwitch();
    search_item.innerHTML = '';
    const searched = document.getElementById('searchPageS').value;
    const cateG = document.getElementById('category').value;
    console.log(searched);
    console.log(cateG);

    if (adTypeHiddenField.value === 'buy' && searched !== '') {
      const response = await fetch(url + '/ad/search/buy/' + searched + '/' + cateG);
      const searchResult = await response.json();

      await window.createNewItems(searchResult);
    } else if (adTypeHiddenField.value === 'sell' && searched !== ''){
      const response = await fetch(url + '/ad/search/sell/' + searched + '/' + cateG);
      const searchResult = await response.json();

      await window.createNewItems(searchResult);
    }

  if (adTypeHiddenField.value === 'buy' && searched === '') {
    const response = await fetch(url + '/ad/category/buy/' + cateG);
    const searchResult = await response.json();

    await window.createNewItems(searchResult);
  }else if (adTypeHiddenField.value === 'sell' && searched === '') {
    const response = await fetch(url + '/ad/category/sell/' + cateG);
    const searchResult = await response.json();

    await window.createNewItems(searchResult);
  }
};

adFilters(ad_buy);
adFilters(ad_sell);
getSearchResult();

