const url = window.url;
const logoutButton = document.getElementById('logout');
const name = document.getElementById('userName');
const city = document.getElementById('user_city');
const eMail = document.getElementById('eMail');
const phoneNumber = document.getElementById('phoneNumber');
const loginButton = document.getElementById('login');
const loginNote = document.getElementById('note');
const profileButton = document.getElementById('profile');
const createAd = document.getElementById('createAd');
let likes = document.getElementById('likes');
let dislikes = document.getElementById('dislikes');
const percentage = document.getElementById('percentage');
const creationDate = document.getElementById('creationDate');

const likeButton = document.getElementById('likeButton');
const dislikeButton = document.getElementById('dislikeButton');

const likes2 = document.getElementById('likes2');
const dislikes2 = document.getElementById('dislikes2');

let user;

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

buttonVisibility();

// Here we get the ad owner's information by making a fetch with it's ID
const getUserInfo = async () => {
  let get_owner = localStorage.getItem('listedBy');
  const response = await fetch(url + '/user/' + get_owner);
  const token = getCookie('token');
  if (token === undefined) {
    likeButton.style.display = 'none';
    dislikeButton.style.display = 'none';
  } else {
    likes2.style.display = 'none';
    dislikes2.style.display = 'none';
  }
  user = await response.json();
  name.innerText = user.name;
  city.innerText = user.user_city;
  eMail.innerText = user.email;
  phoneNumber.innerText = user.phone_number;
  const date = user.creation_date.toString().
      substring(0, user.creation_date.toString().indexOf('T'));
  creationDate.innerText = date;
  await getLikes(user.user_id);
  await getAllAds(get_owner);
};

// Function for getting all the ads of passed user
const getAllAds = async (id) => {
  const response = await fetch(url + '/ad/user/' + id);
  const items = await response.json();
  await window.createNewItems(items);
};
// Function for getting a cookie by it's name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

//Function for liking the user
const likeUser = async () => {
  let get_owner = localStorage.getItem('listedBy');
  const response = await fetch(url + '/user/' + get_owner);
  user = await response.json();

  likeButton.addEventListener('click', async (evt) => {
    const token = getCookie('token');
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    try {
      await fetch(url + '/rep/' + user.user_id + '/' + '1', fetchOptions);
      await getLikes(user.user_id);
    } catch (e) {
      console.log(e.message);
    }
  });
};

//Function for disliking the user
const disLikeUser = async () => {
  let get_owner = localStorage.getItem('listedBy');
  const response = await fetch(url + '/user/' + get_owner);
  user = await response.json();
  dislikeButton.addEventListener('click', async (evt) => {
    const token = getCookie('token');
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    try {
      await fetch(url + '/rep/' + user.user_id + '/' + '0', fetchOptions);
      await getLikes(user.user_id);
    } catch (e) {
      console.log(e.message);
    }
  });
};

//Function for getting all the likes and dislikes for that user
const getLikes = async (user_id) => {
  let voted2
  const token = getCookie("token")
  if (token){
    try {
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
      };
      const voted = await fetch(url + '/rep/vote/' + user_id, fetchOptions)
      voted2 = await voted.json()
    }
    catch (e) {
      console.log(e.message)
    }
    if (voted2[0]){
      if (voted2[0].is_like === 0){
        showButton(likeButton)
        hideButton(dislikeButton)
      }
      else {
        showButton(dislikeButton)
        hideButton(likeButton)
      }
    }else{
      showButton(likeButton)
      showButton(dislikeButton)

    }

  }


  let likeAmount = 0
  let disLikeAmount = 0
  let percentageValue
  const response2 = await fetch(url + '/rep/' + user_id);
  const res = await response2.json()
  for (let i = 0; i < res.length; i++) {
    if (res[i].is_like === 1){
      likeAmount ++
    }
    else {
      disLikeAmount ++
    }
  }
  percentageValue =  likeAmount / (likeAmount + disLikeAmount) * 100
  const percentageRounded = Math.round(percentageValue * 10) / 10
  if (isNaN(percentageRounded)){
    percentage.innerText = "No reviews yet"
  }
  else {
    percentage.innerText = "(" + percentageRounded + "% recommends)"
  }
  likes.innerText = likeAmount.toString()
  likes2.innerText += likeAmount.toString()
  dislikes.innerText = disLikeAmount.toString()
  dislikes2.innerText += disLikeAmount.toString()
}

const hideButton = (button) => {
  button.style.border = '0px';
  button.style.outline = 'none';
  button.style.backgroundColor = 'white';
};

const showButton = (button) => {
  button.style.border = '1px solid #00091e';
  button.style.outline = 'auto';
  button.style.backgroundColor = 'rgb(239, 239, 239)';
};

// deletes the cookie which keeps user logged in
function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Button for logging out
logoutButton.addEventListener('click', async () => {
  delete_cookie("token");
})

likeUser();
disLikeUser();
getUserInfo();


