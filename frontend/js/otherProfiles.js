const url = window.url;
const logoutButton = document.getElementById('logout');
const name = document.getElementById('userName');
const city = document.getElementById('user_city');
const eMail = document.getElementById('eMail');
const phoneNumber = document.getElementById('phoneNumber');
const loginButton = document.getElementById('login')
const loginNote = document.getElementById('note')
const profileButton = document.getElementById('profile')
const createAd = document.getElementById('createAd')
let likes = document.getElementById('likes')
let dislikes = document.getElementById('dislikes')
const percentage = document.getElementById('percentage')

const likeButton = document.getElementById('likeButton')
const dislikeButton = document.getElementById('dislikeButton')


let user


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

buttonVisibility()

// Here we get the ad owner's information by making a fetch with it's ID
const getUserInfo = async () => {
  let get_owner = localStorage.getItem('listedBy');
  const response = await fetch(url + '/user/' + get_owner);
  user = await response.json();
  console.log("KÄYTTÄJÄ", user)
  name.innerText = user.name
  city.innerText = user.user_city
  eMail.innerText = user.email
  phoneNumber.innerText = user.phone_number
  await getLikes(user.user_id)
  await getAllAds(get_owner)
}

// Function for getting all the ads of passed user
const getAllAds = async (id) =>  {
    const response = await fetch(url + '/ad/user/' + id);
    const items = await response.json();
    await window.createNewItems(items);
};
// Function for getting a cookie by it's name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}




const likeUser = async () => {
  let get_owner = localStorage.getItem('listedBy');
  const response = await fetch(url + '/user/' + get_owner);
  user = await response.json();

  likeButton.addEventListener('click', async (evt) => {
    const token = getCookie("token")
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    try {
      await fetch(url + '/rep/' + user.user_id + '/' + "1", fetchOptions);
      await getLikes(user.user_id)
    }
    catch (e) {
      console.log(e.message)
    }
  })
}

const disLikeUser = async () => {
  let get_owner = localStorage.getItem('listedBy');
  const response = await fetch(url + '/user/' + get_owner);
  user = await response.json();
  dislikeButton.addEventListener('click', async (evt) => {
    const token = getCookie("token")
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    try {
      await fetch(url + '/rep/' + user.user_id + '/' + "0", fetchOptions);
      await getLikes(user.user_id)
    }
    catch (e) {
      console.log(e.message)
    }
  })
}

const getLikes = async (user_id) => {
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
  percentage.innerText = "(" + percentageRounded + "%)"
  likes.innerText = likeAmount.toString()
  dislikes.innerText = disLikeAmount.toString()
}


likeUser()
disLikeUser()
getUserInfo()


