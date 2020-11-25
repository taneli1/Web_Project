const buttonText = document.getElementById("buyOrSell")
const buttonState = document.querySelector('input[id="buyOrSellButton"]')


buttonState.addEventListener('change', function() {
  if (this.checked) {
    buttonText.innerText = "Buy"
  } else {
    buttonText.innerText = "Sell"
  }
});