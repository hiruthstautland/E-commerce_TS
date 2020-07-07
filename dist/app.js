"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const cartDOM = document.getElementById("cart");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartContent = document.getElementById("cartContent");
const productsDOM = document.getElementById("productCenter");
let shoppingCart = [];
let addToCartBtn = [];
// Getting products TODO: avoid casting to any
class Products {
  getProducts() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let result = yield fetch("./mockDB/products.json");
        let resultJSON = yield result.json();
        return resultJSON.items.map((item) => {
          return {
            id: item.sys.id,
            title: item.fields.title,
            price: item.fields.price,
            image: item.fields.image.fields.file.url,
          };
        });
      } catch (err) {
        console.log(err);
      }
    });
  }
}
// Displaying Products  - TODO: avoid casting to any
class UserInterface {
  runApplication() {
    shoppingCart = [LocalStorage.getShoppingCart()];
    this.setShoopingCartValues(shoppingCart);
    this.populateShoppingCart(shoppingCart);
    // combine hide and show functions so one can toggle
    closeCartBtn.addEventListener("click", this.hideShoppingCart);
    cartBtn.addEventListener("click", this.showShoppingCart);
  }
  populateShoppingCart(shoppingCart) {
    shoppingCart.forEach((item) => this.addCartItem(item));
  }
  displayProducts(products) {
    products.map((product) => {
      productsDOM.insertAdjacentHTML(
        "beforeend",
        `<article class="product" id=${product.id}>
        <div class="img-container">
            <img src=${product.image} alt=${product.title} class="product-img" />
            <button class="img-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                Add to cart
            </button>
        </div>
        <h3>${product.title}</h3>
        <h4>${product.price}</h4>
    </article>`
      );
    });
  }
  getImgBtn() {
    const imgButtons = [...document.querySelectorAll(".img-btn")];
    addToCartBtn = imgButtons;
    imgButtons.forEach((btn) => {
      let id = btn.dataset.id;
      // checks if clicked product is in shopping cart
      let inShoppingCart = shoppingCart.find((item) => item.id === id);
      if (inShoppingCart) {
        btn.innerText = `In cart`;
        btn.disabled = true;
        // TODO: open cart if clicked
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = "in Cart";
        e.target.disabled = true;
        // get product from prod storage
        let shoppingCartItem = Object.assign(
          Object.assign({}, LocalStorage.getProduct(id)),
          { amount: 1 }
        );
        // add product to shopping cart and to cart storage
        shoppingCart.push(shoppingCartItem);
        // shoppingCart = [...shoppingCart, shoppingCartItem];
        LocalStorage.setShoppingCart(shoppingCartItem);
        // set cart values
        this.setShoopingCartValues(shoppingCart);
        // display cart items
        this.addCartItem(shoppingCartItem);
        // show the cart
        this.showShoppingCart();
      });
    });
  }
  setShoopingCartValues(shoppingCart) {
    let valueTotal = 0;
    let itemsTotal = 0;
    shoppingCart.map((item) => {
      valueTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = valueTotal.toFixed(2);
    cartItems.innerText = itemsTotal.toString();
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div>
        <h4>${item.title}</h4>
        <h4<${item.price}</h4>
        <span class="remove-item" data-id=${item.id}>remove item</span>
      </div>
      <div>
      <i class="fas fa-chevron-up plus-amount" data-id${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down minus-amount" data-id"${item.id}></i>
      </div>`;
    cartContent.appendChild(div);
  }
  showShoppingCart() {
    cartOverlay.classList.add("transparentBg");
    cartDOM.classList.add("showCart");
  }
  hideShoppingCart() {
    cartOverlay.classList.remove("transparentBg");
    cartDOM.classList.remove("showCart");
  }
  clearShoppingCart() {
    this.hideShoppingCart();
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    //combine
    let cartItems = shoppingCart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
  }
  removeItem(id) {
    shoppingCart = shoppingCart.filter((item) => item.id !== id);
    this.setShoopingCartValues(shoppingCart);
    LocalStorage.setShoppingCart(shoppingCart);
    let addBtn = this.getAddToCartBtn(id);
    addBtn.innerHTML = false;
    addBtn.innerHTML = `<i class="fas fa-shopping-cart" aria-hidden="true"></i>Add to cart`;
  }
  getAddToCartBtn(id) {
    return addToCartBtn.find((btn) => btn.dataset.id === id);
  }
  cartLogic() {
    // get clear Cart shoppingBtn remove all items
    clearCartBtn.addEventListener("click", () => this.clearShoppingCart());
    cartContent.addEventListener("click", (e) => {
      let add = e.target.classList.contains("plus-amount");
      let subtract = e.target.classList.contains("minus-amount");
      let remove = e.target.classList.contains("remove-item");
      //check classlist maybe by using switch
      let classTarget = [...e.target.classList];
      //   classTarget.map(class => {
      //       switch (key) {
      //         case "add-amount":
      //           break;
      //         case "subtract-amount":
      //           break;
      //         case "remove":
      //           break;
      //         default:
      //           break;
      //       }

      //   })

      console.log(classTarget);
    });
  }
}
// Local Storage
class LocalStorage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products") || "{}");
    return products.find((product) => product.id === id);
  }
  static setShoppingCart(shoppingCartItem) {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCartItem));
  }
  static getShoppingCart() {
    return localStorage.getItem("shoppingCart")
      ? JSON.parse(localStorage.getItem("shoppingCart") || "{}")
      : [];
  }
}
// Listner, create instances once DOM Content is Loaded
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UserInterface();
  const products = new Products();
  // Run App
  ui.runApplication();
  // Products
  products
    .getProducts()
    .then((data) => {
      ui.displayProducts(data);
      LocalStorage.saveProducts(data);
    })
    .then(() => {
      ui.getImgBtn();
      ui.cartLogic();
    });
});
