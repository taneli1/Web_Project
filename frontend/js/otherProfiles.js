const url = 'http://localhost:3000';
const logoutButton1 = document.getElementById('logout1');
const name = document.getElementById('userName');
const city = document.getElementById('user_city');
const eMail = document.getElementById('eMail');
const phoneNumber = document.getElementById('phoneNumber');


// Here we get the ad owner's information by making a fetch with it's ID
const getUserInfo = async () => {
  let get_owner = localStorage.getItem('listedBy');
    const response = await fetch(url + '/user/' + get_owner);
    const user = await response.json();
    console.log("KÄYTTÄJÄ", user)
    name.innerText = user.name
    city.innerText = user.user_city
    eMail.innerText = user.email
    phoneNumber.innerText = user.phone_number
    await getAllAds(get_owner)
}

// Function for getting all the ads of passed user
const getAllAds = async (id) =>  {
    const response = await fetch(url + '/ad/user/' + id);
    const items = await response.json();
    console.log(items)
    await createNewItems(items);
};

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
    item.category = items[i].category != null ?
        items[i].category : 'No category';
    showItems(item);
  }
};

// After getting all the info from 1 item, the values are
// passed to this function, which
// transforms it into a div (box) of it's own
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
};

// after item and a div for it are created, we set an click listener to it
// that redirects to the clicked individual div
const clickItem = (item) => {
  item.addEventListener('click', function() {
    document.location.href = '../html/singleAd.html';
    localStorage.setItem('item', item.innerHTML);
  });
};


getUserInfo()