let counter = 0;
let totalPrice = 0;
const addButton = document.getElementById("add-button");
const detailInput = document.getElementById("detail-input");
const priceInput = document.getElementById("price-input");
const itemList = document.getElementById("item-list");
const totalPriceSpan = document.getElementById("total-price");
const priceStatusSpan = document.getElementById("price-status");
const auction = document.getElementById("auction-budget");


function updateTextView(obj) {
  var num = getNumber(obj.value);
  if (num === 0) {
      obj.value = "";
  } else {
      obj.value = num.toLocaleString();
  }
}

function getNumber(str) {
  var arr = str.split("");
  var out = [];
  for (var cnt = 0; cnt < arr.length; cnt++) {
      if (!isNaN(arr[cnt])) {
          out.push(arr[cnt]);
      }
  }
  return Number(out.join(""));
}


// $("#testing").click(() => {
//   console.log("try");
// })

// var validateDecimal = function (e) {
//   var t = e.value;
//   var regex = /^-?\d*\.?\d{0,2}$/; // regular expression to validate decimal number
//   if (!regex.test(t)) {
//     // if the input does not match the regular expression
//     e.value = t.slice(0, -1); // remove the last character from the input
//   }
// };

function toggleInput(show) {
  var subField = document.getElementById("sub-field");
  if (show) {
    subField.style.display = "block";
  } else {
    subField.style.display = "none";
  }
}

addButton.addEventListener("click", function() {
  const detail = detailInput.value.trim();
  const price = priceInput.value.trim();

  console.log(detail);

  if (!auction.value) {
    errorAuctionPrice.textContent = "โปรดกรอกราคากลางสุทธิ";
    return;
  }
  errorAuctionPrice.textContent = "";

  if (!detail || !price) {
    errorSubPrice.textContent ="โปรดกรอกรายละเอียดและราคากลางย่อย";
    return;
  }
  errorSubPrice.textContent = "";


 
  const itemDiv = document.createElement("div");
  counter++;
  itemDiv.innerHTML = `
  <div id=input-subprice-${counter} class="formbold-input-flex" style="margin:0;">
    <span class="item-number" style="padding-left: 80px; width:50px;" >${counter}.</span>
    <input align="center" class="in" style = "width: 350px; text-align: center;" type="text" name="sub_detail[]" value="${detail}" placeholder="(รายละเอียดงาน)" contenteditable>
    <input class="in" style = "width: 350px; text-align: center;" type="text"  name="sub_price[]" value="${price}" step="0.01" maxlength="12" placeholder="(ราคากลางย่อย)" contenteditable>
    <button type="button" class="debt delete-button">Delete</button>
  </div>
  `;
  itemList.appendChild(itemDiv);
  detailInput.value = "";
  priceInput.value = "";

  document.querySelectorAll("input[name='sub_price[]']").forEach((input) => {
    input.addEventListener("keyup", function () {
        updateTextView(this);
    });
});
  updateTotalPrice();
});

auction.addEventListener("input", function() {
  updateTotalPrice();
});

itemList.addEventListener("click", function(event) {
  const target = event.target;
  console.log(target.parentNode);
  if (target.classList.contains("delete-button")) {
    target.parentNode.remove();
    counter = 0;
    document.querySelectorAll(".item-number").forEach((span) => {
      counter++;
      span.textContent = counter + ".";
    });
    updateTotalPrice();
  }
});

function convertCommaToNonComma(priceWithComma){
  let a = priceWithComma.split(',');
  let price = a.join("");
  return parseFloat(price)
}

function updateTotalPrice() {
  let total = 0;
  document.querySelectorAll("input[name='sub_price[]']").forEach((input) => {
    let value = convertCommaToNonComma(input.value);
    if(!(value)){
      value = 0;
    }
    total += Number(value);
  });
  totalPrice = total;
  totalPriceSpan.textContent = Number(totalPrice.toFixed(2)).toLocaleString();

  let auctionValue = convertCommaToNonComma(auction.value);
  // console.log(auctionValue)
  if (totalPrice == parseFloat(auctionValue)) {
    priceStatusSpan.textContent = "(ราคารวมตรงกับราคากลางสุทธิ)";
    priceStatusSpan.style.color = "green";
    return;
  } else {
    priceStatusSpan.textContent = "(ราคารวมไม่ตรงกับราคากลางสุทธิ)";
    priceStatusSpan.style.color = "red";
    return;
  }
}

document.addEventListener("input", function(event) {
  const target = event.target;
  if (target.tagName === "INPUT" && target.getAttribute("name") === "sub_price[]") {
    updateTotalPrice();
  }
});