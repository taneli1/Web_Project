const buttonText = document.getElementById("buyOrSell")
const buttonState = document.querySelector('input[id="buyOrSellButton"]')
const createNewAd = document.getElementById("createNewAd")
const url = 'http://localhost:3000'


buttonState.addEventListener('change', function() {
  if (this.checked) {
    buttonText.innerText = "Buy"
  } else {
    buttonText.innerText = "Sell"
  }
});

createNewAd.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const token = getCookie("token")
  const fd = new FormData(createNewAd);
  console.log(fd)
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
    body: fd,
  };
  console.log("fetch options" + fetchOptions.body)
  const response = await fetch(url + '/ad/', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}