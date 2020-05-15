'use strict';
Vue.component('error',{
    data(){
        return {
            errors: [],
        };
    },
    methods:{
      addError(error, context = ''){
          this.errors.push(`${context} : ${error}`);
      }
    },
    computed:{
        haveErrors(){
            return this.errors.length > 0;
        }
    },
    template:`
        <div class="error" v-show="haveErrors">
            <p class="error__p"v-for="error of errors">{{error}}</p>
        </div>
    `,
})