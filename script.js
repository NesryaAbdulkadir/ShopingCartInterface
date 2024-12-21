const cartItems = document.querySelector("#cart-items");
const cartOverview = document.querySelector("#cart-overview");

let loading = false;

const fetchItems = async () => {
  loading = true;

  const res = await fetch("https://dummyjson.com/carts/4");
  const data = await res.json();

  loading = false;
  return data;
};
const getItem = async () => {
  loading = true;
  const items = await fetchItems();
  const products = items.products;
  products.forEach((product) => {
    const item = document.createElement("div");
    item.classList.add("item");
    const percentageCalc = Math.ceil(
      product.price / product.discountPercentage
    );
    shopingCartOverview(products);
    item.innerHTML = `
    <div class="item-image">
    <img src="${product.thumbnail}" alt="${product.title}" class="productImg" />
        </div>
        <div class="item-details">
        <h3 class="item-title">${product.title}</h3>
        <p class="productPrice"><s>$${
          product.price
        }</s> ${" "}$${percentageCalc}</p>
    <div>
    <button class="btn" id="add">+</button>
    <button class="btn" id="subtract">-</button>
    </div>
    </div>
    `;
    cartItems.appendChild(item);
    loading = false;
  });
};
if (loading === true) {
  cartItems.innerHTML = `<h1 class="loading" >Loading...</h1>`;
}

const shopingCartOverview = (products) => {
  loading = true;
  const totalPrice = document.getElementById("totalPrice");
  const totalPriceCalc = products.reduce((acc, curr) => {
    const percentageCalc = curr.price / curr.discountPercentage;
    return acc + percentageCalc;
  }, 0);

  totalPrice.innerText = `$${totalPriceCalc.toFixed(2)}`;
  loading = false;
};

getItem();
