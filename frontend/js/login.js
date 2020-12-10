const login = document.getElementById('login-form');
const signIn = document.getElementById('add-user-form');
const url = window.url;

// Form for logging in, which is sent to database
login.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(login);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login/', fetchOptions);
  console.log(response);
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    alert(json.message);
  } else {
    // save token to cookie
    set_cookie('token', json.token);
    document.location.href = '../html/main.html';
  }
});

//sign in = create new account
signIn.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(signIn);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const RegResponse = await fetch(url + '/auth/register/', fetchOptions);
  console.log(RegResponse);
  const json = await RegResponse.json();
  console.log('sign-in response', json);
  if (json.token === undefined){
    window.alert("Account with this e-mail already exists")
  }
  else {
    set_cookie("token", json.token)
    document.location.href = '../html/main.html'
    window.alert("Account successfully created")
  }

});

// Function for setting a cookie by name and value
const set_cookie = (name, value) => {
  document.cookie = name + '=' + value + '; Path=/;';
};