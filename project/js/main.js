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
                this.goods = [...data];
                this._render();
                console.log(this._calculateTotalProductsSum());
            });

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

class Item {
    constructor(product_name, price, id_product, img) {
        this.product_name = product_name;
        this.price = price;
        this.id_product = id_product;
        this.img = img;
    }
}

class ProductItem extends Item {
    constructor(product, img = 'https://placehold.it/200x150') {
        super(
            product.product_name,
            product.price,
            +product.id_product,
            img
        );


    }

    render() {
        return `<div class="product-item" data-id="${this.id_product}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.product_name}</h3>
                    <p>${this.price} \u20bd</p>
                    <button class="buy-btn">Добавить в корзину</button>
                </div>
            </div>`;
    }

    addToCartButtonHandler(cart) {
        let _handler = () => {
            cart.addItem(this)
        }
        document.querySelector(`.product-item[data-id="${this.id_product}"]`).querySelector('.buy-btn')
            .addEventListener('click', _handler.bind(this));
    }
}

class Cart {
    constructor(container = '.cart__item-list') {
        this.amount = 0;
        this.countGoods = null;
        this.cartItemList = [];
        this.container = container;
        this._getCartItems().then(() => {
            this._render();
        });
        this._addCartButtonHandler();

    }


    _getCartItems() {
        return fetch(`${API}/getBasket.json`)
            .then(response => response.json()).then(data => {
                this.amount = data.amount;
                this.countGoods = data.countGoods;
                this.cartItemList = [...data.contents].map(product => this._product2CartItem(product));
            })
            .catch(error => {
                console.log(error);
            });
    }

    _render() {
        for (let item of this.cartItemList) {
            document.querySelector(this.container).insertAdjacentHTML('beforeend', item.render());
            //навешиваем обработчик события на кнопку удаления товара
            item.addDelBtnHandler(this, this.container);
        }
    }

    _fetchCartItemAdd(productItem) {
        fetch(`${API}/addToBasket.json`, {
            method: 'POST',
            body: productItem
        })
            .then(response => {
                if (!response.ok) {
                    // Сервер вернул код ответа за границами диапазона [200, 299]
                    return Promise.reject(new Error(
                        'Response failed: ' + response.status + ' (' + response.statusText + ')'
                    ));
                }
                return response.json();
            })
            .then((data) => {
                if (data.result !== 1) {
                    return Promise.reject(new Error('Товар не был добавлен в корзину'));
                }
            }).catch(error => {
            console.log(error);
        });
    }

    addItem(productItem) {
        //отправляем добавленный товар на сервер
        this._fetchCartItemAdd(productItem);
        //работаем с локальной копией товаров
        let el = this.cartItemList.find(el => el.id_product === productItem.id_product);
        if (el !== undefined) {
            el.quantity++;
            document.querySelector(`.cart__item[data-id="${el.id_product}"] .cart__item-quantity`).textContent = el.quantity;

        } else {
            let newCartItem = this._product2CartItem(productItem);
            document.querySelector(this.container).insertAdjacentHTML('beforeend', newCartItem.render());
            //навешиваем обработчик события на кнопку удаления товара
            newCartItem.addDelBtnHandler(this, this.container);
            this.cartItemList.push(newCartItem);

        }

        this.refreshTotalPrice();
    }

    _addCartButtonHandler() {
        document.querySelector('.cart__btn').addEventListener('click', () => {
            let isVisible = (vElement) => {
                return !(vElement.offsetWidth === 0 && vElement.offsetHeight === 0)
                    && window.getComputedStyle(vElement).visibility !== "hidden";
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

class CartItem extends Item{
    constructor(product, img = 'https://placehold.it/60x60') {
        super(
            product.product_name,
            product.price,
            product.id_product,
            img
        );
        this.quantity = 1;
    }

    render() {
        return `<li class="cart__item" data-id="${this.id_product}">
                <img class="cart__item-img" src="${this.img}" alt="Some img">
                    <p class="cart__item-title">${this.product_name}</p>
                    <p class="cart__item-price">${this.price} \u20bd</p>
                    <p class="cart__item-quantity">${this.quantity}</p>
                    <i class="fas fa-times-circle cart__item-delbtn"></i>
            </li>`;
    }

    _fetchCartItemDel(item) {
        fetch(`${API}/deleteFromBasket.json`, {
            method: 'POST',
            body: item
        })
            .then(response => {
                if (!response.ok) {
                    // Сервер вернул код ответа за границами диапазона [200, 299]
                    return Promise.reject(new Error(
                        'Response failed: ' + response.status + ' (' + response.statusText + ')'
                    ));
                }
                return response.json();
            })
            .then((data) => {
                if (data.result !== 1) {
                    return Promise.reject(new Error('Товар не был удален из корзины'));
                }
            }).catch(error => {
            console.log(error);
        });
    }

    _delItemFromCart(cart, container) {
        this._fetchCartItemDel(new Item(this.product_name, this.price, this.id_product, this.img));
        let el = document.querySelector(`.cart__item[data-id="${this.id_product}"]`)
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
        document.querySelector(`.cart__item[data-id="${this.id_product}"] .cart__item-delbtn`)
            .addEventListener('click', this._delItemFromCart.bind(this, cart, container));
    }
}

const cart = new Cart();
new ProductList(cart);





