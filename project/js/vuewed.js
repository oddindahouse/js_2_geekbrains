const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        isCartVisible: false,
        catalogUrl: '/catalogData.json',
        cartUrl: '/getBasket.json',
        products: [],
        cartProducts: [],
        cartAmount: 0,
        imgCatalog: 'https://placehold.it/200x150',
        imgCart: 'https://placehold.it/60x60',
        searchLine: '',
    },
    methods: {
        filterGoods() {
            console.log('filter');
            let filtered = this.products.filter(el =>
                el.product_name.includes(this.searchLine)
            );
            console.dir(filtered);
        },
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product) {
            console.log(product.id_product);

        },

        log() {
            console.log('click');
        },


    },
    computed: {
        decreaseQuantity(event) {
            console.log(event);
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
                }
            });
        this.getJson(`${API + this.cartUrl}`)
            .then(data => {

                this.cartAmount = data.amount;
                for (let el of data.contents) {
                    this.cartProducts.push(el);
                }
                //console.dir(this.cartProducts[0].id_product);
            });

    }
});
