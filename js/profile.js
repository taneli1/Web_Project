const url = 'http://localhost:3000';
const logoutButton1 = document.getElementById('logout1');
const name = document.getElementById('userName');
const city = document.getElementById('city');
const eMail = document.getElementById('eMail');
const phoneNumber = document.getElementById('phoneNumber');
const editButton = document.getElementById('edit');
const editField = document.getElementById('editProfile');
const userInfo = document.getElementById('userInfo');

const editName = document.querySelector("form[id='editProfile'] input[name='editUserName']");
const editCity = document.querySelector("form[id='editProfile'] input[name='editCity']");
const editEMail = document.querySelector("form[id='editProfile'] input[name='editEMail']");
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
    city.innerText = user.city
    editCity.setAttribute('value', user.city)
    eMail.innerText = user.email
    editEMail.setAttribute('value', user.email)
    phoneNumber.innerText = user.phone_number
    editPhoneNumber.setAttribute('value', user.phone_number)
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
  console.log(fetchOptions.body)
  const response = await fetch(url + '/auth/update/' + userId , fetchOptions);
  const json = await response.json();

  editField.style.display = "none"
  editButton.style.display = "block"
  userInfo.style.display = "block"
  console.log("kalaaaaa")
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

getUserInfo()
