const createNewAd = document.getElementById("createNewAd")
const adTypeHiddenField = document.getElementById("adType");
const url = 'http://localhost:3000'


const adTypeSwitch = () => {
  const value = document.querySelector('input[name="ad_typeSelector"]:checked').value
  console.log(value)
  if (value === "buy"){
    adTypeHiddenField.value = "buy"
  }
  else {
    adTypeHiddenField.value = "sell"
  }
}

createNewAd.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  adTypeSwitch()
  const token = getCookie("token")
  const fd2 = new FormData(createNewAd)
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
    body: fd2,
  };
  console.log(fetchOptions.body)
  const response = await fetch(url + '/ad/sell', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
 // document.location.href = '../html/main.html'
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}