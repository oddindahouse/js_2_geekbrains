'use sctrict';
const cartItem = {
    name: 'cart-item',
    props: ['item', 'img'],
    template: `<div>
                                <img :src="img" alt="Some img" class="cart__item-img">
                                <p class="cart__item-title">{{item.product_name}}</p>
                                <p class="cart__item-price">{{item.price}} &#x20bd</p>
                                <p class="cart__item-quantity">{{item.quantity}}</p>
                                <i class="fas fa-times-circle cart__item-delbtn" @click="cartAPI.delItemFromCart(item)"></i>
               </div>
    `,
    data() {
        return {
            cartAPI: this.$root.$refs.cart,
        };
    },
};

Vue.component('cart', {

    data() {
        return {
            isCartVisible: false,
            cartUrl: '/getBasket.json',
            cartProducts: [],
            imgCart: 'https://placehold.it/60x60',
        };
    },
    components: {
        cartItem,
    },
    methods: {
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
                    let regExp = /[^(]*/;
                    this.$root.$refs.errors.addError(error, arguments.callee);
            });
        },
        addItemToCart(productItem) {
            //отправляем добавленный товар на сервер
            this.fetchCartItemAdd(productItem);
            //работаем с локальной копией товаров
            let el = this.cartProducts.find(el => el.id_product === productItem.id_product);
            //console.dir(el);
            if (el !== undefined) {

                el.quantity++;
                //console.log(el.quantity);
            } else {
                let newCartItem = Object.assign({quantity: 1}, productItem);
                //console.dir(newCartItem);
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
                    this.$root.$refs.errors.addError(error,arguments.callee);
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
    template: `  <div class="cart">
                    <div class="cart__btn btn" @click="isCartVisible = !isCartVisible" >
                        <div v-if="cartCountGoods > 0" class="cart__goods-amount">{{cartCountGoods}}</div>
                        <i class="fas fa-shopping-cart fa-2x"></i>
                    </div>
                    <div class="cart__drop" v-show="isCartVisible">
                        <ul class="cart__item-list">
                            <li is="cart-item" class="cart__item" 
                            v-for="cartProduct in cartProducts" 
                            :key="cartProduct.id_product"
                            :item="cartProduct"
                            :img="imgCart">
                                
                            </li>
                        </ul>
                        <p class="cart__total-price">Текущая&nbspсумма&nbspпокупок:&nbsp{{cartAmount}}&nbsp&#x20bd</p>
                    </div>
                </div>
    `,
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
    mounted() {
        this.$root.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for (let el of data.contents) {
                    this.cartProducts.push(el);
                }
                // console.dir(data);
                //console.dir(this.cartProducts[0].id_product);
            });
    }
})