<template>
  <a tabindex="0" @touchmove.stop="" :class="'select ' + type + (multiple ? ' multiple' : '') + (float ? ' float' : '')" ref="target" @click.stop="" @focus="setCss" @blur="blur">
    <template v-if="$common.browser.os.isMobile">
      <label>
        <div class="input">{{items[xVal]}}<div v-if="!items[xVal]">{{placeholder}}</div></div>
        <div class="items">
          <select v-model="xVal" ref="xSelect" @blur="xChange" @change="xChange">
            <template v-if="length">
              <option v-for="(a,b) in items" :value="b">{{a}}</option>
            </template>
          </select>
        </div>
      </label>
      <a class="clean" v-if="canEmpty && !$common.empty(xVal) && items[xVal]" @click="()=>{xVal=null;xChange()}"></a>
    </template>
    <template v-else>
      <template v-if="type != 'list' && type != 'input'">
        <ul class="input" v-if="multiple">
          <li v-for="v in val" >{{items[v]}}</li>
          <div>{{placeholder}}</div>
        </ul>
        <div class="input" v-else>{{items[val[0]]}}<div v-if="!items[val[0]]">{{placeholder}}</div></div>
      </template>
      <ul class="options" ref="options" :style="css">
        <template v-if="float && type == 'input'">
          <template v-if="multiple">
            <li v-for="(v,k) in items" :style="{width:w}" :class="{active:val.indexOf(k) != -1, disable: disable.indexOf(k) != -1}" @click="check(k)">{{v}}</li>
          </template>
          <template v-else>
            <li v-for="(v,k) in items" :style="{width:w}" :class="{active:val.indexOf(k) != -1, disable: disable.indexOf(k) != -1}" @click="select(k)">{{v}}</li>
          </template>
        </template>
        <vue-scroll v-else :ops="{bar: {keepShow: true}}">
          <template v-if="multiple">
            <li v-for="(v,k) in items" :class="{active:val.indexOf(k) != -1, disable: disable.indexOf(k) != -1}" @click="check(k)">{{v}}</li>
          </template>
          <template v-else>
            <li v-for="(v,k) in items" :class="{active:val.indexOf(k) != -1, disable: disable.indexOf(k) != -1}" @click="select(k)">{{v}}</li>
          </template>
        </vue-scroll>
      </ul>
      <p @touchmove.prevent @click="$refs.target.blur()"></p>
    </template>
  </a>
</template>

<script>
  export default {
    name: "select",
    data(){
      return{
        xVal : "",
        height : 0,
        items : {},
        val : [],
        css : {},
        oldOptions : '',
        length : 0
      }
    },
    computed:{
    },
    mounted(){
      this.target = this.$refs.options
    },
    props : {
      canEmpty:{
        type:Boolean,
        default:false,
      },
      options: [Array, Object],
      value : {
        type : [String, Number, Array],
        default(){
          return [];
        }
      },
      multiple : {
        type: Boolean,
        default: false
      },
      float : {
        type: Boolean,
        default: false
      },
      placeholder : [String],
      disable:{
        type : Array,
        default(){
          return []
        }
      },
      size : {
        type : [Number, String],
        default : 10
      },
      margin : {
        type : [Number, String],
        default : 60
      },
      type : {
        type: String,
        default: 'default' // {default : 类似原生 select 组件,  list : 列表样式}
      },
      palette : {
        type : String,
        default : 'document'
      },
      w : {
        type : String,
        default:'auto'
      },
      label:{},
      /*onFocus:{
        type : Function,
        default(){}
      },*/
    },
    methods : {
      empty(data) {
        if(data === null || data === undefined){
          return true;
        }
        switch (typeof data) {
          case 'object':
            let e = true;
            for (let i in data) {
              e = false;
              break;
            }
            return e;
          case 'string':
            return data.trim() == '';
          default:
            try {
              return (data+"").length == 0
            }catch (e) {
              return false
            }
        }
      },
      init(){
        let app = this;
        app.setOptions(app.options);
        app.$nextTick(()=>{
          //app.setCss();
          app.setVal(app.value);
          app.$forceUpdate();
        })
      },
      setVal(value){
        let app = this;
        Array.isArray(value) || (value = [value]);
        for(let i in value){
          value[i] += ''
        }
        app.val = value;
        app.xVal = value[0]||"";
        return app;
      },
      setOptions(options, a,b){
        if(!options) options=[];
        let app = this;
        let no = JSON.stringify(options);
        /*if(no == app.oldOptions){
          return app;
        }*/
        app.oldOptions = no;
        if(Array.isArray(options) && options.length){
          app.items = {};
          if(typeof options[0] == "object" && typeof options[0].value != "undefined"){
            options.forEach(opt=>{
              let k = opt.value;
              app.items[k] = opt.option || k;
            })
          }else{
            options.forEach((opt, k)=>{
              app.items[k] = opt;
            })
          }
        }else if(typeof options == "object"){
          app.items = Object.assign({}, options);
        }
        app.length=Object.keys(app.items).length;
        /*
        app.$nextTick(()=>{
          if(app.$lt.browser.os.isMobile && app.$refs.xSelect){
            document.body.focus();
            setTimeout(()=>{
              app.$refs.xSelect.focus();
            },1000);
          }
        })
        */
        return app;
      },
      setCss(){
        let app = this;
        if(app.$common.browser.os.isMobile) return false;
        if(!(app.length>0)) return false;
        let bom = app.$refs.target, css = {};
        function getStyle(element) {
          if(window.getComputedStyle){
            return window.getComputedStyle(element,null) || {};
          }else {
            return element.currentStyle || {};
          }
        }
        app.css = {
          height:0,
        };

        setTimeout(()=>{
          let opt = app.$refs.options, height = opt.getElementsByTagName("li")[0].offsetHeight;
          let ps = opt.offsetParent, end = null, inTable=false;
          while (ps && !end)
          {
            let s = getStyle(ps);
            if(!inTable){
              inTable = ps.attributes.ltTable != undefined;
            }
            switch (s.position) {
              case "absolute":
              case "relative":
                switch (s.overflow) {
                  case "hidden":
                  case "scroll":
                  case "auto":
                    end = ps;
                    break;
                }
                break;
            }
            ps = ps.offsetParent;
          }
          if(end == null) end = document.body;
          let c = (inTable ? 200 : 100),
            size = parseInt(app.size) || 8,
            oh = opt.offsetHeight,
            op = app.$common.getObjPos(opt, true),
            pp = app.$common.getObjPos(end),
            dt = op.y - pp.y - 50,
            dd = pp.y + end.offsetHeight - (inTable ? 100 : 0) - op.y - oh - 50,
            dl = op.x - pp.x,
            ml = 0, mt = 0;
          height = Math.min(Math.min(size, app.length) * height, Math.max(height * 3, end.offsetHeight - c));
          let z = (height - oh) / 2;

          if(dl < 10){
            ml = '10px';
          }
          if(z > dt){
            mt = z-dt + 'px';
          }

          if(z > dd){
            mt = dd - z + 'px';
          }
          app.css = {
            height : height + 2 + "px",
            marginTop: mt,
            marginLeft: ml,
          };
        }, 1);
      },
      check(k){
        let app = this, s = app.val.indexOf(k);
        if(s == -1){
          app.val.push(k);
        }else{
          app.val.splice(s, 1);
        }
        //过滤null的字符串
        let array = app.val.filter(item => item!='null');
        app.$emit('input', array);
        app.$emit('change', array);
      },
      xChange(){
        let app = this, nv = app.$refs.xSelect.value, v= app.xVal;
        if(v !== null && app.items[v] == undefined){
          v = app.xVal = ""
        }
        if(nv === ""){
          nv = Object.keys(app.items)[0]||"";
        }
        if(v !== null){
          v = nv;
          app.xVal = nv;
        }
        if(!isNaN(v) && v !== null){
          v = Number(v);
        }
        app.$emit('input', v);
        app.$emit('change', v);
      },
      /*xFocus(){
        let app = this;
        app.onFocus(app);
        setTimeout(()=>{
          let s = app.$refs.xSelect, v = s.options[Math.max(0, s.selectedIndex)].value;
          if(app.xVal != v){
            app.xVal = v;
            app.xChange();
          }
        })
      },*/
      select(k){
        let app = this;
        if(app.val.indexOf(k) == -1){
          app.val.splice(0,1, k)
        }else if(app.canEmpty){
          app.val.splice(0,1);
        }
        let v = app.val[0];
        if(!isNaN(v)){
          v = Number(v);
        }
        app.$emit('input', v);
        app.$emit('change', v);
        app.$refs.target.blur();
      },
      blur(){
        let app = this, val, show;
        if(app.$common.browser.os.isMobile) {
          if(app.xVal == ""){
            app.xVal = Object.keys(app.items)[0] || ""
            app.xChange();
          }
          return false;
        }
        if(app.multiple){
          val = app.val;
          show = [];
          val.forEach(v=>{
            show.push(app.items[v]);
          })
        } else {
          val = app.val[0];
          show = app.items[val];
        }
        app.$emit('blur', val);
        app.$emit('show', show);
        /*
        app.$emit('sync', {
          value : val,
          options : app.items
        })
        */
      }
    },
    created(){
      this.init();
    },
    /*
    mounted(){
      let p = this.$el.parentNode;
      if(p){
        let tags = [];
        console.log(p.innerHTML)
        p.innerHTML.match(/^<(.*?)>/)[0].replace(/data-v-([a-zA-Z0-9]+)/g, a => {
          tags.push(a);
        });
        if(tags.length > 1){
          let target = tags.shift();
        }

        console.log(tags)
      }

    },*/
    watch:{
      targetStyle:{
        handler(v){
          console.log(v);
        },
        deep:!!1
      },
      "value"(val){
        (Array.isArray(val) ? JSON.stringify(val) != JSON.stringify(this.val) : val != this.val[0]) && this.setVal(val).$forceUpdate();
      },
      "options"(val){
        JSON.stringify(val) != this.oldOptions && this.setOptions(val).$forceUpdate();
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "../../css/var";
  .select{
    padding: 0;
    position: relative;
    >label{
      display: block; position: relative;
      >div.items{
        position: absolute; width: 100%; height: 100%; top: 0; -khtml-opacity: 0;opacity: 0;
        >select{
          width: 100%; height: 28px;
        }
      }
      &+a.clean{
        position: absolute;
        z-index: 2;
        display: block;
        top: 0;
        left: 100%;
        background: #FFF;
        width: 30px;
        height: 30px;
        margin-right: -30px;
        line-height: 30px;
        text-align: center;
        border-radius: 30px;
        &:before{
          position: absolute;
          left: -30px;
          top:-10px;
          width: 50px;
          height: 50px;
          box-sizing: border-box;
          content: "";
          display: block;
        }
        &:after{
          .Icon("\e60e");
        }
      }
    }
    >p{
      display: none;
    }
    .inputBox(){
      .input(.3rem);
      cursor: pointer;
      line-height: .28rem;
      position: relative;
    }
    div.input{
      .inputBox();
      padding: 0 1.5em 0 .5em;
      .sl();
      div{
        .sl();
        color: @disable;
      }
    }
    ul.input{
      .inputBox();
      background-color: #FFF;
      height: auto;
      min-height: .3rem;
      overflow: visible;
      font-size: 0;
      line-height: 0;
      padding: 0 20px 0 4px;
      white-space: unset;
      .duration(200ms);
      >li{
        font-size: 14px;
        line-height: 16px;
        height: 16px;
        .sl();
        margin: 3px;
        display: inline-block;
        padding: .3em;
        background-color: @themeColor;
        color: @lightFontColor;
        border-radius: .03rem;
        & + div{
          display: none;
        }
      }
      >div{
        font-size: 14px;
        line-height: .28rem;
        .sl();
        color: @disable;
      }
    }

    .input + ul.options{
      position: absolute;
      display: none;
      width: 100%;
      max-width: 100%;
      background-color: #FFF;
      box-sizing: border-box;
      border: solid 1px @borderColor;
      z-index: 999;
      border-radius: .03rem;
      overflow: hidden;
      top:50%;
      .translate(-10px, -50%);
      /deep/.__view{
        max-width: 100%;
      }
      /deep/li{
        &.label{display: none;}
        .sl();
        max-width: 100%;
        padding: 0 10px;
        cursor: pointer;
        line-height: 30px;
        font-size: 14px;
        &.active{
          background-color: rgba(0,0,0,.1);
          box-shadow: inset 0 0 1px rgba(0,0,0,.25);
          color: @themeColor;
          &:hover{
            color: @themeColor;
          }
        }
        &.disable{
          color: @disable;
          pointer-events: none;
        }
        &:hover{
          color: @themeColor;
        }
      }
    }
    &:hover {
      &:after {
        color: @themeColor;
      }
    }
    &:focus{
      &:after {
        color: @disable;
      }
      .input + ul.options{
        display: block;
      }
      .input{
        border-color: @themeColor;
      }
    }
    &.default {
      .input + ul.options{
        //top: 50%;
        //.translate(-10px);
        border-radius: 5px;
        box-shadow: 1px 1px 8px #CCC;
      }
      ul.input + ul.options{
        //top: 15px;
        //.translate(-10px);
      }
    }

    &.list{
      border: solid 1px @borderColor;
      border-radius: .03rem;
      ul.options{
        overflow: hidden;
        li{
          padding: 0 .5em;
          cursor: pointer;
          &.active{
            background-color: fade(@borderColor, 70%);
          }
        }
      }
    }
    &.input{
      border: solid 1px @borderColor;
      border-radius: .03rem;
      ul.options{
        overflow: hidden;
        padding: @vSpace / 3 0;
        li{
          padding: 0 @vSpace / 3 * 2;
          cursor: pointer;
          &:before{
            .duration(500ms);
            @_width:14px;
            content: '';
            line-height: 0;
            vertical-align: middle;
            display: inline-block;
            width: @_width;
            height: @_width;
            box-sizing: border-box;
            border: solid 1px @themeColor;
            border-radius: @_width;
            position: relative;
            top: -0.1em;
            margin-right: .05rem;
          }
          &.active:before{
            .duration(100ms);
            background: @themeColor;
            box-shadow: inset 0 0 0 2px #ffffff;
          }
        }
      }
      &.multiple{
        ul.options{
          li:before{
            border-radius: 2px;
            background: 0 -1px no-repeat;
          }
          li.active:before{
            .duration(500ms);
            border-color: transparent;
            background: @themeColor url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjE0Ni42MHB4IiB2aWV3Qm94PSIwIDAgMTM5NyAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyODkuMjcyNzI2OTUgMTY4LjM2MzYzNjUzYzAgMC0xOTYuMzYzNjM2NTMgNjUuNDU0NTQ1MjEtNDI1LjQ1NDU0NTIxIDMyNy4yNzI3MjY5NS0yMTIuNzI3MjczMDUgMjM3LjI3MjcyNjk1LTI2MS44MTgxODE3NCAzMzUuNDU0NTQ1MjEtMzQzLjYzNjM2MzQ4IDQ2Ni4zNjM2MzY1MkM1MTIgOTUzLjgxODE4MTc0IDM4OS4yNzI3MjY5NSA3MTYuNTQ1NDU0NzkgNjIgNTQ0LjcyNzI3MzA1bDE3MS44MTgxODE3NC0xNjMuNjM2MzYzNDdjMCAwIDE1NS40NTQ1NDUyMSAxMDYuMzYzNjM2NTIgMjYxLjgxODE4MTc0IDMwMi43MjcyNzMwNCAwIDAgMjcwLTQxNy4yNzI3MjY5NSA3OTMuNjM2MzYzNDctNjIxLjgxODE4MTc0TDEyODkuMjcyNzI2OTUgMTY4LjM2MzYzNjUzIDEyODkuMjcyNzI2OTUgMTY4LjM2MzYzNjUzek0xMjg5LjI3MjcyNjk1IDE2OC4zNjM2MzY1MyIgZmlsbD0iI2ZmZmZmZiIgLz48L3N2Zz4=") 0 -1px no-repeat;
            background-size: cover;
            box-shadow:none;
          }
        }
      }
    }
    &.list.float,&.input.float{
      border: none;
      ul.options{
        padding: 0;
        border: none;
        position: relative;
        li{
          float: left;
          padding: 0;
          .sl();
          margin-right: @vSpace;
        }
        &:after{
          content: '';
          clear: both;
          height: 0;
          display: block;
          overflow: hidden;
        }
      }
    }
    &:after{
      position: absolute;
      top: 50%;
      right: 0;
      display: block;
      width: .24rem;
      height: .3rem;
      margin-top: -.15rem;
      line-height: .3rem;
      pointer-events: none;
      overflow: hidden;
      .Icon('\e607');
      color: @tableBorderColor;
      font-size: 20px;
    }
    &.multiple:after{
      .Icon('\e693');
    }
  }
  @media screen and (max-width: 480px){
    .select{
      &.default .input + ul.options,
      &.default ul.input + ul.options,
      .input + ul.options{
        //display: none !important;
      }
      &:focus{
        >p{
          display: block;
        }
      }
      >p{
        position: fixed;
        top:0;
        bottom: 0;
        z-index: 1998;
        background: rgba(0,0,0,.175);
        left: 0;
        right: 0;
      }
      &.default >.input + ul.options,
      >.input + ul.options{
        position: fixed;
        bottom: 10px;
        z-index: 1999;
        border-bottom: none;
        left: 0;
        right: 0;
        top:auto;
        margin-left: 0 !important;
        margin-top: 0 !important;
        .translate(0,0);
        border-radius: 0;
        box-shadow: 0 10px 0 0 #FFF;
        /deep/li{
          font-size: 1.2em;
          text-align: center;
          line-height: 2;
        }
      }
    }
  }
</style>
