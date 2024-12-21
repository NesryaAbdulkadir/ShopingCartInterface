document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.getElementById("cart-items");
  const clearCart = document.getElementById("clear-cart");
  const checkout = document.getElementById("checkout");

  let loading = false;

  const saveToLocalStorage = (data) => {
    localStorage.setItem("cart", JSON.stringify(data));
  };

  const fetchItems = async () => {
    loading = true;
    const res = await fetch("https://dummyjson.com/carts/4");
    const data = await res.json();
    loading = false;
    return data.products;
  };

  const getItem = async () => {
    loading = true;

    let cart = JSON.parse(localStorage.getItem("cart")) || { products: [] };
    if (cart.products.length === 0) {
      const noItemMessage = document.createElement("div");
      noItemMessage.innerText = "No Items in Cart";
      noItemMessage.classList.add("noItem");
      cartItems.appendChild(noItemMessage);
      checkout.disabled = true;
      clearCart.disabled = true;

      loading = false;
      return;
    }

    cart.products.forEach((product) => {
      if (product.quantity === 0) {
        return;
      }

      const item = document.createElement("div");
      item.classList.add("item");
      const percentageCalc = (
        product.price / product.discountPercentage
      ).toFixed(2);
      item.innerHTML = `
        <div class="item-image">
          <img src="${product.thumbnail}" alt="${
        product.title
      }" class="productImg" />
        </div>
        <div class="item-details">
          <h3 class="item-title">${product.title}</h3>
          <p class="productPrice">$${(
            percentageCalc * product.quantity
          ).toFixed(2)}</p>
          <div>
          <button class="btn add" data-id="${product.id}">+</button>
          <span class="item-quantity">${product.quantity}</span>
          <button class="btn subtract" data-id="${product.id}">-</button>
          </div>
          </div>
          `;
      cartItems.appendChild(item);
    });

    shopingCartOverview(cart.products);
    loading = false;
  };

  const shopingCartOverview = (products) => {
    const totalPrice = document.getElementById("totalPrice");
    const totalPriceCalc = products?.reduce((acc, curr) => {
      const percentageCalc =
        (curr.price / curr.discountPercentage) * curr.quantity;
      return acc + percentageCalc;
    }, 0);

    totalPrice.innerText = `$${totalPriceCalc?.toFixed(2)}`;
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
    } else {
      console.log(`Product with ID ${id} not found`);
    }
    saveToLocalStorage(cart);
    updateCart(id, cart.products);
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
    updateCart(id, cart.products);
  };

  const updateCart = (id, products) => {
    const item = cartItems.querySelector(`[data-id="${id}"]`).closest(".item");
    const product = products.find((product) => product.id === id);
    const priceElement = item.querySelector(".productPrice");
    const productQuantity = item.querySelector(".item-quantity");

    if (product?.quantity === 0) {
      item.remove();
      return;
    }

    productQuantity.innerText = product?.quantity;
    const percentageCalc = (product.price / product.discountPercentage).toFixed(
      2
    );
    priceElement.innerText = `$${(percentageCalc * product.quantity).toFixed(
      2
    )}`;
    shopingCartOverview(products);
  };

  const handleClearCart = () => {
    cartItems.innerHTML = "";
    localStorage.clear();
  };

  clearCart.addEventListener("click", handleClearCart);

  getItem();
});
