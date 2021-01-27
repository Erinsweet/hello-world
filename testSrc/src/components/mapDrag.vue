<!--
  描述：拖放地图组件，默认尺寸是 500 * 300

  接收属性参数：
    lat: 纬度
    lng: 经度

  自定义事件：
    drag: 拖放完成事件

  示例：
    <mapDrag @drag="dragMap" lat="22.574405" lng="114.095388"></mapDrag>
-->
<template>
  <div>
    <div class="m-map">
      <div id="js-container" class="map">
        正在加载数据 ...
      </div>

    </div>
    <div  @click="testDialog">测试dialog</div>

    <div class="input_card"  @touchstart="touchstart" @touchend="touchend" :class="{'top_location':!isBottom}" >
      测试ing
      毛玻璃效果
      <div>{{$lang('userName')}}</div>
      <div>{{$lang('message')}}</div>----{{$t('status')}}
    </div>
    <div class="input_card1" ref="card"  @touchstart="touchstart" @touchend="touchend" :class="{'top_location':!isBottom}"></div>
  </div>
</template>

<script>
  import remoteLoad from '@/utils/remoteLoad.js'
  import { MapKey, MapCityName } from '@/config/config'
  import testData from  '@/mock.js'
  import dialog from "../utils/dialog";
  export default {
    props: ['lat', 'lng'],
    data () {
      return {
        searchKey: '',
        placeSearch: null,
        dragStatus: false,
        AMapUI: null,
        AMap: null,
        startY:0,
        isBottom:true,
        lang: 'zh-CN'
      }
    },
    watch: {
      searchKey () {
        if (this.searchKey === '') {
          this.placeSearch.clear()
        }
      }
    },
    mounted(){

    },
    methods: {
      setLang(lang){
        this.$common.setLang(lang);
        this.$forceUpdate();
      },
      testDialog(){
        if (this.lang === 'zh-CN') {
          this.lang = 'en-US'
          this.$i18n.locale = this.lang
        } else {
          this.lang = 'zh-CN'
          this.$i18n.locale = this.lang
        }
        console.log(211212,testData)
        //return
        //this.setLang('zh-cn');

        //this.setLang('en-us');
        // if (this.lang === 'zh-CN') {
        //   this.lang = 'en-US'
        //   this.$i18n.locale = this.lang
        // } else {
        //   this.lang = 'zh-CN'
        //   this.$i18n.locale = this.lang
        // }
        //return;
        let dialog = this.$common.dialog1, data={name:this.$lang('status')};
        alert(data.name)
        // dialog.loading();
         // dialog.toast('xww');
         //return
        dialog.open({
          title : '编辑任务名称',
          content : '<div>任务名称：</div>' +
                  '<textarea style="width:400px; height: 100px; resize: both;" placeholder="请在此输入任务名称" v-model="name">' +
                  '</textarea>',
          data : data,
          // type : "save",

          btns : [
            {
              value : '取消',
              action(obj){
                dialog.close();
              }
            },
            {
              value : '确认',
              primary : true,
              action(obj){
                dialog.close();
              }
            }
          ]
        })
      },
      touchstart(e) {
        console.log(1,e);
        e.preventDefault();//阻止默认事件（长按的时候出现复制）
        this.startY = e.touches[0].pageY;
      },
      touchend(e) {
        e.preventDefault();
        let endY = e.changedTouches[0].pageY;
        let dy = endY - this.startY;
        if (dy > 0 && !this.isBottom) {
          alert('top to bottom');
        } else if(dy < 0 && this.isBottom){
          alert('2')
        }else {
          return
        }
        this.isBottom = !this.isBottom;
      },
      // 搜索
      handleSearch () {
        if (this.searchKey) {
          this.placeSearch.search(this.searchKey)
        }
      },
      // 实例化地图
      initMap () {
          let dialog = this.$common.dialog1, data={name:''};
          //dialog.loading();
        // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        let AMapUI = this.AMapUI = window.AMapUI
        let AMap = this.AMap = window.AMap
        AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
            dialog.close();
          let mapConfig = {
            zoom: 16,
            cityName: MapCityName,
            lang: "en",
          }
          if (this.lat && this.lng) {
            mapConfig.center = [this.lng, this.lat]
          }
          let map = new AMap.Map('js-container', mapConfig)
          // 加载地图搜索插件
          AMap.service('AMap.PlaceSearch', () => {
            this.placeSearch = new AMap.PlaceSearch({
              pageSize: 5,
              pageIndex: 1,
              citylimit: true,
              city: MapCityName,
              map: map,
              panel: 'js-result',

            })
          })
          // 启用工具条
          // AMap.plugin(['AMap.ToolBar'], function () {
          //   map.addControl(new AMap.ToolBar({
          //     position: 'RB'
          //   }))
          // })
          // 创建地图拖拽
          let positionPicker = new PositionPicker({
            mode: 'dragMarker', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
            map: map // 依赖地图对象
          })
          // 拖拽完成发送自定义 drag 事件
          positionPicker.on('success', positionResult => {
            // 过滤掉初始化地图后的第一次默认拖放
            if (!this.dragStatus) {
              this.dragStatus = true
            } else {
              this.$emit('drag', positionResult);
              console.log(positionResult)
            }
          })
          // 启动拖放
          positionPicker.start()
        })
      }
    },
    async created () {
      // 已载入高德地图API，则直接初始化地图

      if (window.AMap && window.AMapUI) {
        this.initMap()
        // 未载入高德地图API，则先载入API再初始化
      } else {
        await remoteLoad(`http://webapi.amap.com/maps?v=1.3&key=${MapKey}&language=en`)
        await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
        this.initMap()
      }
    }
  }
</script>

<style lang="less" scoped>
@import "../assets/css/var.less";
  .m-map{
    height: 100vh;
    width: 100vh;
    .map{
      width: 100vh;
      height: 100vh;
    }

  }
  .input_card{
    position: absolute;
    background-color: white;
    filter: opacity(0.8);
    height: 40vh;
    width: 100vh;
    bottom: 0;
    border-radius: 20px 20px 0 0;
    z-index: 9999;
    font-weight: bold;
    .duration();

  }
  .top_location{
    top: 10px;
    height: 100%;
  }
.input_card1{
  position: absolute;
  height: 40vh;
  width: 100vh;
  bottom: 0;
  border-radius: 20px 20px 0 0;
  z-index: 998;
  .blur(3px);
}
</style>
