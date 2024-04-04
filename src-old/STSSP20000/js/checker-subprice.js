let counter = 0;
let totalPrice = 0;
const addButton = document.getElementById("add-button");
const detailInput = document.getElementById("detail-input");
const priceInput = document.getElementById("price-input");
const itemList = document.getElementById("item-list");
const totalPriceSpan = document.getElementById("total-price");
const priceStatusSpan = document.getElementById("price-status");

function toggleInput(show) {
  var subField = document.getElementById("sub-field");
  if (show) {
    subField.style.display = "block";
  } else {
    subField.style.display = "none";
  }
}

function setOriginalTotalPrice() {
  let total = 0;
  document.querySelectorAll("input[name='sub_price[]']").forEach((input) => {
    total += Number(input.value);
  });
  totalPrice = total;
  totalPriceSpan.textContent = totalPrice.toFixed(2);
}