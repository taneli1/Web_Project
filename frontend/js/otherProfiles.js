const url = 'http://localhost:3000';
const logoutButton = document.getElementById('logout');
const name = document.getElementById('userName');
const city = document.getElementById('user_city');
const eMail = document.getElementById('eMail');
const phoneNumber = document.getElementById('phoneNumber');
const loginButton = document.getElementById('login')
const loginNote = document.getElementById('note')
const profileButton = document.getElementById('profile')
const createAd = document.getElementById('createAd')


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
    await window.createNewItems(items);
};


getUserInfo()