
const url = 'http://10.114.32.43'

const createNewAd = document.getElementById("createNewAd")
const adTypeHiddenField = document.getElementById("adType");
const category = document.getElementById("category");




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

const putCategoriesToForm = async () => {
  const fetchOptions = {
    method: 'GET',
  };
  const response = await fetch(url + '/ad/category/get', fetchOptions);
  const categories = await response.json();
  for (let i = 0; i < categories.length; i++){
    let option = document.createElement("option")
    option.value = categories[i].ctg_id
    option.text = categories[i].category
    category.appendChild(option)
  }
}

putCategoriesToForm()




// Event listener for the form of creating new ad
createNewAd.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  adTypeSwitch();
  const token = getCookie("token")
  try {
    const fd2 = new FormData(createNewAd)
    console.log("here is the stuff", createNewAd)
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: fd2,
    };
    console.log(fetchOptions.body)
    await fetch(url + '/ad/', fetchOptions);
    document.location.href = '../html/main.html'
    window.alert("CREATEd")
  }
  catch (e) {
    console.log(e)
    document.location.href = '../html/main.html'
  }

});

// get value of the cookie by it's name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}