const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
        el: '#app',
        data: {
            isCartVisible: false,
            catalogUrl: '/catalogData.json',
            cartUrl: '/getBasket.json',
            products: [],
            filteredProducts: [],
            cartProducts: [],
            imgCatalog: 'https://placehold.it/200x150',
            imgCart: 'https://placehold.it/60x60',
            searchLine: '',
        },
        methods: {
            filterGoods() {
                console.log('filter');
                this.filteredProducts = this.products.filter(el =>
                    el.product_name.toLowerCase().includes(this.searchLine.toLowerCase())
                );
                // console.dir(this.filteredProducts);
            },
            getJson(url) {
                return fetch(url)
                    .then(result => result.json())
                    .catch(error => {
                        console.log(error);
                    })
            },
            fetchCartItemAdd(productItem) {
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
            },
            addItemToCart(productItem) {
                //отправляем добавленный товар на сервер
                this.fetchCartItemAdd(productItem);
                //работаем с локальной копией товаров
                let el = this.cartProducts.find(el => el.id_product === productItem.id_product);
                console.dir(el);
                if (el !== undefined) {

                    el.quantity++;
                    //console.log(el.quantity);
                } else {
                    let newCartItem = Object.assign({quantity: 1}, productItem);
                    console.dir(newCartItem);
                    this.cartProducts.push(newCartItem);

                }
            },
            fetchCartItemDel(item) {
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
            },
            delItemFromCart(item) {
                this.fetchCartItemDel(item);
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    this.cartProducts.splice(this.cartProducts.findIndex(el => el === item), 1);
                }
            },

        },
        computed: {

            cartAmount: {
                get: function () {
                    return this.cartProducts.reduce((acc, el) => acc + el.price * el.quantity, 0)
                },
                set: function () {

                }
            },
            cartCountGoods: {
                get: function () {
                    return this.cartProducts.reduce((acc, el) => acc + el.quantity, 0);
                },
                set: function () {

                }
            }
        },

        beforeMount() {
            //console.log('beforeMount');
        }
        ,
        mounted() {
            this.getJson(`${API + this.catalogUrl}`)
                .then(data => {

                    for (let el of data) {
                        // console.log(el);
                        this.products.push(el);
                        // console.log(`mounted getJson: ${el}`);
                    }
                    this.filterGoods();
                }).catch(error => {
                console.dir(error);
                this.products = [];
            });
            this.getJson(`${API + this.cartUrl}`)
                .then(data => {
                    for (let el of data.contents) {
                        this.cartProducts.push(el);
                    }
                    //console.dir(this.cartProducts[0].id_product);
                });

        }
    })
;
