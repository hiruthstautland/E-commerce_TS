const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const cartDOM = document.getElementById("cart");
const cartOverlay = document.getElementById("cartOverlay");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartContent = document.getElementById("cartContent");
const productsDOM = <HTMLElement>document.getElementById("productCenter");

let shoppingCart: object[] = [];
let imgBtnsDOM: object[] = [];
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
  setProducts() {}
}
// Displaying Products  - TODO: avoid casting to any
class UserInterface {
  displayProducts(products: Array<object>) {
    products.map((product: any) => {
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

  getBagBtn() {
    const imgButtons = [...document.querySelectorAll(".img-btn")];
    imgBtnsDOM = imgButtons;
    imgButtons.forEach((btn: any) => {
      let id = btn.dataset.id;
      // checks if clicked product is in shopping cart
      let inShoppingCart = shoppingCart.find((item: any) => item.id === id);
      if (inShoppingCart) {
        btn.innerText = `${id} is in cart`;
        btn.disabled = true;
        // TODO: open cart if clicked
      }
      btn.addEventListener("click", (e: any) => {
        e.target.innerText = "in Cart";
        e.target.disabled = true;
        // get product from prod storage
        let shoppingCartItem = { ...LocalStorage.getProduct(id), amount: 1 };
        // add product to shopping cart and to cart storage
        shoppingCart.push(shoppingCartItem)
        // shoppingCart = [...shoppingCart, shoppingCartItem];
        // set cart obj
        console.log(shoppingCart);
        LocalStorage.setShoppingCart();
        // display cart item
        // show the cart
      });
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
  static setShoppingCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }
}

// Listner, create instances once DOM Content is Loaded
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UserInterface();
  const products = new Products();

  // Products
  products
    .getProducts()
    .then((data) => {
      ui.displayProducts(data);
      LocalStorage.saveProducts(data);
    })
    .then(() => {
      ui.getBagBtn();
    });
});
