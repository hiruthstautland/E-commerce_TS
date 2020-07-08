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
    shoppingCart = LocalStorage.getShoppingCart();
    this.setShoopingCartValues(shoppingCart);
    this.populateShoppingCart(shoppingCart);
    // combine hide and show functions so one can toggle
    closeCartBtn.addEventListener("click", UserInterface.hideShoppingCart);
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
        let shoppingCartItem: Item = {
          ...LocalStorage.getProduct(id),
          amount: 1,
        };
        // add product to shopping cart and to cart storage
        shoppingCart = [...shoppingCart, shoppingCartItem];
        LocalStorage.saveShoppingCart(shoppingCart);
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
        <h4>${item.price}</h4>
        <button class="app-btn remove-item remove transparentBtn" data-id="${item.id}">
          <i class="fa fa-times-circle" aria-hidden="true"></i>
        </button>
      </div>
      <div class="item-amount-container">
        <button class="app-btn transparentBtn amount-up">
          <i class="fas fa-chevron-up" data-id="${item.id}"></i>
        </button>
        <strong class="item-amount">${item.amount}</strong>
        <button class="app-btn transparentBtn amount-down">
          <i class="fas fa-chevron-down" data-id="${item.id}"></i>
        </button>
      </div>`;
    cartContent.appendChild(div);
  }

  showShoppingCart() {
    cartOverlay.classList.add("transparentBg");
    cartDOM.classList.add("showCart");
    cartOverlay.addEventListener("click", (e: any) => {
      if (e.target.classList.contains("cart-overlay")) {
        UserInterface.hideShoppingCart();
      }
    });
  }

  static hideShoppingCart() {
    cartOverlay.classList.remove("transparentBg");
    cartDOM.classList.remove("showCart");
    cartOverlay.removeEventListener("click", (e: any) => {
      UserInterface.hideShoppingCart();
    });
  }

  clearShoppingCart() {
    UserInterface.hideShoppingCart();
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
    LocalStorage.saveShoppingCart(shoppingCart);
    let addBtn: any = this.getAddToCartBtn(id);
    addBtn.innerHTML = false;
    addBtn.innerHTML = `<i class="fas fa-shopping-cart" aria-hidden="true"></i>Add to cart`;
  }

  getAddToCartBtn(id: any) {
    return addToCartBtn.find((btn: any) => btn.dataset.id === id);
  }
  cartLogic() {
    clearCartBtn.addEventListener("click", () => this.clearShoppingCart());
    cartContent.addEventListener("click", (e: any) => {
      let targetElem = e.target;
      let targetClass = [...targetElem.parentElement.classList];
      let id = targetElem.parentElement.dataset.id;
      let item = shoppingCart.find((item) => item.id === id);
      let itemAmount = <HTMLElement>(
        targetElem.parentElement.parentElement.children[1]
      );
      targetClass.map((value: any) => {
        switch (value) {
          case "amount-up":
            if (item?.amount === undefined || item?.amount === null) {
              return;
            } else {
              item.amount += 1;
            }
            itemAmount.innerHTML = `${item?.amount}`;
            break;
          case "amount-down":
            if (
              item?.amount === undefined ||
              item?.amount === null ||
              item?.amount <= 1
            ) {
              return;
            } else {
              item.amount -= 1;
            }
            itemAmount.innerHTML = `${item?.amount}`;
            break;
          case "remove":
            console.log(id);
            this.removeItem(id);
            cartContent.removeChild(
              targetElem.parentElement.parentElement.parentElement
            );
            break;
          default:
            break;
        }
      });

      LocalStorage.saveShoppingCart(shoppingCart);
      this.setShoopingCartValues(shoppingCart);
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
  static saveShoppingCart(shoppingCartItem: object) {
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
