'use strict';
Vue.component('custom-search',{

    template: `
        <form action="#" class="search__form">
                    <input type="text" class="search__field"
                           v-model.trim="searchLine"
                           @blur.prevent="$root.$refs.products.filterGoods(searchLine)"
                           @keyup.enter.prevent="$root.$refs.products.filterGoods(searchLine)">
                    <button class="btn-search" type="submit">
                        <i class="fas fa-search" @click.prevent="$root.$refs.products.filterGoods(searchLine)"></i>
                    </button>
                </form>
    `,
    data(){
        return {
            searchLine: '',
        }
    },
})