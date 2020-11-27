'use strict';

const url = 'http://localhost:3000';

const search = document.querySelector(".search");
const new_item = document.querySelector(".new-items");
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
const buyButtonV = document.getElementById('buy').value;
const buyButton = document.getElementById('buy');
console.log(buyButtonV);

const getAllAds = async () =>  {
  const response = await fetch(url + '/ad');
  const items = await response.json();


  createNewItems(items);
};


  const getAllAdsBuy = async () => {

    const buy = serializeJson(buyButtonV);
    const formData = new FormData();

    formData.append('ad_type', buy);

   /* fetch('https://example.com/profile/avatar', {
      body: formData
    })

    */
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    };

    console.log(fetchOptions.body);
    const response = await fetch(url + '/ad' + fetchOptions);
    const itemsB = await response.json();

    console.log(itemsB);
  };

const buttonVisibility = () => {
  if (document.cookie.includes('token')){
    loginButton.style.display = "none"
  }
  else logoutButton.style.display = "none"
};

const logoutAction = () => {
  logoutButton.addEventListener('click', async () => {
    delete_cookie("token");
    document.location.reload()
  })
};

function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}



getAllAds();
buttonVisibility();
logoutAction();

const createNewItems = async (items) => {
  let item = {
    'name': '',
    'city': '',
    'price': '',
    'desc': '',
    'listed_by': '',
  };


  for (let i = 0; i < items.length; i++) {
    const response = await fetch(url + '/user' + '/' + items[i].listed_by);
    const user = await response.json();

    item.name = items[i].item_name != null ?
        items[i].item_name : 'No name';
    item.city = items[i].city != null ?
        items[i].city : 'No city';
    item.price = items[i].price != null ?
        items[i].price : 'No price';
    item.desc = items[i].description != null ?
        items[i].description : 'No description';
    item.listed_by = user.name != null ?
        user.name : 'No username';
    showItems(item);
  }

};

const showItems = (item) => {
  let new_item = document.getElementById('new-item');
  let new_item_slot = document.createElement('div');
  new_item.appendChild(new_item_slot);

  let h2E = document.createElement('h2');
  new_item_slot.appendChild(h2E);
  let item_name = document.createTextNode(item.name);
  h2E.appendChild(item_name);

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

  let listed_by = document.createElement('p');
  new_item_slot.appendChild(listed_by);
  listed_by.innerHTML += item.listed_by;

  clickItem(new_item_slot);
};

const clickItem = (item) => {
  item.addEventListener('click', function() {
    document.location.href = '../html/singleAd.html';
    localStorage.setItem('item', item.innerHTML);
  });
};
