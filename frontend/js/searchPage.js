'use strict';

const url = 'http://localhost:3000';

let searched = localStorage.getItem('searched');
let adType = localStorage.getItem('adType');
const adTypeHiddenField = document.getElementById('adType');
let search_item = document.getElementById('searchItem');
const ad_buy = document.getElementById('ad_buy');
const ad_sell = document.getElementById('ad_sell');
const category = document.getElementById('categories');
const sorting = document.getElementById('sorting');
const searchButton = document.getElementById('searchButtonS');

console.log(searched);
console.log(adType);

const getSearchResult = async () => {
  const response = await fetch(url + '/ad/search/' + adType + '/' + searched);
  const searchR = await response.json();

  createNewItems(searchR);
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

      createNewItems(items);
    } else {
      const response = await fetch(url + '/ad/sell');
      const items = await response.json();

      createNewItems(items);
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

    createNewItems(items);

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

      createNewItems(searchResult);
    } else {
      const response = await fetch(url + '/ad/search/sell/' + searched);
      const searchResult = await response.json();

      searchForm.reset();

      createNewItems(searchResult);
    }
  });
};

adFilters(ad_buy);
adFilters(ad_sell);
getSearchResult();
categorySearch();
search();

const createNewItems = async (items) => {
  let item = {
    'name': '',
    'image': '',
    'city': '',
    'price': '',
    'desc': '',
    'listed_by': '',
  };

  for (let i = 0; i < items.length; i++) {
    const response = await fetch(url + '/user' + '/' + items[i].user_id);
    const user = await response.json();

    item.name = items[i].item_name != null ?
        items[i].item_name : 'No name';
    item.image = items[i].image_1 != null ?
        items[i].image_1 : 'No image';
    item.city = items[i].city != null ?
        items[i].city : 'No city';
    item.price = items[i].price != null ?
        items[i].price : 'No price';
    item.desc = items[i].description != null ?
        items[i].description : 'No description';
    item.user_id = user.name != null ?
        user.name : 'No username';
    showItems(item);
  }

};
// After getting all the info from 1 item, the values are
// passed to this function, which
// transforms it into a div (box) of it's own
const showItems = (item) => {
  let new_item = document.getElementById('searchItem');
  let new_item_slot = document.createElement('div');
  new_item.appendChild(new_item_slot);

  let h2E = document.createElement('h2');
  new_item_slot.appendChild(h2E);
  let item_name = document.createTextNode(item.name);
  h2E.appendChild(item_name);

  let image = document.createElement('figure');
  new_item_slot.appendChild(image);
  image.innerHTML += '<img src="' + '../../ads/thumbnails/' + item.image +
      '" alt="There is no picture">\n';

  let cityText = document.createElement('label');
  let city = document.createElement('p');
  new_item_slot.appendChild(cityText);
  new_item_slot.appendChild(city);
  cityText.innerHTML += 'Location: ';
  city.innerHTML += item.city;

  let priceText = document.createElement('label');
  let price = document.createElement('p');
  new_item_slot.appendChild(priceText);
  new_item_slot.appendChild(price);
  priceText.innerHTML += 'Price: ';
  price.innerHTML += item.price + '€';

  let descText = document.createElement('label');
  let desc = document.createElement('p');
  new_item_slot.appendChild(descText);
  new_item_slot.appendChild(desc);
  descText.innerHTML += 'Description: ';
  desc.innerHTML += item.desc;

  let catText = document.createElement('label');
  let cat = document.createElement('p');
  new_item_slot.appendChild(catText);
  new_item_slot.appendChild(cat);
  catText.innerHTML += 'Category: ';
  cat.innerHTML += item.category;

  clickItem(new_item_slot);
  sortingSearch(item);
};

const clickItem = (item) => {
  item.addEventListener('click', function() {
    document.location.href = '../html/singleAd.html';
    localStorage.setItem('item', item.innerHTML);
  });
};

