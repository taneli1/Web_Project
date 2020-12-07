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
const search = document.getElementById('search');

if (localStorage.getItem("hiddenAdType") === 'buy'){
  ad_buy.checked = true
}


// Invisible hidden field, gets it's value from the radiogroup
// All actions regarding this radiogroup/switch come from this hidden field actually
// This is done so clicking one of the buttons triggers event handler instantly
// instead of waiting for additional "submit" click
const adTypeSwitch = () => {
  const value = document.querySelector(
      'input[name="ad_typeSelector"]:checked').value;
  console.log("here is the value of that stupid button", value)
  if (value === 'buy') {
    adTypeHiddenField.value = 'buy';
    localStorage.setItem("hiddenAdType", 'buy')
  } else {
    adTypeHiddenField.value = 'sell';
    localStorage.setItem("hiddenAdType", 'sell')
  }
};
const profileButton = document.getElementById('profile');

// Selects which type of ads are shown to the user on main page

const adFilters = (type) => {
  type.addEventListener('click', async () => {
    adTypeSwitch();
    new_item.innerHTML = '';
    if (adTypeHiddenField.value === 'buy') {
      const response = await fetch(url + '/ad/buy');
      const items = await response.json();
      console.log("here are the items", items)
      await window.createNewItems(items);
    } else {
      const response = await fetch(url + '/ad/sell');
      const items = await response.json();
      await window.createNewItems(items);
    }
  });
};

// but since both the buttons need click listeners we need
// to call this function 2 times
adFilters(ad_buy);
adFilters(ad_sell);

const getAllAdsSell = async () => {
  // Default type for shown ads on the main page is sell
  if (localStorage.getItem("hiddenAdType") === 'buy'){
    const response = await fetch(url + '/ad/buy');
    const items = await response.json();
    await window.createNewItems(items);
  }
  else {
    const response = await fetch(url + '/ad/sell');
    const items = await response.json();
    await window.createNewItems(items);
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

search.addEventListener('keydown', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();

    searchButton.click();
  }
});

// Listener for search button which also redirects user to search page
const searchClick = () => {
    const searched = document.getElementById('search').value;
    adTypeSwitch();
    const value = adTypeHiddenField.value;
    document.location.href = '../html/searchPage.html';
    localStorage.setItem('searched', searched);
    localStorage.setItem('adType', value);
};

