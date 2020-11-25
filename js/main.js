'use strict';

const url = 'http://localhost:3000';

const search = document.querySelector(".search");
const new_item = document.querySelector(".new-items");
const loginButton = document.getElementById('login')
const logoutButton = document.getElementById('logout')

const getAllAdsTypeSell = async () =>  {
  const response = await fetch(url + '/ad');
  const items = await response.json();
  createNewItems(items);
};

const buttonVisibility = () => {
  if (document.cookie.includes('token')){
    loginButton.style.display = "none"
  }
  else logoutButton.style.display = "none"
}

const logoutAction = () => {
  logoutButton.addEventListener('click', async () => {
    delete_cookie("token")
    document.location.reload()
  })
}

function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}



getAllAdsTypeSell();
buttonVisibility()
logoutAction()

const createNewItems = (items) => {
  let item = {
    'name': '',
    'city': '',
    'price': '',
    'desc': '',
    'listed_by': '',
  };

  for (let i = 0; i < items.length; i++) {
    item.name = items[i].item_name != null ?
        items[i].item_name : 'No name';
    item.city = items[i].city != null ?
        items[i].city : 'No city';
    item.price = items[i].price != null ?
        items[i].price : 'No price';
    item.desc = items[i].description != null ?
        items[i].description : 'No description';
    item.listed_by = items[i].listed_by != null ?
        items[i].listed_by : 'No';

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
};
