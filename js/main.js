'use strict';

const url = 'http://localhost:3000';

const search = document.getElementById('searchB');
//const search = document.querySelector(".search");
//const new_item = document.querySelector(".new-items");
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
let new_item = document.getElementById('new-item');
const ad_type = document.getElementById('ad_type');
const adTypeHiddenField = document.getElementById("adType");

const adTypeSwitch = () => {
  const value = document.querySelector('input[name="ad_typeSelector"]:checked').value;
  if (value === "buy"){
    adTypeHiddenField.value = "buy"
  }
  else {
    adTypeHiddenField.value = "sell"
  }
};
const profileButton = document.getElementById('profile')

ad_type.addEventListener('click', async () => {
  adTypeSwitch();
  console.log(adTypeHiddenField.value);
  new_item.innerHTML = "";

  if(adTypeHiddenField.value === 'buy') {
  const response = await fetch(url + '/ad/buy');
  const items = await response.json();

    createNewItems(items);
  }else {
    const response = await fetch(url + '/ad/sell');
    const items = await response.json();

    createNewItems(items);
  }
});

const getAllAdsSell = async () =>  {
  const response = await fetch(url + '/ad/sell');
  const items = await response.json();
  await createNewItems(items);

  createNewItems(items);

  createNewItems(items);
};


const buttonVisibility = () => {
  if (document.cookie.includes('token')){
    loginButton.style.display = "none"
  }
  else {
    logoutButton.style.display = "none"
    profileButton.style.display = "none"
  }
};

const logoutAction = () => {
  logoutButton.addEventListener('click', async () => {
    delete_cookie("token");
  })
};

function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


getAllAdsSell();
buttonVisibility();
logoutAction();

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
    const response = await fetch(url + '/user' + '/' + items[i].listed_by);
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

    let image = document.createElement('figure');
    new_item_slot.appendChild(image);
    image.innerHTML += '<img src="' + '../uploads/' + item.image +
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
