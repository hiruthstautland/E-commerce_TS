"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var cartBtn = document.getElementById("cartBtn");
var closeCartBtn = document.getElementById("closeCartBtn");
var clearCartBtn = document.getElementById("clearCartBtn");
var cartDOM = document.getElementById("cart");
var cartOverlay = document.getElementById("cartOverlay");
var cartItems = document.getElementById("cartItems");
var cartTotal = document.getElementById("cartTotal");
var cartContent = document.getElementById("cartContent");
var productsDOM = document.getElementById("productCenter");
var shoppingCart = [];
// Getting products TODO: avoid casting to any
var Products = /** @class */ (function () {
    function Products() {
    }
    Products.prototype.getProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, resultJSON, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("./mockDB/products.json")];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        resultJSON = _a.sent();
                        return [2 /*return*/, resultJSON.items.map(function (item) {
                                return {
                                    id: item.sys.id,
                                    title: item.fields.title,
                                    price: item.fields.price,
                                    image: item.fields.image.fields.file.url,
                                };
                            })];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Products;
}());
// Displaying Products  - TODO: avoid casting to any
var UserInterface = /** @class */ (function () {
    function UserInterface() {
    }
    UserInterface.prototype.displayProducts = function (products) {
        products.map(function (product) {
            productsDOM.insertAdjacentHTML("beforeend", "<article class=\"product\" id=" + product.id + ">\n        <div class=\"img-container\">\n            <img src=" + product.image + " alt=" + product.title + " class=\"product-img\" />\n            <button class=\"bag-btn\" data-id=" + product.id + ">\n                <i class=\"fas fa-shopping-cart\" aria-hidden=\"true\"></i>\n                Add to cart\n            </button>\n        </div>\n        <h3>" + product.title + "</h3>\n        <h4>" + product.price + "</h4>\n    </article>");
        });
    };
    return UserInterface;
}());
// Local Storage
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
    }
    return LocalStorage;
}());
// Listner, create instances once DOM Content is Loaded
document.addEventListener("DOMContentLoaded", function () {
    var ui = new UserInterface();
    var products = new Products();
    // Products
    products.getProducts().then(function (data) { return ui.displayProducts(data); });
});
