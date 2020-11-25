const login = document.getElementById('login-form')
const mainMenu = document.getElementById('Main')
const url = 'http://localhost:3000'

// login
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
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    alert(json.message);
  } else {
    // save token to cookie
    set_cookie("token", json.token)
    document.location.href = '../html/main.html'
  }
});

function set_cookie(name, value) {
  document.cookie = name +'='+ value +'; Path=/;';
}