<template>
  <div id="app">
    <div class="g-wraper">
      <mapDrag @drag="dragMap"></mapDrag>
    </div>
    <div id="dialog" v-if="dialog.index > 0">
      <div class="mask" :style="{'z-index':dialog.index}" v-if="!dialog.isToast"></div>
      <div v-for="item in dialog.data" :class="['dialog', item.type, item.class||''].join(' ')" :style="{'z-index':item.index}">
        <div class="title" v-if="item.title" >
          <span v-text="item.title"></span>
          <i class="icon-close"  v-if="!item.hideCloseBtn" @click="item.parent.cancelAndClose()"></i>
        </div>
        <div class="content" :style="item.style" v-if="item.content" v-html="item.content"></div>
        <div class="btns" v-if="item.btns">
          <div class="btnBorder" v-for="btn in item.btns" v-if="btn.value" :class="{primary:btn.primary, disabled:btn.disabled}" v-text="btn.value" @click="btn.action(item)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mapDrag from './components/mapDrag'
  export default {
    name: 'app',
    components: {
      mapDrag
    },
    data () {
      return {
        dragData: {
          lng: null,
          lat: null,
          address: null,
          nearestJunction: null,
          nearestRoad: null,
          nearestPOI: null
        },
        dialog : {
          show : false,
          index:0,
          data : [],
          app : null
        }
      }
    },
    methods: {
      dragMap (data) {
        this.dragData = {
          lng: data.position.lng,
          lat: data.position.lat,
          address: data.address,
          nearestJunction: data.nearestJunction,
          nearestRoad: data.nearestRoad,
          nearestPOI: data.nearestPOI
        }
      }
    },
    created() {
      this.dialog.nextTick = this.$nextTick;
      this.$common.dialog1.dialog = this.dialog;

    }
  }
</script>


<style lang="less" rel="stylesheet/less">
  @import "assets/css/var";
  @import "assets/css/style";
  body{ margin: 0; }

</style>
