let counter = 0;
let totalPrice = 0;
const addButton = document.getElementById("add-button");
const detailInput = document.getElementById("detail-input");
const priceInput = document.getElementById("price-input");
const itemList = document.getElementById("item-list");
const totalPriceSpan = document.getElementById("total-price");
const priceStatusSpan = document.getElementById("price-status");
const auction = document.getElementById("auction");

addButton.addEventListener("click", function() {
  const detail = detailInput.value.trim();
  const price = priceInput.value.trim();

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
  <div class="formbold-input-flex">
    <span class="item-number">${counter}.</span>
    <input  class="in" style = "width: 350px; " type="text" name="sub_detail[]" value="${detail}" placeholder="(รายละเอียดงาน)" contenteditable>
    <input  class="in" style = "width: 350px; " type="text" name="sub_price[]" value="${price}" oninput="validateDecimal(this)" step="0.01" maxlength="12" placeholder="(ราคากลางย่อย)" contenteditable>
    <button type="button" class="debt delete-button">Delete</button>
  </div>
  `;
  itemList.appendChild(itemDiv);
  detailInput.value = "";
  priceInput.value = "";
  updateTotalPrice();
});

auction.addEventListener("input", function() {
  updateTotalPrice();
});

itemList.addEventListener("click", function(event) {
  const target = event.target;
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

function updateTotalPrice() {
  let total = 0;
  document.querySelectorAll("input[name='sub_price[]']").forEach((input) => {
    total += Number(input.value);
  });
  totalPrice = total;
  totalPriceSpan.textContent = totalPrice.toFixed(2);
  if (totalPrice == parseFloat(auction.value)) {
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