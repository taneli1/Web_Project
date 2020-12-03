const url = 'http://10.114.32.43';
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


logoutButton1.addEventListener('click', async () => {
  delete_cookie("token");
  })

editButton.addEventListener('click', async () => {
  editField.style.display = "block"
  editButton.style.display = "none"
  userInfo.style.display = "none"
})

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
  const response = await fetch(url + '/auth/update/' + userId , fetchOptions);
  const json = await response.json();
  console.log('here is your response', json)

  editField.style.display = "none"
  editButton.style.display = "block"
  userInfo.style.display = "block"
  document.location.reload();
});

function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const tokenFormatter = (token) => {
  const id1 = token.substring(token.indexOf(".") + 1);
  const id2 = id1.substring(0, id1.indexOf('.'));
  const data = atob(id2)
  const jsonData = JSON.parse(data)
  return jsonData.user_id
}

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const getAllAds = async (id) =>  {
  const response = await fetch(url + '/ad/user/' + id);
  const items = await response.json();
  console.log("hello", items)
  await createNewItems(items);
};

const createNewItems = async (items) => {
  console.log(items)
  let item = {
    'name': '',
    'image': '',
    'city': '',
    'price': '',
    'desc': '',
    'type': '',
  };

  for (let i = 0; i < items.length; i++) {
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
    showItems(item, user, itemId, itemType);
  }
};

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
  image.innerHTML += '<img src="' + '../ads/thumbnails/' + item.image +
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

  clickItem(new_item_slot, user, itemId, itemType);
};

const clickItem = (item, user, itemId, itemType) => {
  item.addEventListener('click', function() {
    document.location.href = '../html/singleAd.html';
    localStorage.setItem('item', item.innerHTML);
    localStorage.setItem('listedBy', user.user_id);
    localStorage.setItem('itemId', itemId);
    localStorage.setItem('itemType', itemType);
  });
};


getUserInfo()