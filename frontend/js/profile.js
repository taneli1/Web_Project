const url = 'http://localhost:3000';
const logoutButton1 = document.getElementById('logout1');
const name = document.getElementById('userName');
const city = document.getElementById('user_city');
const eMail = document.getElementById('eMail');
const phoneNumber = document.getElementById('phoneNumber');
const editButton = document.getElementById('edit');
const editField = document.getElementById('editProfile');
const userInfo = document.getElementById('userInfo');
const editName = document.querySelector("form[id='editProfile'] input[name='editUserName']");
const editCity = document.querySelector("form[id='editProfile'] input[name='editCity']");
const editEmail = document.querySelector("form[id='editProfile'] input[name='editEmail']");
const editPhoneNumber = document.querySelector("form[id='editProfile'] input[name='editPhoneNumber']");


editField.style.display = "none"
// Here we get the ad owner's information by making a fetch with it's ID
const getUserInfo = async () => {
  let userId
  const token = getCookie("token")
  if (token === undefined){
    console.log("voi voi")
  }
  else {
     userId = tokenFormatter(token)
  }
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await fetch(url + '/user/' + userId, options);
    const user = await response.json();
    console.log("KÄYTTÄJÄ", user)
    name.innerText = user.name
    editName.setAttribute('value', user.name)
    city.innerText = user.user_city
    editCity.setAttribute('value', user.user_city)
    eMail.innerText = user.email
    editEmail.setAttribute('value', user.email)
    phoneNumber.innerText = user.phone_number
    editPhoneNumber.setAttribute('value', user.phone_number)
    await getAllAds(userId)
  }
  catch (e) {
    console.log(e.message);
  }
}

// Button for logging out
logoutButton1.addEventListener('click', async () => {
  delete_cookie("token");
  })

// Button for editing profile
editButton.addEventListener('click', async () => {
  editField.style.display = "block"
  editButton.style.display = "none"
  userInfo.style.display = "none"
})

// Event listener for form which is sent to database with the included information
editField.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  let userId
  const token = getCookie("token")
  if (token === undefined){
    console.log("voi voi")
  }
  else {
    userId = tokenFormatter(token)
  }
  const fd2 = serializeJson(editField)
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(fd2),
  };
  try {
    await fetch(url + '/auth/update/' + userId , fetchOptions);
  }
  catch (e) {
    console.log(e.message)
  }

  editField.style.display = "none"
  editButton.style.display = "block"
  userInfo.style.display = "block"
  document.location.reload();
});

// deletes the cookie which keeps user logged in
function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Formats login token so it's body can be accessed in the javascript
// aka access the currently logged in user's information
const tokenFormatter = (token) => {
  const id1 = token.substring(token.indexOf(".") + 1);
  const id2 = id1.substring(0, id1.indexOf('.'));
  const data = atob(id2)
  const jsonData = JSON.parse(data)
  return jsonData.user_id
}
// Function for getting a cookie by it's name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
// Function for getting all the ads of passed user
const getAllAds = async (id) =>  {
  try {
    const response = await fetch(url + '/ad/user/' + id);
    const items = await response.json();
    console.log("hello", items);
    await createNewItems(items);
  }
  catch (e) {
    console.log(e.message)
  }

};

//  Create all the items of this user by looping through them 1 by 1
const createNewItems = async (items) => {
  console.log(items)
  let item = {
    'name': '',
    'image': '',
    'city': '',
    'price': '',
    'desc': '',
    'type': '',
    'category': '',

  };

  for (let i = 0; i < items.length; i++) {
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
    showItems(item, itemId, itemType);
  }
};

// After getting all the info from 1 item, the values are
// passed to this function, which
// transforms it into a div (box) of it's own
const showItems = (item, itemId, itemType) => {
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

  clickItem(new_item_slot, itemId, itemType);
};

// after item and a div for it are created, we set an click listener to it
// that redirects to the clicked individual div
// also set some key information about the ad to local storage so on other sites
// know which item to access
const clickItem = (item, itemId, itemType) => {
  item.addEventListener('click', function() {
    document.location.href = '../html/singleAd.html';
    localStorage.setItem('item', item.innerHTML);
    localStorage.setItem('itemId', itemId);
    localStorage.setItem('itemType', itemType);
  });
};


getUserInfo()