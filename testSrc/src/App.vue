<template>
  <div id="app">
  <div class="test">
    <div class="content">
      <div class="left">
        <div>1111111</div>
        <div>22</div>
      </div>
      <div class="title">
        <div class="text">111</div>
        <div class="box">测试uidiqdiq</div>
      </div>
    </div>

  </div>

  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {

    },
    data () {
      return {

      }
    },
    mounted(){
      // let url = "/getData?callback=getData";
      // let url = "http://ksat.luxshare-ict.com/meterialdetect";

      this.$axios({
        method: 'post',
        url: "/api/javascript-api/guide/abc/plugins",
        data: {
          name: 'cedric',
        }
      })

    },

    created() {
    }
  }
</script>


<style lang="less">
  .test{
    position: fixed;
    height: 5rem;
    width: 100%;
    .content {
      position: relative;
      .left {
      display: flex;
      }
      .title {
        top: 0;
        position: absolute;
        right: 20px;
        text-align: right;
        .box {
         float: right;
        }
      }
    }


  }


</style>
