const logIn = document.getElementById('login-form')
const loginId = document.getElementById('username')
const signIn = document.getElementById('add-user-form')
const mainLink = 'http://localhost:3000/BetterMarket/html/main.html'
const url = 'http://localhost:3000'

/*
const mainPage = (form ,link) => {
  form.addEventListener('submit',async (evt) => {
    evt.preventDefault();
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    };

    const response = await fetch(url + '/auth/login', fetchOptions);
    const json = await response.json();
    console.log('login response', json);
    console.log(response)

    document.location.href = 'https://www.google.com/';
  })
}

mainPage(logIn, mainLink)

const userChecker = () => {

}*/
logIn.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = loginId;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  console.log(data)


  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    alert(json.message);
    console.log("ei toimi")
  } else {
    // save token
    sessionStorage.setItem('token', json.token);
    // show/hide forms + cats
    console.log("toimii")
  }
});
