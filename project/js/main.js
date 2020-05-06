'use strict';
const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

let getRequest = (url) => {
    return new Promise((res, rej) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    rej('Error');
                } else {
                    res(xhr.responseText);
                }
            }
        };
        xhr.send();
    })

};


class ProductList {
    constructor(cart, container = '.products') {
        this.cart = cart;
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        // this._fetchProducts();
        this._getProducts()
            .then(data => {
                console.log(data);
                this.goods = [...data];
                this._render();
            });
        console.log(this._calculateTotalProductsSum())
    }

    _getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then(response => response.json())
            .catch(error => {
                console.log(error);
            });
    }

    // _fetchProducts() {
    //     getRequest(`${API}/catalogData.json`)
    //         .then(data => {
    //             this.goods = JSON.parse(data);
    //             this._render();
    //         });
    // }

    _render() {
        const block = document.querySelector(this.container);

        for (let product of this.goods) {
            const productObject = new ProductItem(product);
            this.allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render());
            productObject.addToCartButtonHandler(this.cart);
        }
    }

    _calculateTotalProductsSum() {
        return this.allProducts.reduce((acc, el) => acc + el.price, 0);
    }
}

class ProductItem {
    constructor(product, img = 'https://placehold.it/200x150') {
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }

    render() {
        return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>${this.price} \u20bd</p>
                    <button class="buy-btn">Добавить в корзину</button>
                </div>
            </div>`;
    }

    addToCartButtonHandler(cart) {
        let _handler = () => {
            cart.addItem(this)
        }
        document.querySelector(`.product-item[data-id="${this.id}"]`).querySelector('.buy-btn')
            .addEventListener('click', _handler.bind(this));
    }
}

class Cart {
    constructor(container = '.cart__item-list') {
        this.container = container;
        this.cartItemList = [];
        this._addCartButtonHandler();

    }

    addItem(productItem) {
        let el = this.cartItemList.find(el => el.id === productItem.id);
        if (el !== undefined) {
            el.quantity++;
            document.querySelector(`.cart__item[data-id="${el.id}"] .cart__item-quantity`).textContent = el.quantity;

        } else {
            let newCartItem = this._product2CartItem(productItem);
            document.querySelector(this.container).insertAdjacentHTML('beforeend', newCartItem.render());
            newCartItem.addDelBtnHandler(this, this.container);
            this.cartItemList.push(newCartItem);

        }
        this.refreshTotalPrice();
    }

    _addCartButtonHandler() {
        document.querySelector('.cart__btn').addEventListener('click', () => {
            let isVisible = (vElement) => {
                return !(vElement.offsetWidth == 0 && vElement.offsetHeight == 0)
                    && window.getComputedStyle(vElement).visibility != "hidden";
            }

            if (isVisible(document.querySelector('.cart__drop'))) {
                document.querySelector('.cart__drop').style.visibility = 'hidden';
            } else {
                document.querySelector('.cart__drop').style.visibility = 'visible';
            }

        })
    }

    _product2CartItem(productItem) {
        return new CartItem(productItem);
    }

    refreshTotalPrice() {
        document.querySelector('.cart__total-price_span').textContent = this._calculateTotalPrice();
    }

    _calculateTotalPrice() {
        return this.cartItemList.reduce((acc, el) => acc + el.price * el.quantity, 0);
    }

}

class CartItem {
    constructor(product, img = 'https://placehold.it/60x60') {
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
        this.img = img;
        this.quantity = 1;
    }

    render() {
        return `<li class="cart__item" data-id="${this.id}">
                <img class="cart__item-img" src="${this.img}" alt="Some img">
                    <p class="cart__item-title">${this.title}</p>
                    <p class="cart__item-price">${this.price} \u20bd</p>
                    <p class="cart__item-quantity">${this.quantity}</p>
                    <i class="fas fa-times-circle cart__item-delbtn"></i>
            </li>`;
    }

    _changeQuantity(cart, container) {
        let el = document.querySelector(`.cart__item[data-id="${this.id}"]`)
        if (this.quantity > 1) {
            this.quantity--;
            el.querySelector('.cart__item-quantity').textContent = this.quantity;
        } else {
            cart.cartItemList.splice(cart.cartItemList.findIndex(el => el === this), 1);
            document.querySelector(container).removeChild(el);
        }
        cart.refreshTotalPrice();
    }

    addDelBtnHandler(cart, container) {
        document.querySelector(`.cart__item[data-id="${this.id}"] .cart__item-delbtn`)
            .addEventListener('click', this._changeQuantity.bind(this, cart, container));
    }
}

const cart = new Cart();
new ProductList(cart);





