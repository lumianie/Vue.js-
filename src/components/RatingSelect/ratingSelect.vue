<template>
  <div class="ratingSelect">
    <div class="ratingType border-1px">
      <span class="block all" :class="{'active':selectType===0}" @click="select(0, $event)">{{desc.all}}<span class="count">{{rating.length}}</span></span>
      <span class="block positive" :class="{'active':selectType===1}" @click="select(1, $event)">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
      <span class="block negative" :class="{'active':selectType===2}" @click="select(2, $event)">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'clicked':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 1;
  const NEGATIVE = 2;
  const ALL = 0;
  export default {
    props: {
      rating: {
        type: Array,
        default() {
          return []
        }
      },
      selectType: {
        type: Number,
        default() {
          return ALL
        }
      },
      onlyContent: {
        type: Boolean,
        default() {
          return false
        }
      },
      desc: {
        type: Object,
        default() {
          return {
            all: "全部",
            positive: "满意",
            negative: "不满意"
          }
        }
      }
    },
    methods: {
      select(tag, event) {
        if(!event._constructed) {
          return;
        }
        this.selectType = tag;
        this.$dispatch("selectTypeChange", tag);
      },
      toggleContent() {
        if(!event._constructed) {
          return;
        }
        this.onlyContent = !this.onlyContent;
        this.$dispatch("onlyContentChange", this.onlyContent);
      }
    },
    computed: {
      positive() {
        return this.rating.filter((rating) => {
          return rating.rateType === POSITIVE - 1;
        });
      },
      negative() {
        return this.rating.filter((rating) => {
          return rating.rateType === NEGATIVE - 1;
        });
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratingSelect .ratingType {
    padding: 18px 0
    margin: 0 18px
    border-1px(rgba(7, 17, 27, 0.1))
  }
  .ratingSelect .ratingType .block {
    display: inline-block;
    padding: 8px 12px;
    margin-right: 8px;
    border-radius: 1px;
    color: rgb(77, 85, 93);
    font-size: 12px;
  }
  .ratingSelect .ratingType .block .count {
    font-size: 8px;
    margin-left: 2px;
    line-height: 16px;
  }
  .ratingSelect .ratingType .active {
    color: rgb(255, 255, 255);
  }
  .ratingSelect .ratingType .all {
    background: rgba(0, 160, 220, 0.2);
  }
  .ratingSelect .ratingType .positive {
    background: rgba(0, 160, 220, 0.2);
  }
  .ratingSelect .ratingType .negative {
    background: rgba(77, 85, 93, 0.2);
  }
  .ratingSelect .ratingType .active.all {
    background: rgb(0, 160, 220);
  }
  .ratingSelect .ratingType .active.positive{
    background: rgb(0, 160, 220);
  }
  .ratingSelect .ratingType .active.negative{
    background: rgb(77, 85, 93);
  }
  .ratingSelect .switch {
    margin-right: 0px;
    padding: 12px 18px;
    line-height: 24px;
    font-size: 12px;
    color: rgb(147, 153, 159);
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  }
  .ratingSelect .switch .icon-check_circle {
    display: inline-block;
    vertical-align: top;
    font-size: 24px;
    margin-right: 4px;
  }
  .ratingSelect .switch.clicked .icon-check_circle {
    color: #00c850;
  }
</style>
