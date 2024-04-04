let counter = 0;
let totalPrice = 0;
let EditTotalPrice = 0;
const addButton = document.getElementById("add-button");
const detailInput = document.getElementById("detail-input");
const priceInput = document.getElementById("price-input");
const itemList = document.getElementById("item-list");
const totalPriceSpan = document.getElementById("total-price");
const priceStatusSpan = document.getElementById("price-status");
const edittotalPriceSpan = document.getElementById("editTotal-price");
const editpriceStatusSpan = document.getElementById("editPrice-status");
const auction = document.getElementById("auction");
const editAuction = document.getElementById("edit_auction");


var validateDecimal = function (e) {
  var t = e.value;
  var regex = /^-?\d*\.?\d{0,2}$/; // regular expression to validate decimal number
  if (!regex.test(t)) {
    // if the input does not match the regular expression
    e.value = t.slice(0, -1); // remove the last character from the input
  }
};

function toggleInput(show) {
  var subField = document.getElementById("sub-field");
  if (show) {
    subField.style.display = "block";
  } else {
    subField.style.display = "none";
  }
}

editAuction.addEventListener("input", function() {
  updateEditTotalPrice();
});

function setOriginalTotalPrice() {
  let total = 0;
  document.querySelectorAll("input[name='sub_price[]']").forEach((input) => {
    total += Number(input.value);
  });
  totalPrice = total;
  totalPriceSpan.textContent = totalPrice.toFixed(2);
}

function updateEditTotalPrice() {
  let editTotal = 0;
  document.querySelectorAll("input[name='editsub_price[]']").forEach((input) => {
    editTotal += Number(input.value);
  });

  EditTotalPrice = editTotal;
  edittotalPriceSpan.textContent = EditTotalPrice.toFixed(2);
    if (EditTotalPrice == parseFloat(editAuction.value)) {
      editpriceStatusSpan.textContent = "(ราคารวมตรงกับราคากลางสุทธิแก้ไข)";
      editpriceStatusSpan.style.color = "green";
      return;
    } else {
      editpriceStatusSpan.textContent = "(ราคารวมไม่ตรงกับราคากลางสุทธิแก้ไข)";
      editpriceStatusSpan.style.color = "red";
      return;
    }
}

document.addEventListener("input", function(event) {
  const target = event.target;
  if (
    target.tagName === "INPUT" && 
    target.getAttribute("name") === "editsub_price[]"
    ) {
      if (editAuction.value !== null && editAuction.value.trim() !== '') {
        editpriceStatusSpan.textContent = "";
        updateEditTotalPrice();
      } else {
        editpriceStatusSpan.textContent = "โปรดกรอก ราคากลางสุทธิ(ขอแก้ไข)";
        editpriceStatusSpan.style.color = "red";
      }
  }
});

