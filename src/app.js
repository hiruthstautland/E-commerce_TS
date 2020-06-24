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

// Getting products
class Products {
  async getProducts() {
    try {
      let result = await fetch("./mockDB/products.json");
      let resultJSON = await result.json();
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
  }
}

// Displaying Products
class UserInterface {
  displayProducts(products) {
    products.map((product) => {
      productsDOM.insertAdjacentHTML(
        "beforeend",
        `<article class="product" id=${product.id}>
        <div class="img-container">
            <img src=${product.image} alt=${products.title} class="product-img" />
            <button class="bag-btn" data-id=${product.id}>
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
}

// Local Storage
class LocalStorage {}

// Listner, create instances once DOM Content is Loaded
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UserInterface();
  const products = new Products();

  // Products
  products.getProducts().then((data) => ui.displayProducts(data));
});
