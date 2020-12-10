'use strict';

//const item = document.location.href = '../html/main.html';
const url = window.url;
let getItemId = localStorage.getItem('itemId');
let listedBy = localStorage.getItem('listedBy');
const deleteButton = document.getElementById('deleteButton')
const profileButton = document.getElementById('profileButton')

deleteButton.style.display = "none"


profileButton.addEventListener('click', async () => {
  let myId
  const token = getCookie("token")
  if (token === undefined){
    document.location.href = '../html/otherProfiles.html';
  }
  else {
    myId = tokenFormatter(token).toString()
  }
  if (listedBy === myId){
    document.location.href = '../html/profile.html';
  }
  else {
    document.location.href = '../html/otherProfiles.html';
  }
})

const createDeleteButton = (listedBy) => {
  let userId
  const token = getCookie("token")
  if (token === undefined){
    console.log("voi voi")
  }
  else {
    userId = tokenFormatter(token).toString()
  }
  console.log("here are the ids", listedBy, userId)
  if (listedBy.toString() === userId){
    deleteButton.style.display = "block"
    deleteAd(token)
  }
}

const deleteAd = async (token) => {
  const itemId2 = parseInt(getItemId)
  deleteButton.addEventListener('click', async () => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    await fetch(url + '/ad/' + itemId2, fetchOptions);
    document.location.href = '../html/profile.html'
    window.alert("delete successful");
  })
}
// Formatter for json parse
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


const putItemsToBoxes = async () => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(url + '/ad/id/' + getItemId, fetchOptions);
  const json = await response.json();
  const user_id = json.user_id
  createDeleteButton(user_id)
  await createNewItems(json)
}
putItemsToBoxes()

const createNewItems = async (items) => {
  console.log("items: ", items)
  let item = {
    'name': '',
    'image': '',
    'city': '',
    'price': '',
    'desc': '',
    'category': '',
    'listed_by': '',
    'listDate': '',
  };

  const response = await fetch(url + '/user' + '/' + items.user_id);
  const user = await response.json();
  console.log(user)

  item.name = items.item_name != null ?
      items.item_name : 'No name';
  item.image = items.image != null ?
      items.image : 'No image';
  item.city = items.city != null ?
      items.city : 'No city';
  item.price = items.price != null ?
      items.price : 'No price';
  item.desc = items.description != null ?
      items.description : 'No description';
  item.category = items.category != null ?
      items.category : 'No category';
  item.user_id = user.name != null ?
      user.name : 'No username';
  item.posted_on = items.posted_on != null ?
      items.posted_on : 'No date';
  showItems(item);
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
  image.innerHTML += '<img src="' + '../../public/images/' + item.image +
      '" alt="There is no picture">\n';

  let cityText = document.createElement('label');
  let city = document.createElement('a');
  new_item_slot.appendChild(cityText);
  new_item_slot.appendChild(city);
  cityText.innerHTML += 'Location: ';
  city.innerHTML += item.city;

  let priceText = document.createElement('label');
  let price = document.createElement('a');
  new_item_slot.appendChild(priceText);
  new_item_slot.appendChild(price);
  priceText.innerHTML += 'Price: ';
  price.innerHTML += item.price + '€';

  let descText = document.createElement('label');
  let desc = document.createElement('a');
  new_item_slot.appendChild(descText);
  new_item_slot.appendChild(desc);
  descText.innerHTML += 'Description: ';
  desc.innerHTML += item.desc;

  let catText = document.createElement('label');
  let cat = document.createElement('a');
  new_item_slot.appendChild(catText);
  new_item_slot.appendChild(cat);
  catText.innerHTML += 'Category: ';
  cat.innerHTML += item.category;

  let listedText = document.createElement('label')
  let user_id = document.createElement('a');
  new_item_slot.appendChild(listedText);
  new_item_slot.appendChild(user_id)
  listedText.innerHTML += 'Listed by: ';
  user_id.innerHTML += item.user_id;

  let date = document.createElement('label');
  let dateText = document.createElement('a');
  new_item_slot.appendChild(date);
  new_item_slot.appendChild(dateText);
  date.innerHTML += 'Posted on: ';
  const date2 = item.posted_on.substring(0, item.posted_on.indexOf('T'));
  dateText.innerHTML += date2;
};