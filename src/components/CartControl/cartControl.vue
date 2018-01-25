<template>
  <div class="cartControl">
    <div class="cartDecrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decrCart" transition="move">
    </div>
    <div class="cartCount" v-show="food.count>0">{{food.count}}</div>
    <div class="cartAdd icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from "vue"
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart(event) {
      if(!event._constructed) {
        return;
      }
      if(!this.food.count) {
        Vue.set(this.food, "count", 1);
      } else {
        this.food.count++;
      }
      this.$dispatch("cart.add", event.target);
    },
    decrCart() {
      if(!event._constructed) {
        return;
      }
      this.food.count--;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartControl .cartDecrease {
    display: inline-block;
    padding: 0px;
    font-size: 24px;
    line-height: 24px;
    color: rgb(0, 160, 220);
  }
  .cartControl .cartCount {
    display: inline-block
    vertical-align: top
    width: 12px
    padding-top: 0px
    line-height: 24px
    text-align: center
    font-size: 10px
    color: rgb(147, 153, 159)
  }
  .cartControl .cartAdd {
    display: inline-block
    padding: 0px
    line-height: 24px
    font-size: 24px
    color: rgb(0, 160, 220)
  }
</style>
