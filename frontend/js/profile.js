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
    await window.createNewItems(items);
  }
  catch (e) {
    console.log(e.message)
  }

};

getUserInfo()