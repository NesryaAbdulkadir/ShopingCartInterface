document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.getElementById("cart-items");
  const clearCart = document.getElementById("clear-cart");

  let loading = false;
  let data = JSON.parse(localStorage.getItem("cart")) || { products: [] };

  const saveToLocalStorage = (data) => {
    localStorage.setItem("cart", JSON.stringify(data));
  };

  const fetchItems = async () => {
    loading = true;

    const res = await fetch("https://dummyjson.com/carts/4");
    data = await res.json();

    loading = false;
    return data;
  };

  const getItem = async () => {
    loading = true;

    // Ensure we are fetching fresh data if needed
    await fetchItems();

    // Populate cart items from local storage
    data.products.forEach((product) => {
      if (product.quantity === 0) {
        return;
      }
      const item = document.createElement("div");
      item.classList.add("item");
      const percentageCalc = Math.ceil(
        product.price / product.discountPercentage
      );
      shopingCartOverview(data.products);
      item.innerHTML = `
        <div class="item-image">
          <img src="${product.thumbnail}" alt="${
        product.title
      }" class="productImg" />
        </div>
        <div class="item-details">
          <span class="item-quantity">${product.quantity}</span>
          <h3 class="item-title">${product.title}</h3>
          <p class="productPrice">$${(
            percentageCalc * product.quantity
          ).toFixed(2)}</p>
          <div>
            <button class="btn add" data-id="${product.id}">+</button>
            <button class="btn subtract" data-id="${product.id}">-</button>
          </div>
        </div>
      `;
      cartItems.appendChild(item);
    });

    loading = false;
  };

  const shopingCartOverview = (products) => {
    const totalPrice = document.getElementById("totalPrice");
    const totalPriceCalc = products.reduce((acc, curr) => {
      const percentageCalc =
        (curr.price / curr.discountPercentage) * curr.quantity;
      return acc + percentageCalc;
    }, 0);

    totalPrice.innerText = `$${totalPriceCalc.toFixed(2)}`;
  };

  cartItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("add")) {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    } else if (e.target.classList.contains("subtract")) {
      const id = parseInt(e.target.dataset.id);
      subtractFromCart(id);
    }
  });

  const addToCart = (id) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || { products: [] };

    let product = cart.products.find((product) => product.id === id);

    if (product) {
      product.quantity += 1;
    }
    saveToLocalStorage(cart);
    updateCart(id, cart);
  };

  const subtractFromCart = (id) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || { products: [] };

    let product = cart.products.find((product) => product.id === id);

    if (product) {
      product.quantity -= 1;
      if (product.quantity === 0) {
        cart.products = cart.products.filter((item) => item.id !== id);
      }
    } else {
      console.log(`Product with ID ${id} not found`);
    }
    saveToLocalStorage(cart);
    updateCart(id, cart);
  };

  const updateCart = (id, cart) => {
    const item = cartItems.querySelector(`[data-id="${id}"]`).closest(".item");
    const product = cart.products.find((product) => product.id === id);
    const priceElement = item.querySelector(".productPrice");
    const productQuantity = item.querySelector(".item-quantity");

    if (product.quantity === 0) {
      item.remove();
      return;
    }

    const percentageCalc = (product.price / product.discountPercentage).toFixed(
      2
    );
    priceElement.innerText = `$${(percentageCalc * product.quantity).toFixed(
      2
    )}`;
    productQuantity.innerText = product.quantity;
    shopingCartOverview(cart.products);
  };

  // Define handleClearCart before adding the event listener
  const handleClearCart = () => {
    cartItems.innerHTML = "";
    localStorage.clear();
  };

  clearCart.addEventListener("click", handleClearCart);

  getItem(); // Initialize cart items
});
