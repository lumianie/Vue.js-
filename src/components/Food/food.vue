<template>
  <div v-show="showFlag" class="food" transition="move" v-el:food>
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image"/>
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
          <div class="content-detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="sell-rating">好评率{{food.rating}}%</span>
          </div>
        <div class="price">
          <span class="money">￥</span><span class="now">{{food.price}}</span>
          <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst(food, $event)" transition="fade">
          加入购物车
        </div>
      </div>
      <split v-show="food.info"></split>
      <div class="info" v-show="food.info">
        <h1 class="title">商品介绍</h1>
        <p class="info">{{food.info}}</p>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <rating-Select :rating="food.ratings" :select-Type="selectType" :only-Content="onlyContent" :desc="desc"></rating-Select>
      </div>
      <div class="rating-wrapper">
        <ul v-show="food.ratings && food.ratings.length != 0">
          <li v-for="rating in food.ratings" class="rating-item" v-show="showRating(rating.rateType, rating.text)">
            <div class="user">
              <span class="name">{{rating.username}}</span>
              <img :src="rating.avatar" class="avatar" width="12px" height="12px"/>
            </div>
            <div class="time">{{rating.rateTime | formatDate}}</div>
            <p class="text">
              <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
            </p>
          </li>
        </ul>
        <div class="no-rating" v-show="!food.ratings || food.ratings.length == 0">
          暂无评价
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll"
  import cartcontrol from "../CartControl/cartControl.vue"
  import Vue from "vue"
  import split from "../Split/split.vue"
  import ratingSelect from "../RatingSelect/ratingSelect.vue"
  import {formatDate} from "../../common/js/date.js"

  const POSITIVE = 1;
  const NEGATIVE = 2;
  const ALL = 0;
  export default {
    filters: {
      formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
  }
  },
    components: {
      cartcontrol: cartcontrol,
      split: split,
      ratingSelect: ratingSelect
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: "全部",
          positive: "推荐",
          negative: "吐槽"
        }
      }
    },
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        this.$nextTick(function () {
          if(!this.scroll) {
            this.scroll = new BScroll(this.$els.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(food, event) {
        if(!event._constructed) {
          return;
        }
        this.$dispatch("cart.add", event.target);
        Vue.set(this.food, "count", 1);
      },
      showRating(type, text) {
        if(this.onlyContent && !text) {
          return false;
        }
        if(this.selectType === ALL) {
          return true;
        } else {
          return type === (this.selectType - 1);
        }
      }
    },
    events: {
      selectTypeChange(tag) {
        this.selectType = tag;
        this.$nextTick(function () {
          this.scroll.refresh();
        });
      },
      onlyContentChange(tag) {
        this.onlyContent = tag;
        this.$nextTick(function () {
          this.scroll.refresh();
        });
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: white;
  }
  .move-transition {
    transform: translate3d(0, 0, 0);
    transition: all 0.4s linear;
  }
  .move-enter, .move-leave {
    transform: translate3d(100%, 0, 0);
  }
  .image-header {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
  }
  .image-header img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .back {
    position: absolute;
    top: 10px;
    left: 0;
  }
  .icon-arrow_lift {
    display: block;
    padding: 10px;
    font-size: 20px;
    color: #fff;
  }
  .food-content .content {
    padding: 18px;
    position: relative;
  }
  .food-content .content .title {
    line-height: 14px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(7, 17, 27);
  }
  .food-content .content .content-detail {
    margin-bottom: 18px;
    line-height: 10px;
    font-size: 0;
  }
  .food-content .content .sell-count, .sell-rating {
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .food-content .content .sell-count {
    margin-right: 12px;
  }
  .food-content .content .price {
    margin: 0;
    line-height: 24px;
    font-weight: 700;
  }
  .food-content .content .money {
    font-size: 10px;
    color: rgb(240, 20, 20);
  }
  .food-content .content .now {
    font-size: 14px;
    color: rgb(240, 20, 20);
    margin-right: 8px;
  }
  .food-content .content .old {
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159)
  }
  .food-content .cartcontrol-wrapper {
    position: absolute;
    right: 18px;
    bottom: 18px;
  }
  .food-content .buy {
    position: absolute
    right: 18px
    bottom: 18px
    z-index: 10
    height: 24px
    line-height: 24px
    padding: 0 12px
    box-sizing: border-box
    border-radius: 12px
    font-size: 10px
    color: #fff
    background: rgb(0, 160, 220)
  }
  .fade-transition {
    transition: all 0.2s;
    opacity: 1;
  }
  .fade-enter, .fade-leave {
    opacity: 0;
  }
  .food-content .info {
    padding: 18px;
  }
  .food-content .info .title {
    line-height: 14px;
    margin-bottom: 6px;
    font-size: 14px;
    color: black;
  }
  .food-content .info .info {
    line-height: 24px;
    padding: 0 8px;
    font-weight: 200;
    color: rgb(77, 85, 93);
  }
  .food-content .rating {
    padding-top: 18px;
  }
  .food-content .rating .title {
    margin-left: 18px;
  }
  .rating-wrapper {
    padding: 0 18px;
  }
  .rating-wrapper .rating-item {
    position: relative;
    padding: 16px 0;
    border-1px(rgba(7, 17, 27, 0.1))
  }
  .rating-wrapper .rating-item .user {
    position: absolute
    right: 0
    top: 16px
    line-height: 12px
    font-size: 0
  }
  .rating-wrapper .rating-item .user .name {
    display: inline-block
    line-height: 12px
    margin-right: 6px
    vertical-align: top
    font-size: 10px
    color: rgb(147, 153, 159)
  }
  .rating-wrapper .rating-item .user .avatar {
    border-radius: 50%;
  }
  .rating-wrapper .rating-item .time {
    line-height: 12px;
    font-size: 10px;
    color: rgb(147, 153, 159)
    margin-bottom: 6px
  }
  .rating-wrapper .rating-item .text {
    line-height: 12px;
    font-size: 10px;
    color: rgb(7, 17, 27);
  }
  .icon-thumb_up, .icon-thumb_down {
    margin-right: 4px;
    line-height: 24px;
    font-size: 12px;
  }
  .icon-thumb_up {
    color: rgb(0, 160, 220);
  }
  .icon-thumb_down {
    color: rgb(147, 153, 159);
  }
  .no-rating {
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147, 153, 159);
  }
</style>
