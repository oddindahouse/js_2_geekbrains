'use sctrict';
const productItem = {
    name: 'product-item',
    props: ['product', 'img'],
    template: `
                <div class="product-item">
                    <img :src="img" alt="Some img">
                    <div class="desc">
                        <h3>{{product.product_name}}</h3>
                        <p>{{product.price}}₽</p>
                        <button class="buy-btn btn" @click="cartAPI.addItemToCart(product)">Купить</button>
                    </div>
                </div>
    `,
    data() {
        return {
            cartAPI: this.$root.$refs.cart,
        };
    },
    mounted() {
    }
}

Vue.component('products', {
    data() {
        return {
            products: [],
            filteredProducts: [],
            catalogUrl: '/catalogData.json',
            imgCatalog: 'https://placehold.it/200x150',
        };
    },
    methods: {
        filterGoods(searchLine) {
            let regexp = new RegExp(searchLine, 'i');
            this.filteredProducts = this.products.filter(el => regexp.test(el.product_name));
            console.log('filter' + ' ' + searchLine);
            console.dir(this.filteredProducts);
        },
    },
    components: {
        productItem,
    },
    template: `
        <div class="products">
            <product-item 
            v-show="products.length > 0" 
            v-for="product of filteredProducts" 
            :key="product.id_product"
            :product="product"
            :img="imgCatalog"
            ></product-item>
            <div v-if="products.length === 0">Нет данных</div>
        </div>
    `,
    created() {
        this.$root.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    // console.log(el);
                    this.products.push(el);
                }
                this.filterGoods();
            }).catch(error => {
            console.dir(error);
            this.products = [];
        });
    },
    mounted() {
        //
    }
})