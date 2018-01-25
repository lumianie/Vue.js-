<template>
  <div class="seller" v-el:seller>
    <div class="seller-content">
      <div class="overView">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star><span class="text1">({{seller.ratingCount}})</span><span class="text2">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="save">
          <span class="icon-favorite" @click="save" :class="{'icon':fav}"></span>
          <span class="text">{{value}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin1">
        <h1>公告与活动</h1>
        <div class="content-wrapper">
          <p>{{seller.bulletin}}</p>
        </div>
      </div>
      <div class="supportWrapper">
        <ul v-if="seller.supports" class="support">
          <li class="supportItem" v-for="item in seller.supports">
            <span class="icon" :class="imageArr[seller.supports[$index].type]"></span><span class="text">{{seller.supports[$index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="sellerView-wrapper">
        <h1 class="title">商家实景</h1>
        <div class="sellerView" v-el:seller-view>
          <ul v-el:seller-list>
            <li v-for="pic in seller.pics" class="pic">
              <img :src="pic" height="90" width="120"/>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul class="info-wrapper">
          <li v-for="item in seller.infos" class="infoItem">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from "../Star/star.vue"
  import split from "../Split/split.vue"
  import BScroll from "better-scroll"
  export default {
    data() {
      return {
        imageArr: [],
        value: "收藏",
        fav: false
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star: star,
      split: split
    },
    created() {
      this.imageArr= ["decrease", "discount", "special", "invoice", "guarantee"];
      this.$nextTick(function() {
        if(!this.BScroll) {
          this.BScroll = new BScroll(this.$els.seller, {
            click: true
          });
          this.BScroll.refresh();
        }
      });
    },
    ready() {
      if(this.seller.pics) {
        var width = this.seller.pics.length * (120 + 6);
        this.$els.sellerList.style.width = width + "px";
        this.$nextTick(function () {
          if(!this.picScroll) {
            this.picScroll = new BScroll(this.$els.sellerView, {
              click: true,
              scrollX: true
            });
            this.picScroll.refresh();
          }
        });
      }
    },
    methods: {
      save() {
        this.fav = !this.fav;
      }
    },
    computed: {
      value() {
        if(this.fav) {
          return "已收藏";
        } else {
          return "收藏";
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .seller {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }
  .seller .seller-content .overView {
    padding: 18px;
    display: block;
  }
  .seller .seller-content .overView .title {
    font-size: 14px;
    color: rgb(7, 17, 27);
    line-height: 14px;
  }
  .seller .seller-content .desc {
    display: block;
    margin-bottom: 18px;
    margin-top: 8px;
    line-height: 18px;
  }
  .seller .seller-content .overView .star {
    margin-right: 8px;
    display: inline-block;
  }
  .seller .seller-content .overView .text1, .text2 {
    font-size: 10px;
    color: rgb(77, 85, 93);
    vertical-align: top;
  }
  .seller .seller-content .overView .text1 {
    margin-right: 12px;
  }
  .seller .overView .remark  {
    display: flex;
    padding: 18px 0 0 0px;
    border-top: 1px solid rgba(7, 17, 27, 0.1);
  }
  .seller .overView .remark .block {
    flex: 1;
    text-align: center;
    border-right: 1px solid rgba(7, 17, 27, 0.1);
  }
  .seller .overView .remark .block:last-child {
    border: none;
  }
  .seller .overView .remark .block h2 {
    font-size: 10px;
    color: rgb(147, 153, 159);
    line-height: 10px;
  }
  .seller .overView .remark .block .content {
    margin-top: 4px;
    font-size: 10px;
    color: rgb(77, 85, 93);
  }
  .seller .overView .remark .block .content .stress {
    font-size: 24px;
    font-weight: 200;
    color: rgb(7, 17, 27);
    line-height: 24px;
  }
  .seller .seller-content .split {
    margin-top: 0;
  }
  .seller .seller-content .bulletin1 {
    padding: 18px 18px 0px 18px;
  }
  .seller .seller-content .bulletin1 h1 {
    margin-bottom: 8px;
  }
  .seller .seller-content .bulletin1 .content-wrapper {
    padding: 0 12px ;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  }
  .seller .seller-content .bulletin1 .content-wrapper p {
    margin-bottom: 16px;
    font-size: 12px;
    font-weight: 200;
    color: rgb(240, 20, 20);
    line-height: 24px;
  }
  .seller .seller-content .supportWrapper {
    padding: 0 16px;
  }
  .seller .seller-content .supportWrapper .supportItem {
    padding: 16px 12px;
    line-height: 16px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  }
  .seller .seller-content .supportWrapper .supportItem:last-child {
    border-bottom: none;
  }
  .seller .seller-content .supportWrapper .supportItem .icon {
    margin-right: 6px;
    vertical-align: top;
  }
  .seller .support .supportItem .decrease {
  bg-image("decrease_4");
  }
  .seller .support .supportItem .discount {
  bg-image("discount_4");
  }
  .seller .support .supportItem .guarantee {
  bg-image("guarantee_4");
  }
  .seller .support .supportItem .invoice {
  bg-image("invoice_4");
  }
  .seller .support .supportItem .special {
  bg-image("special_4");
  }
  .seller .seller-content .supportWrapper .supportItem .text {
    font-size: 12px;
    font-weight: 200;
    color: rgb(7, 17, 27);
    vertical-align: top;
  }
  .sellerView-wrapper {
    padding: 18px 0 18px 18px;
  }
  .sellerView-wrapper .title {
    margin-bottom: 12px;
  }
  .sellerView-wrapper .sellerView {
    overflow: hidden;
    white-space: nowrap;
  }
  .sellerView-wrapper .sellerView .pic {
    display: inline-block;
    margin-right: 6px;
  }
  .seller .info {
    padding: 18px 18px 0 18px;
  }
  .info .title {
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  }
  .info .infoItem {
    padding: 16px 12px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    font-size: 12px;
    font-weight: 200;
    line-height: 16px;
  }
  .info .infoItem:last-child {
    border-bottom: none;
  }
  .seller .overView .save {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 36px;
  }
  .seller .overView .save .icon-favorite {
    display: block;
    margin-bottom: 4px;
    font-size: 24px;
    line-height: 24px;
    color: #d4d6d9;
    text-align: center;
  }
  .seller .overView .save .icon {
    color: rgb(240, 20, 20);
  }
  .seller .overView .save .text {
    display: block;
    text-align: center;
    font-size: 10px;
    color: rgb(77, 85, 93);
    line-height: 10px;
  }
</style>
