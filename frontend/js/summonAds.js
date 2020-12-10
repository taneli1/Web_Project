//  Create all the items of this user by looping through them 1 by 1
window.createNewItems = async (items) => {
  let item = {
    'name': '',
    'image': '',
    'city': '',
    'price': '',
    'category': '',
  };

  for (let i = 0; i < items.length; i++) {
    const response = await fetch(url + '/user' + '/' + items[i].user_id);
    console.log(items);
    const user = await response.json();
    let itemId = items[i].ad_id;

    item.name = items[i].item_name != null ?
        items[i].item_name : 'No name';
    item.image = items[i].image != null ?
        items[i].image : 'No image';
    item.city = items[i].city != null ?
        items[i].city : 'No city';
    item.price = items[i].price != null ?
        items[i].price : 'No price';
    item.category = items[i].category != null ?
        items[i].category : 'No category';
    showItems(item, user, itemId);
  }
};
// After getting all the info from 1 item, the values are
// passed to this function, which
// transforms it into a div (box) of it's own
const showItems = (item, user, itemId) => {
  console.log('here are the items 3.0', item);

  let new_item = document.getElementById('new-item');
  let new_item_slot = document.createElement('div');
  new_item.appendChild(new_item_slot);

  let h2E = document.createElement('h4');
  h2E.setAttribute('id', 'name');
  new_item_slot.appendChild(h2E);
  let item_name = document.createTextNode(item.name);
  h2E.appendChild(item_name);

  let price = document.createElement('h4');
  price.setAttribute('id', 'price');
  new_item_slot.appendChild(price);
  price.innerHTML += item.price + '€';

  let image = document.createElement('figure');
  new_item_slot.appendChild(image);
  image.innerHTML += '<img src="' + '../../public/thumbnails/' + item.image +
      '" alt="There is no picture">\n';

  let cityText = document.createElement('a');
  new_item_slot.appendChild(cityText);
  cityText.innerHTML += 'Location: ' + item.city;

  let catText = document.createElement('a');
  new_item_slot.appendChild(catText);
  catText.innerHTML += 'Category: ' + item.category;

  clickItem(new_item_slot, user, itemId);
};

// after item and a div for it are created, we set an click listener to it
// that redirects to the clicked individual div
// also set some key information about the ad to local storage so on other sites
// know which item to access
const clickItem = (item, user, itemId) => {
  item.addEventListener('click', function() {
    document.location.href = '../html/singleAd.html';
    localStorage.setItem('listedBy', user.user_id);
    localStorage.setItem('itemId', itemId);
  });
};