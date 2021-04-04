<template>
  <div id="app">
<!--    <div id="myChart" ref="chart" :style="{width: '300px', height: '300px'}"></div>-->
<!--    <echarts :option="options"></echarts>-->
<!--  <set-auth></set-auth>-->
    <loading></loading>
<!--    <set-switch @change="changeValue"  v-model="status"></set-switch>-->
<!--    <div>-->
<!--    我们提供这些选项和设置，旨在让您能够控制数据的使用和访问访问方式-->
<!--      <div>-->
<!--        <a>全部授权</a>-->
<!--        <set-switch @change="changeAll" v-model="status"></set-switch>-->
<!--      </div>-->
<!--      <div v-for="(item,index) in list">-->
<!--        <a>授权{{index}}</a>-->
<!--        <set-switch @change="val=>{changeValue(val, index)}"  v-model="list[index]"></set-switch>-->
<!--      </div>-->
<!--    </div>-->

  </div>
</template>

<script>
  import setAuth from './components/auth'
  import setSwitch from './components/switch'
  import echarts from './components/echarts'
  export default {
    name: 'app',
    components: {
      setAuth,
      setSwitch,
      echarts
    },
    data () {
      return {
        list:[0,0,0,0,0],
        status: false,
        options:{},
        obj : {
          show : false,
          index:0,
          data : [],
          app : null
        }
      }
    },
    mounted(){
     // this.dialog.nextTick = this.$nextTick;
      this.$common.loading.loading = this.obj;
      console.log(1111,this.$common.loading.loading)
     // this.$common.loading.open('loading');
      if(this.$common.loading.loading.data.length){
        alert(11)
        this.$common.loading.close()
      }
      this.options ={
        title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      };
      return
      this.drawLine()
    },
    methods: {
      changeValue(val,index){
       console.log(111,val,index,this.list);
       let result = this.list.some(v=> !v )
       this.status = !result
      },
      changeAll(val){
       for (let i=0;i<this.list.length;i++){
         this.$set(this.list,i,val)
       }
        console.log(this.list)
      },
      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let chart = this.$refs.chart;
        let myChart = this.$echarts.init(chart);
        // 绘制图表
        myChart.setOption(this.options);
      }
    },
    created() {
    }
  }
</script>


<style lang="less" rel="stylesheet/less">
  @import "assets/css/var";
  @import "assets/css/style";
  @import "assets/css/dialog";
  body{ margin: 0; }
  .switch {
    position: absolute;
    right: 0;
  }
</style>
