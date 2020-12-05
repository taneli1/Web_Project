'use strict';

const url = 'http://localhost:3000';

const searchButton = document.getElementById('searchButton');
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
let new_item = document.getElementById('new-item');
const adTypeHiddenField = document.getElementById('adType');
const ad_buy = document.getElementById('ad_buy');
const ad_sell = document.getElementById('ad_sell');
const createAd = document.getElementById('createAd')
const loginNote = document.getElementById('note')

// Invisible hidden field, gets it's value from the radiogroup
// All actions regarding this radiogroup/switch come from this hidden field actually
// This is done so clicking one of the buttons triggers event handler instantly
// instead of waiting for additional "submit" click
const adTypeSwitch = () => {
  const value = document.querySelector(
      'input[name="ad_typeSelector"]:checked').value;
  if (value === 'buy') {
    adTypeHiddenField.value = 'buy';
  } else {
    adTypeHiddenField.value = 'sell';
  }
};
const profileButton = document.getElementById('profile');

// Selects which type of ads are shown to the user on main page

const adFilters = (type) => {
  type.addEventListener('click', async () => {
    adTypeSwitch();
    console.log(adTypeHiddenField.value);
    new_item.innerHTML = '';
    try {
      if (adTypeHiddenField.value === 'buy') {
        const response = await fetch(url + '/ad/buy');
        const items = await response.json();

        await createNewItems(items);
      } else {
        const response = await fetch(url + '/ad/sell');
        const items = await response.json();

        await createNewItems(items);
      }
    }
    catch (e) {
      console.log(e.message)
    }
  });
};

// but since both the buttons need click listeners we need
// to call this function 2 times
adFilters(ad_buy);
adFilters(ad_sell);

const getAllAdsSell = async () => {
  // Default type for shown ads on the main page is sell
  try {
    const response = await fetch(url + '/ad/sell');
    const items = await response.json();
    await createNewItems(items);
  }
  catch (e) {
    console.log(e.message)
  }

};

// Shows the buttons accordingly when user is or is not logged in
const buttonVisibility = () => {
  if (document.cookie.includes('token')) {
    loginButton.style.display = 'none';
    loginNote.style.display = 'none';

  } else {
    logoutButton.style.display = 'none';
    profileButton.style.display = 'none';
    createAd.style.display = 'none';
  }
};

// Button for logging out
const logoutAction = () => {
  logoutButton.addEventListener('click', async () => {
    delete_cookie('token');
  });
};

// deletes the cookie which keeps user logged in
function delete_cookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

getAllAdsSell();
buttonVisibility();
logoutAction();

//  Create all the items of this user by looping through them 1 by 1
const createNewItems = async (items) => {
  let item = {
    'name': '',
    'image': '',
    'city': '',
    'price': '',
    'desc': '',
    'category': '',
  };

  for (let i = 0; i < items.length; i++) {
    try {
      const response = await fetch(url + '/user' + '/' + items[i].listed_by);
      const user = await response.json();
      let itemId = items[i].ad_id
      let itemType = items[i].type

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
      item.category = items[i].description != null ?
          items[i].category : 'No category';
      showItems(item, user, itemId, itemType);
    }
    catch (e) {
      e.message
    }
  }
};
// After getting all the info from 1 item, the values are
// passed to this function, which
// transforms it into a div (box) of it's own
const showItems = (item, user, itemId, itemType) => {
    let new_item = document.getElementById('new-item');
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
  descText.innerHTML += 'Category: ';
  desc.innerHTML += item.category;

    clickItem(new_item_slot, user, itemId, itemType);
};


// after item and a div for it are created, we set an click listener to it
// that redirects to the clicked individual div
// also set some key information about the ad to local storage so on other sites
// know which item to access
const clickItem = (item, user, itemId, itemType) => {
  item.addEventListener('click', function() {
    document.location.href = '../../html/singleAd.html';
    localStorage.setItem('item', item.innerHTML);
    localStorage.setItem('listedBy', user.user_id)
    // Passing of item ID can be deleted in the future since all the ads are in same table
    localStorage.setItem('itemId', itemId);
    localStorage.setItem('itemType', itemType);
  });
};

// Listener for search button which also redirects user to search page
const searchClick = () => {
  searchButton.addEventListener('click', function() {
    const searched = document.getElementById('search').value;
    adTypeSwitch();
    const value = adTypeHiddenField.value;
    document.location.href = '../html/searchPage.html';
    localStorage.setItem('searched', searched);
    localStorage.setItem('adType', value);
  });
};

searchClick();
