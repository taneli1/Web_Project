'use strict';

const url = 'http://localhost:3000';

let searched = localStorage.getItem('searched');
let adType = localStorage.getItem('adType');
const adTypeHiddenField = document.getElementById('adType');
let search_item = document.getElementById('new-item');
const ad_buy = document.getElementById('ad_buy');
const ad_sell = document.getElementById('ad_sell');
const category = document.getElementById('category');
const sorting = document.getElementById('sorting');
const searchButton = document.getElementById('searchButtonS');

console.log(searched);
console.log(adType);

const putCategoriesToForm = async () => {
  const fetchOptions = {
    method: 'GET',
  };
  const response = await fetch(url + '/ad/category/get', fetchOptions);
  const categories = await response.json();
  for (let i = 0; i < categories.length; i++){
    let option = document.createElement("option")
    option.value = categories[i].ctg_id
    option.text = categories[i].category
    category.appendChild(option)
  }
}

putCategoriesToForm()

const getSearchResult = async () => {
  const response = await fetch(url + '/ad/search/' + adType + '/' + searched);
  const searchR = await response.json();
  console.log("here we should get the ads", searchR)

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

    if (adTypeHiddenField.value === 'buy') {
      const response = await fetch(url + '/ad/buy');
      const items = await response.json();

      await window.createNewItems(items);
    } else {
      const response = await fetch(url + '/ad/sell');
      const items = await response.json();

      await window.createNewItems(items);
    }
  });
};

const categorySearch = () => {
  category.addEventListener('click', async () => {
    adTypeSwitch();
    search_item.innerHTML = '';
    console.log(category.value);
    const response = await fetch(url + '/ad/category/' + adTypeHiddenField.value + '/' + category.value);
    const items = await response.json();

    await window.createNewItems(items);

  });
};

const sortingSearch = (item) => {
  sorting.addEventListener('click', function() {
  });
};

const search = () => {
  searchButton.addEventListener('click', async () => {
    adTypeSwitch();
    search_item.innerHTML = '';
    const searched = document.getElementById('searchPageS').value;
    let searchForm = document.getElementsByName('search-form')[0];
    console.log(searched);

    if (adTypeHiddenField.value === 'buy') {
      const response = await fetch(url + '/ad/search/buy/' + searched);
      const searchResult = await response.json();

      searchForm.reset();

      await window.createNewItems(searchResult);
    } else {
      const response = await fetch(url + '/ad/search/sell/' + searched);
      const searchResult = await response.json();
      searchForm.reset();
      await window.createNewItems(searchResult);
    }
  });
};

adFilters(ad_buy);
adFilters(ad_sell);
getSearchResult();
categorySearch();
search();
