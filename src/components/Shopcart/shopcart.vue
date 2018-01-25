<template>
<div class="shopcart">
  <div class="content" @click="toggleList">
    <div class="content-left">
      <div class="logo-wrapper">
        <div class="logo" :class="{'highlight':selectFoods.length!=0}">
          <i class="icon-shopping_cart" :class="{'fontHighlight':selectFoods.length!=0}"></i>
        </div>
        <div class="num" v-show="selectFoods.length!=0">
          {{totalCount}}
        </div>
      </div>
      <div class="price" :class="{'fontHighlight':selectFoods.length!=0}">
        ￥{{totalPrice}}
      </div>
      <div class="desc">
        另需配送费￥{{deliveryPrice}}元
      </div>
    </div>
    <div class="content-right" @click.stop="pay">
      <div class="pay" :class="{highlight:totalPrice>=minPrice}">
        {{payDesc}}
      </div>
    </div>
  </div>
  <div class="ball-container">
    <div v-for="ball in balls" v-show="ball.show" class="ball" transition="drop">
      <div class="inner inner-hook"></div>
    </div>
  </div>
  <div class="shopcart-list" v-show="listShow" transition="fold">
    <div class="listHeader">
      <h1 class="title">购物车</h1>
      <span class="empty" @click="empty">清空</span>
    </div>
    <div class="listContent" v-el:listcontent>
      <ul>
        <li class="food" v-for="food in selectFoods">
          <span class="name">{{food.name}}</span>
          <div class="price">
            <span>￥{{food.price*food.count}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cart-control :food="food"></cart-control>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
  <div class="list-mask" @click="hideList" v-show="listShow" transition="fade"></div>
</template>

<script type="text/ecmascript-6">
  import cartControl from "../CartControl/cartControl.vue"
  import BScroll from "better-scroll"
export default  {
  components: {
    cartControl: cartControl
  },
  data() {
   return {
    balls: [{
      show: false
    }],
     dropBalls: [],
     fold: true
   }
  },
  props: {
    deliveryPrice: {
      type: Number
    },
    minPrice: {
      type: Number
    },
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    totalPrice() {
      var total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      var desc = "";
      if (this.selectFoods.length === 0) {
        desc = "￥"+this.minPrice+"起送";
     } else if (this.totalPrice < this.minPrice) {
        desc = "还差"+(this.minPrice-this.totalPrice)+"起送";
      } else {
        desc = "去结算";
      }
      return desc;
    },
    listShow() {
      if(!this.totalCount) {
        this.fold = true;
        return false;
      }
      if(!this.fold) {
        this.$nextTick(function () {
          if(!this.scroll) {
            this.scroll = new BScroll(this.$els.listcontent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return !this.fold;
    }
  },
  methods: {
    drop(el) {
      for(var i = 0; i < this.balls.length; i++) {
        var ball = this.balls[i];
        if(!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    toggleList() {
      if(!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    empty() {
      this.selectFoods.forEach(function (food) {
        food.count = 0;
      });
    },
    hideList() {
      this.fold = true;
    },
    pay() {
      if(this.totalPrice < this.minPrice) {
        return;
      }
      alert("需要支付"+this.totalPrice+"元");
    }
  },
  transitions: {
    drop: {
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.shopcart {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 50;
  height: 48px;
}
  .shopcart .content {
    display: flex;
    background: #141d27;
  }
  .shopcart .content .content-left {
    flex: 1;
  }
  .shopcart .content .content-left .logo-wrapper {
    display: inline-block;
    position: relative;
    top: -10px;
    margin: 0 12px;
    padding: 6px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    vertical-align: top;
    border-radius: 50%;
    background: #141d27;
  }
  .shopcart .content .content-left .logo-wrapper .logo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #2b343c;
    text-align: center;
  }
  .shopcart .content .content-left .logo-wrapper .highlight {
    background: rgb(0, 160, 220);
  }
  .shopcart .content .content-left .icon-shopping_cart {
    font-size: 24px;
    color: #80858a;
    line-height: 44px;
  }
  .shopcart .content .content-left .price {
    display: inline-block;
    vertical-align: top;
    line-height: 24px;
    margin-top: 12px;
    padding-right: 12px;
    box-sizing: border-box;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
  }
  .shopcart .content .content-left .fontHighlight {
    color: #fff;
  }
  .shopcart .content .content-left .desc {
    display: inline-block;
    vertical-align: top;
    line-height: 24px;
    margin: 12px 0 0 12px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 10px;
  }
  .shopcart .content .content-right {
    flex: 0 0 105px;
    width: 105px;
    background: #2b343c;
  }
  .shopcart .content .content-right .pay {
    font-size: 12px;
    line-height: 48px;
    text-align: center;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    height: 48px;
  }
  .shopcart .content .content-right .highlight {
    background: #00b43c
    color: #fff
  }
  .shopcart .logo-wrapper .num {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 16px;
    line-height: 16px;
    font-size: 9px;
    font-weight: 700;
    color: rgb(255, 255, 255);
    border-radius: 16px;
    background: rgb(240, 20, 20);
    box-shadow: 0 4px 8px 0 rgb(0, 0, 0, 0.4);
    text-align: center;
  }
  .ball-container .ball{
    position: fixed;
    left: 32px;
    bottom: 22px;
    z-index: 200;
  }
  .ball-container .drop-transition {
    transition:  all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
  }
  .ball-container .inner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgb(0, 160, 220);
    transition: all 0.4s linear;
  }
  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
  }
  .fold-transition {
    transition: all 0.5s;
    transform: translate3d(0, -100%, 0);
  }
  .fold-enter, .fold-leave {
    transform: translate3d(0, 0, 0);
  }
  .listHeader {
    height: 40px;
    line-height: 40px;
    padding: 0 18px;
    background: #f3f5f7;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  }
  .listHeader .title {
    float: left;
    font-size: 14px;
    font-weight: 200;
    color: rgb(7, 17, 27);
    line-height: 40px;
  }
  .listHeader .empty {
    float: right;
    font-size: 12px;
    color: rgb(0, 160, 220);
    line-height: 40px;
  }
  .listContent {
    padding: 0 18px;
    max-height: 217px;
    background: #fff;
    overflow: hidden;
  }
  .listContent .food{
    position: relative;
    padding: 12px 0;
    box-sizing: border-box;
    border-1px(rgba(7, 17, 27, 0.1));
  }
  .listContent .food .name {
    font-size: 14px;
    line-height: 24px;
  }
  .listContent .price {
    position: absolute;
    right: 90px;
    bottom: 12px;
    line-height: 24px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(240, 20, 20);
  }
  .cartcontrol-wrapper {
    position: absolute;
    right: 0;
    bottom: 12px;
  }
  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    backdrop-filter: blur(10px);
  }
  .fade-transition {
    opacity: 1;
    background: rgba(7, 17, 27, 0.6);
  }
  .fade-enter, .fade-leave {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }
  .fade-transition {
    transition: all 0.5s;
  }
</style>
