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
    <!--    <div class="m-map">-->
    <!--      <div id="js-container" class="map">-->
    <!--        正在加载数据 ...-->
    <!--      </div>-->

    <!--    </div>-->


    <div class="input_card" >
      测试ing
      毛玻璃效果
      <div  @click="testDialog">测试dialog</div>
      <div>{{$lang('userName')}}-2</div>
      <div>{{$lang('message')}}</div>----{{$t('status')}}
    </div>

    <div id="outer-box">
      <div id="container" tabindex="0"></div>
      <div id="panel" class="scrollbar1">
        <ul id="myList">
        </ul>
      </div>
    </div>
    <!--    <div class="input_card1" ref="card"  @touchstart="touchstart" @touchend="touchend" :class="{'top_location':!isBottom}"></div>-->
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

      ConvertDegreesToRadians(degrees){
        return degrees * Math.PI / 180;
      },

      ConvertRadiansToDegrees(radian){
        return radian * 180.0 / Math.PI;
      },

      HaverSin(theta){
        let v = Math.sin(theta / 2);
        return v*v
      },

      getDistance(latitude1,longitude1,latitude,longitude){
        let app = this;
        let lat1 = app.ConvertDegreesToRadians(latitude1),
                lon1 = app.ConvertDegreesToRadians(longitude1),
                lat2 = app.ConvertDegreesToRadians(latitude),
                lon2 = app.ConvertDegreesToRadians(longitude),
                vLon = Math.abs(lon1 - lon2),
                vLat = Math.abs(lat1 - lat2),
                h = app.HaverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * app.HaverSin(vLon);
        return Math.round(12742 * Math.asin(Math.sqrt(h)) * 1000);
      },
      testDialog(){
        let d =this.getDistance1(40.22077,116.23128,34.23053,108.93425)
        console.log(99999,d)
        let dialog = this.$common.dialog1,app=this;
        let imgSrc = require('../assets/img/map.png');
        dialog.open({
          // type:"tip",
          title : '',
          hideCloseBtn:this.show,
          content : '<div @click="test">暂时部署不足hiuhiuhohggygilo;<br></div>',
          data :{
            imgSrc:imgSrc,
            show: true
          },
          methods:{
            test(){
              console.log(12,this);
              this.show = false;
              // this.parent.close();

            }
          },
          isFull: true,
          btns : [
            {
              value : '取消',
              action(obj){
                dialog.close();
              }
            }
          ]
        })
      },
      // 搜索
      handleSearch () {
        if (this.searchKey) {
          this.placeSearch.search(this.searchKey)
        }
      },

      // 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
      getDistance1(lat1, lng1, lat2, lng2) {
        function rad(degrees) {
          return degrees * Math.PI / 180;
        };
        var radLat1 = rad(lat1);
        var radLat2 = rad(lat2);
        var a = radLat1 - radLat2;
        var b = rad(lng1) - rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里

        var distance = s;
        var distance_str = "";

        if (parseInt(distance) >= 1) {
          distance_str = distance.toFixed(1) + "km";
        } else {
          distance_str = distance * 1000 + "m";
        }

        //s=s.toFixed(4);

        console.info('lyj 距离是', s);
        console.info('lyj 距离是', distance_str);
        return s;
      },

      initMap(){
        let AMapUI = this.AMapUI = window.AMapUI
        let AMap = this.AMap = window.AMap;
        var map = new AMap.Map('container', {
          zoom: 9
        });
        AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'], function(MarkerList) {
          //启动页面
          initPage(MarkerList);
        });
        function initPage(MarkerList) {
          //创建一个实例
          var markerList = new MarkerList({
            map: map, //关联的map对象
            listContainer: document.getElementById("myList"), //列表的dom容器的节点或者id, 用于放置getListElement返回的内容
            getDataId: function(dataItem, index) {
              //返回数据项的Id
              return dataItem.id;
            },
            getPosition: function(dataItem) {
              //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
              return dataItem.position;
            },
            getMarker: function(dataItem, context, recycledMarker) {
              var content = '标注: ' + (context.index + 1) + '',
                      label = {
                        offset: new AMap.Pixel(16, 18),
                        content: content
                      };
              if (recycledMarker) {
                //存在可回收利用的marker,直接setLabel返回
                recycledMarker.setLabel(label);
                return recycledMarker;
              }
              //返回一个新的Marker
              return new AMap.Marker({
                label: label
              });
            },
            getInfoWindow: function(dataItem, context, recycledInfoWindow) {
              var tpl = '<p><%- dataItem.id %>：<%- dataItem.desc %><p>';
              //MarkerList.utils.template支持underscore语法的模板
              var content = MarkerList.utils.template(tpl, {
                dataItem: dataItem,
                dataIndex: context.index
              });
              if (recycledInfoWindow) {
                //存在可回收利用的infoWindow, 直接setContent返回
                recycledInfoWindow.setContent(content);
                return recycledInfoWindow;
              }
              //返回一个新的InfoWindow
              return new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -23),
                content: content
              });
            },
            getListElement: function(dataItem, context, recycledListElement) {
              var tpl = '<p><%- dataItem.id %>：<%- dataItem.desc %><p>';
              var content = MarkerList.utils.template(tpl, {
                dataItem: dataItem,
                dataIndex: context.index
              });
              if (recycledListElement) {
                //存在可回收利用的listElement, 直接更新内容返回
                recycledListElement.innerHTML = content;
                return recycledListElement;
              }
              //返回一段html，MarkerList将利用此html构建一个新的dom节点
              return '<li>' + content + '</li>';
            }
          });
          //监听选中改变
          markerList.on('selectedChanged', function(event, info) {});

          //监听Marker和ListElement上的点击，详见markerEvents，listElementEvents
          markerList.on('markerClick listElementClick', function(event, record) {});

          //构建数据源，数据项本身没有格式要求，但需要支持getDataId和getPosition
          var data = [{
            id: 'A',
            position: [116.020764, 39.904989],
            desc: '数据_1'
          },
            {
              id: 'B',
              position: [116.405285, 39.904989],
              desc: '数据_2'
            },
            {
              id: 'C',
              position: [116.789806, 39.904989],
              desc: '数据_3'
            }];
          //绘制数据源，Let's go!
          markerList.render(data);

          //清除数据
          //markerList.render([]);

        }
      },
      // 实例化地图
      initMap1 () {
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
          positionPicker.start();


        })
      }
    },
    async created () {
      // 已载入高德地图API，则直接初始化地图

      // if (window.AMap && window.AMapUI) {
      //   this.initMap()
      //   // 未载入高德地图API，则先载入API再初始化
      // } else {
      //   await remoteLoad(`http://webapi.amap.com/maps?v=1.3&key=${MapKey}`)
      //   await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
      //   this.initMap()
      // }
    }
  }
</script>
<style lang="less">
  .shareImg{
    position: absolute;
    top: 120%;
    >img{
      height: 30px;
      width: 100px;
    }
  }
  .testImg{
    background-color:rebeccapurple;
    width: 300px;
    height: 200px;
    .btns .btnBorder{
      color: #67c23a;
    }
    .bt{
      position: absolute;
      bottom: 0;
    }
  }
</style>
<style lang="less" scoped>
  #container{
    height:100%;
    width:100%;
  }
  .amap-icon img{
    width: 25px;
    height: 34px;
  }
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
