"use strict";

const cartBtn = <HTMLButtonElement>document.getElementById("cartBtn");
const closeCartBtn = <HTMLButtonElement>document.getElementById("closeCartBtn");
const clearCartBtn = <HTMLButtonElement>document.getElementById("clearCartBtn");
const cartDOM = <HTMLDivElement>document.getElementById("cart");
const cartOverlay = <HTMLDivElement>document.getElementById("cartOverlay");

const cartItems = <HTMLSpanElement>document.getElementById("cartItems");
const cartTotal = <HTMLSpanElement>document.getElementById("cartTotal");
const cartContent = <HTMLDivElement>document.getElementById("cartContent");
const productsDOM = <HTMLDivElement>document.getElementById("productCenter");

interface Item {
  id?: number;
  title?: string;
  price?: number;
  amount?: number;
  image?: string;
}

let shoppingCart: Array<Item> = [];
let addToCartBtn: Array<object> = [];
// Getting products TODO: avoid casting to any
class Products {
  async getProducts() {
    try {
      let result = await fetch("./mockDB/products.json");
      let resultJSON = await result.json();
      return resultJSON.items.map((item: any) => {
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

  populateShoppingCart(shoppingCart: Array<Item>) {
    shoppingCart.forEach((item) => this.addCartItem(item));
  }

  displayProducts(products: Array<Item>) {
    products.map((product: Item) => {
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

    imgButtons.forEach((btn: any) => {
      let id = btn.dataset.id;
      // checks if clicked product is in shopping cart
      let inShoppingCart = shoppingCart.find((item: Item) => item.id === id);
      if (inShoppingCart) {
        btn.innerText = `In cart`;
        btn.disabled = true;
        // TODO: open cart if clicked
      }
      btn.addEventListener("click", (e: any) => {
        e.target.innerText = "in Cart";
        e.target.disabled = true;
        // get product from prod storage
        let shoppingCartItem = { ...LocalStorage.getProduct(id), amount: 1 };
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

  setShoopingCartValues(shoppingCart: Array<Item>) {
    let valueTotal: number = 0;
    let itemsTotal: number = 0;

    shoppingCart.map((item: Item) => {
      valueTotal += item.price! * item.amount!;
      itemsTotal += item.amount!;
    });
    cartTotal.innerText = valueTotal.toFixed(2);
    cartItems.innerText = itemsTotal.toString();
  }

  addCartItem(item: Item) {
    const div = <HTMLDivElement>document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div>
        <h4>${item.title}</h4>
        <h4<${item.price}</h4>
        <span class="remove-item" data-id=${item.id}>remove item</span>
      </div>
      <div>
      <button class="add-amount">
        <i class="fas fa-chevron-up" data-id${item.id}></i>
      </button>
      <p class="item-amount">${item.amount}</p>
      <button class="subtract-amount">  
        <i class="fas fa-chevron-down" data-id"${item.id}></i>
      </button>
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
    cartItems.forEach((id: any) => this.removeItem(id));
  }

  removeItem(id: Item) {
    shoppingCart = shoppingCart.filter((item) => item.id !== id);
    this.setShoopingCartValues(shoppingCart);
    LocalStorage.setShoppingCart(shoppingCart);
    let addBtn: any = this.getAddToCartBtn(id);
    addBtn.innerHTML = false;
    addBtn.innerHTML = `<i class="fas fa-shopping-cart" aria-hidden="true"></i>Add to cart`;
  }

  getAddToCartBtn(id: any) {
    return addToCartBtn.find((btn: any) => btn.dataset.id === id);
  }
  cartLogic() {
    // get clear Cart shoppingBtn remove all items
    clearCartBtn.addEventListener("click", () => this.clearShoppingCart());

    cartContent.addEventListener("click", (e: any) => {
      let target = e.target.classList.contains("add-amount");
      console.log(target);
      // switch (key) {
      //   case "add-amount":

      //     break;
      //     case "subtract-amount":

      //       break;
      //     case "remove":

      //       break;

      //   default:
      //     break;
      // }
      //check classlist maybe by using switch
      console.log(e.target);
    });
  }
}

// Local Storage
class LocalStorage {
  static saveProducts(products: object) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id: string) {
    let products: object[] = JSON.parse(
      localStorage.getItem("products") || "{}"
    );
    return products.find((product: any) => product.id === id);
  }
  static setShoppingCart(shoppingCartItem: object) {
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
