'use strict';

//const item = document.location.href = '../html/main.html';
const url = 'http://localhost:3000';

let getItemId = localStorage.getItem('itemId');
let getItemType = localStorage.getItem('itemType');
const deleteButton = document.getElementById('deleteButton')

deleteButton.style.display = "none"

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
  if (listedBy === userId){
    deleteButton.style.display = "block"
    deleteAd(token)
  }
}

const deleteAd = async (token) => {
  deleteButton.addEventListener('click', async () => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await fetch(url + '/ad/' + getItemType + '/' + getItemId, fetchOptions);
    const json = await response.json();
    console.log(json);
    window.alert("delete successful");
  })
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


const putItemsToBoxes = async () => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(url + '/ad/' + getItemType + '/' + getItemId, fetchOptions);
  const json = await response.json();
  console.log(json)
  createDeleteButton(json.user_id.toString())
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
    'listed_by': '',
  };

  const response = await fetch(url + '/user' + '/' + items.listed_by);
  const user = await response.json();
  console.log(user)

  item.name = items.item_name != null ?
      items.item_name : 'No name';
  item.image = items.image_1 != null ?
      items.image_1 : 'No image';
  item.city = items.city != null ?
      items.city : 'No city';
  item.price = items.price != null ?
      items.price : 'No price';
  item.desc = items.description != null ?
      items.description : 'No description';
  item.listed_by = user.name != null ?
      user.name : 'No username';
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

  let listedText = document.createElement('label')
  let listed_by = document.createElement('p');
  new_item_slot.appendChild(listedText);
  new_item_slot.appendChild(listed_by)
  listedText.innerHTML += 'Listed by: ';
  listed_by.innerHTML += item.listed_by;
};