import Vue from 'vue'
import App from './App'
import VueRouter from "vue-router"
import goods from "./components/Goods/goods.vue"
import ratings from "./components/Ratings/ratings.vue"
import seller from "./components/Seller/seller.vue"
import "./common/stylus/index.styl"
import VueResource from "vue-resource"

Vue.use(VueRouter);
Vue.use(VueResource);

var app = Vue.extend(App);
var router = new VueRouter();

router.map({
  '/goods': {
    component: goods
  },
  '/ratings': {
    component: ratings
  },
  '/seller': {
    component: seller
  }
});



router.start(app, "#app");
router.go("/goods");
