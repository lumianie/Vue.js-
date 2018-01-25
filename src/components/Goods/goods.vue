<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <li v-for="item in goods" class="menu-item" :class="{'current':currentIndex===$index}" @click="selectMenu($index, $event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="imageArr[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item" border-1px @click="selectedFood(food, $event)">
              <div class="icon">
                <img :src="food.icon" width="57px" height="57px"/>
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p>{{food.description}}</p>
                <div class="extra">
                  <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="money">￥</span><span class="nowPrice">{{food.price}}</span><span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartControl-wrapper">
                  <cart-Control :food="food"></cart-Control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :delivery-Price="seller.deliveryPrice" :min-Price="seller.minPrice" :select-Foods="selectFoods" v-ref:shopcart></shopcart>
  </div>
  <food :food="selectFood" v-ref:food></food>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import shopcart from "../Shopcart/shopcart.vue"
  import cartControl from "../CartControl/cartControl.vue"
  import food from "../Food/food.vue"
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      shopcart: shopcart,
      cartControl: cartControl,
      food: food
    },
    data() {
    return {
      goods: [],
      imageArr: [],
      listHeight: [],
      scrollY: 0,
      foodsScroll: null,
      menuScroll: null,
      selectFood: {}
  }
  },
    created() {
    this.$http.get("/api/goods").then(function(response) {
      response = response.body;
      if (response.errno == 0) {
        this.goods = response.data;
        this.$nextTick(function() {
          this.initScroll();
          this.calculateHeight();
        });
      }
    });
    this.imageArr= ["decrease", "discount", "special", "invoice", "guarantee"];
  },
  methods: {
    initScroll() {
      this.meunScroll = new BScroll(this.$els.menuWrapper, {
        click: true
      });

      this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
        click: true,
        probeType: 3
      });

      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },

    calculateHeight() {
      let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index, event) {
      if (!event._constructed) {
        return;
      }
      let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
      var el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    drop(target) {
      this.$nextTick(function () {
        this.$refs.shopcart.drop(target);
      });
    },
    selectedFood(food, event) {
      this.selectFood = food;
      this.$refs.food.show();
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      var foods = [];
      this.goods.forEach(function(good) {
        good.foods.forEach(function (food) {
          if(food.count > 0) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
    events: {
      "cart.add"(target) {
        this.drop(target);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
  }
  .goods .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;
  }

  .menu-item {
    display: table
    height: 54px
    width: 56px
    padding: 0 12px
    line-height: 14px
  }
  .menu-wrapper .current {
    position: relative;
    z-index: 10;
    margin-top: -1px;
    background: #fff;
    font-weight: 700;
  }
  .menu-wrapper .current .text {
    border-none();
  }
  .menu-item .icon {
    display: inline-block
    vertical-align: top
    width: 12px
    height: 12px
    margin-right: 2px
    background-size: 12px 12px
    background-repeat: no-repeat
  }
  .menu-item .decrease {
  bg-image("decrease_3");
  }
  .menu-item .discount {
  bg-image("discount_3");
  }
  .menu-item .guarantee {
  bg-image("guarantee_3");
  }
  .menu-item .invoice {
  bg-image("invoice_3");
  }
  .menu-item .special {
  bg-image("special_3");
  }
  .menu-item .text {
    display: table-cell
    width: 56px
    vertical-align: middle
    border-1px(rgba(7, 17, 27, 0.1))
    font-size: 12px
  }

  .goods .foods-wrapper {
    flex: 1;
  }

  .food-list .title {
    padding: 0 14px;
    height: 26px;
    line-height: 26px;
    border-left: 2px solid #d9dde1;
    background: #f3f5f7;
    font-size: 12px;
    color: rgb(147, 153, 159);
  }
  .foods-wrapper .food-item {
    display: flex
    margin: 18px
    padding-bottom: 18px
    border-1px(rgba(7, 17, 27, 0.1))
  }
  .food-item:last-child {
    border-none()
    margin-bottom: 0;
  }
  .food-item .icon {
    flex: 0 0 57px
    margin-right: 10px
  }
  .food-item .content {
    flex: 1;
  }
  .food-item .content .name {
    margin: 2px 0 8px 0;
    font-size: 14px;
    line-height: 14px;
    color: rgb(7, 17, 27);
  }
  .food-item .content p {
    margin: 8px 0 8px 0;
    font-size: 10px;
    color: rgb(147, 153, 159);
    line-height: 12px;
  }
  .food-item .extra {
    line-height: 10px
    font-size: 10px
    color: rgb(147, 153, 159)
  }
  .food-item .extra .sell-count {
    margin-right: 8px;
  }
  .food-item .content .price {
    margin: 0;
    line-height: 24px;
    font-weight: 700;
  }
  .food-item .content .price .money {
    font-size: 10px;
    color: rgb(240, 20, 20);
  }
  .food-item .content .price .nowPrice {
    font-size: 14px;
    color: rgb(240, 20, 20);
    margin-right: 8px;
  }
  .food-item .content .price .oldPrice {
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159)
  }
  .content .cartControl-wrapper {
    position: absolute;
    right: 0;
    bottom: 17px;
  }
</style>
