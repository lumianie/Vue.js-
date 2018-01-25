<template>
  <div class="ratings" v-el:ratings>
    <div class="rating-content">
      <div class="overView">
        <div class="overView-left">
          <p class="score">{{seller.score}}</p>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overView-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="sendTime">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating-Select :rating="ratings" :select-Type="selectType" :only-Content="onlyContent" :desc="desc"></rating-Select>
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item" v-for="rating in ratings" v-show="showRating(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28px" height="28px"/>
            </div>
            <div class="content">
             <h1>{{rating.username}}</h1>
             <div class="star-wrapper">
              <star :size="24" :score="rating.score"></star><span class="sendTime" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
             </div>
             <p class="text">{{rating.text}}</p>
             <div class="recommend" v-show="rating.recommend.length>0">
               <span class="icon-thumb_up"></span>
               <span v-for="item in rating.recommend" class="recommend-item">{{item}}</span>
             </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
        <div class="no-rating" v-show="!ratings || ratings.length == 0">
          暂无评价
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from "../Star/star.vue"
  import split from "../Split/split.vue"
  import ratingSelect from "../RatingSelect/ratingSelect.vue"
  import BScroll from "better-scroll"
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
    data() {
      return {
        ratings: [],
        onlyContent: false,
        selectType: ALL,
        desc: {
          all: "全部",
          positive: "满意",
          negative: "不满意"
        }
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star: star,
      split: split,
      ratingSelect: ratingSelect
    },
    created() {
      this.$http.get("/api/ratings").then(function (response) {
        response = response.body;
        if (response.errno == 0) {
          this.ratings = response.data;
          this.$nextTick(function () {
            this.scroll = new BScroll(this.$els.ratings, {
              click: true
            });
          });
        }
      });
    },
    methods: {
      showRating(rateType, text) {
        if(this.onlyContent && !text) {
          return false;
        }
        if(this.selectType === ALL) {
          return true;
        } else {
          return rateType === (this.selectType - 1);
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
  @import "../../common/stylus/mixin.styl";
  .ratings {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }
  .overView {
    display: flex;
    padding: 18px 0;
  }
  .overView-left {
    flex: 0 0 137px;
    width: 137px;
    border-right: 1px solid rgba(7, 17, 27, 0.1);
    text-align: center;
  }
  .overView-right {
    flex: 1;
    padding: 6px 0 6px 24px;
  }
  @media only screen and (max-width: 320px) {
    .overView-left {
      flex: 0 0 120px;
      width: 120px;
    }
    .overView-right {
      padding-left: 3px;
    }
  }
  .overView-left .score {
    font-size: 24px;
    color: rgb(255, 153, 0);
    line-height: 28px;
  }
  .overView-left .title {
    font-size: 12px;
    line-height: 12px;
    color: rgb(7, 17, 27);
    margin-top: 6px;
    margin-bottom: 8px;
  }
  .overView-left .rank {
    font-size: 10px;
    color: rgb(147, 153, 159);
    line-height: 10px;
    margin-bottom: 24px;
  }
  .overView-right .score-wrapper {
    margin-bottom: 8px;
    font-size: 0;
  }
  .overView-right .score-wrapper .title {
    line-height: 18px;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }
  .overView-right .score-wrapper .star {
    display: inline-block;
    margin: 0 12px;
    vertical-align: top;
  }
  .overView-right .score-wrapper .score {
    line-height: 18px;
    font-size: 12px;
    vertical-align: top;
    color: rgb(255, 153, 0);
  }
  .overView-right .sendTime {
    display: inline-block;
    line-height: 18px;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }
  .overView-right .sendTime .time {
    font-size: 12px;
    color: rgb(147, 153, 159);
    margin-left: 12px;
    line-height: 18px;
  }
  .ratings .rating-wrapper .rating-item {
    display: flex;
    border-1px(rgba(7, 17, 27, 0.1));
  }
  .ratings .rating-wrapper .rating-item .avatar img {
    border-radius: 50%;
  }
  .ratings .rating-wrapper .rating-item .content {
    margin: 0 12px;
  }
  .ratings .rating-wrapper .rating-item .content h1 {
    font-size: 10px;
    color: rgb(7, 17, 27);
    line-height: 12px;
  }
  .ratings .rating-wrapper .rating-item .star-wrapper {
    display: flex;
    margin-top: 4px;
    margin-bottom: 6px;
    line-height: 12px;
  }
  .ratings .star-wrapper .sendTime {
    font-size: 10px;
    font-weight: 200;
    color: rgb(147, 153, 159);
  }
  .ratings .content .text {
    font-size: 12px;
    color: rgb(7, 17, 27);
    line-height: 18px;
  }
  .ratings .content .time {
    position: absolute;
    top: 18px;
    right: 0;
  }
  .ratings .content .recommend {
    margin-top: 8px;
  }
  .ratings .content .recommend .recommend-item {
    display: inline-block;
    padding: 0 6px;
    margin-right: 8px;
    font-size: 9px;
    color: rgb(147, 153, 159);
    line-height: 16px;
    border: 1px solid rgba(7, 17, 27, 0.1);
    margin-bottom: 4px;
  }
  .no-rating {
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147, 153, 159);
  }
</style>
