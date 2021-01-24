<template>
    <div id="dialog">
        <ul v-for="opt in dialog.opts" v-if="Object.keys(dialog[opt]).length" :class="opt">
            <li v-for="item in dialog[opt]" v-show="!item.hide" :class="item.tag.join(' ') + (item.isFull ? ' full' : '')" :style="{width : item.width, height:item.height, padding:item.padding}" :id="item.id" @mouseenter="dialog.stopTimer[opt] && (timer=0)" @mouseleave="timer=1">
                <span v-if="item.css" v-html="'<style>' + item.css + '</style>'"></span>
                <i class="dialog_icon icon-icon"></i>
                <div class="dialog_title" v-if="item.title&&item.title.content">
                    <p :style="item.title.style">{{item.title.content}}</p>
                </div>
                <a class="dialog_close_btn icon-close" @click="item.close()"></a>
                <div class="dialog_content" :style="item.content.style" v-html="item.content.content"></div>
                <div class="dialog_btn" :style="item.btns.style" v-if="item.btns&&item.btns.items">
                    <a v-for="btn in item.btns.items" v-if="(btn.auth ? $auth(btn.auth, btn.codeAuth !== false) : 1) && btn.value && !btn.hide" :class="{primary:btn.primary, disabled:btn.disabled}" :style="btn.style" @mouseup="btn.action(item, btn)">{{btn.value}}</a>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import Vue from "vue";
    let key = 1;
    export default {
        //name: "switch",
        data(){
            return {
                body : document.body,
                timer : 1,
                history : [],
                loadingNum : 0,
                dialog : {
                    show : false,
                    index:0,
                    opts : ["alert", "loading", "error", "message", "toast"],
                    stopTimer : {error:1, message:1},
                    error:{},
                    message:{},
                    toast:{},
                    alert:{},
                    loading:{},
                    data : {},
                    length : 0,
                    app : null,
                },
                export : {}
            }
        },
        methods:{
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
            each(data, cb) {
                if (this.empty(data)){
                    return;
                }
                if (typeof cb != "function") return;
                if (typeof data != "object") return cb(data, 0);
                for (let i in data) {
                    if (cb(data[i], i) === false) {
                        break;
                    }
                }
            },
            open(options, callback){
                let app = this;
                console.log(88,this.dialog)
                switch (typeof options) {
                    case "object":
                        if(Array.isArray(options)){
                            options = {
                                type : "alert",
                                content : "<ul><ol>" + options.join("</ol><ol>") + "</ol></ul>",
                                btns : [
                                    {
                                        value : "确定",
                                        action(item){
                                            item.close();
                                        }
                                    }
                                ]
                            }
                        } else {
                            options.type = options.type || "alert";
                            options.content = options.content || "未定义content";
                        }
                        break;
                    case "string":
                        options = {
                            type : "alert",
                            content : options,
                            btns : [
                                {
                                    value : "确定",
                                    action(item){
                                        item.close();
                                    }
                                }
                            ]
                        }
                        break;
                }
                let id = 'dialog_' + ++key;
                options.id = id;
                options.isFull = !!options.isFull;
                options.hide = !!options.hide;
                if(typeof options.content != "object"){
                    options.content = {
                        style:null,
                        content : options.content
                    }
                }
                if(typeof options.data != "object") options.data = {}
                let porps = ` :dialog="dialog"`;
                for(let i in options.data){
                    porps += ` :${i}="${i}"`
                }
                porps += ">"
                options.content.content = `<div id="${id}_content">${options.content.content.replace(/^(<.*?)(>)(.*)/, "$1" + porps + "$3")}</div>`;
                options.title || (options.title = null);
                options.btns || (options.btns = null);
                options.width || (options.width = null);
                options.app = null;
                if(options.title != null && typeof options.title != "object"){
                    options.title = {
                        style : null,
                        content : options.title
                    }
                }
                if(Array.isArray(options.btns)){
                    options.btns = {
                        style : null,
                        items : options.btns
                    }
                }else if(options.btns == null || typeof options.btns != "object"){
                    options.btns = {}
                }
                if((options.btns.items||[]).length == 1){
                    options.btns.items[0].primary = !0;
                }
                if(options.css){
                    options.css = ('}' + options.css.replace(/[\n\r\t]+/g, '').replace(/{ +/g, '{').replace(/ +}/g, '}')).replace(new RegExp("}((?!#" + id +"[ {]).*?{)", "g"), "}#dialog #" + id + " $1").substring(1)
                    //options.content = `<style>${options.css}</style>`
                }
                switch (typeof options.tag) {
                    case "string":
                        options.tag = [options.tag]
                        break;
                    case "object":
                        if(!Array.isArray(options.tag)){
                            options.tag = []
                        }
                        break;
                    default:
                        options.tag = [];
                        break;
                }
                if(options.type == "loading"){
                    app.loadingNum++
                }
                if(options.type == "alert"){
                    //document.body.style.overflow="hidden"
                    if (options.btns.items !== null && (!Array.isArray(options.btns.items) || options.btns.items.length == 0)){
                        options.btns = [
                            {
                                value : "确定",
                                action(item){
                                    item.close();
                                }
                            }
                        ]
                    }
                }
                //向下兼容老版
                if(Array.isArray(options.btns.items)){
                    options.btns.items.forEach((b,k)=>{
                        options.btns[k] = b;
                    })
                }

                options.close = cb=>{
                    if(0 && options.type == "loading"){
                        setTimeout(()=>{
                            if(--app.loadingNum <= 0){
                                delete app.history[options.id];
                                app.$delete(app.dialog[options.type], options.id);
                                typeof cb == "function" && cb(options);
                            }
                        }, 50)
                    }else{
                        delete app.history[options.id];
                        app.$delete(app.dialog[options.type], options.id);
                        if(options.type == 'alert' && this.empty(app.dialog.alert)){
                            //document.body.style.overflow="auto"
                        }
                        typeof cb == "function" && cb(options);
                    }
                    return options.parent || options;
                };
                options.open = (a,b)=>{
                    let cd = app.open(a,b);
                    cd.parent = options;
                    return cd;
                };
                options.loading = app.loading;
                options.toast = app.toast;
                options.error = app.error;
                options.clean = app.clean;
                options.alert = app.alert;
                options.confirm = app.confirm;
                options.message = app.message;
                options.info = app.info;
                options.column = app.column;
                options.replace = (a,b)=>{
                    return options.close().open(a, b);
                };
                app.dialog = {
                    show : false,
                        index:0,
                        opts : ["alert", "loading", "error", "message", "toast"],
                        stopTimer : {error:1, message:1},
                    error:{},
                    message:{},
                    toast:{},
                    alert:{},
                    loading:{},
                    data : {},
                    length : 0,

                };
                app.history =[]
                //return
               // app.dialog = {}
                Vue.set(app.dialog[options.type], id, options);
                // app.$set(app.dialog[options.type], id, options);
                let item = app.dialog[options.type][id];
                console.log(111111,this,item)
                Vue.nextTick(()=>{
                // app.$nextTick(()=>{
                    id = item.id+"_content";
                    if(document.getElementById(id)) {
                        let data = item.data || {};
                        data.dialog = item;
                        item.vue = new Vue({
                            el : '#' + id,
                            data : data,
                            methods : item.methods || {},
                            components : item.components || {},
                            mounted : item.mounted || (()=>{}),
                            created : item.created || (()=>{}),
                        });

                        item.vue.$nextTick(()=>{
                            if(item.type == "alert"){
                                if(item.width === null){
                                    let $dom = document.getElementById(id), w = $dom.offsetWidth;

                                    let tz = ()=>{
                                        let h = $dom.offsetHeight;
                                        if(w / h > 3.75){
                                            w = Math.max(300, Math.floor(w * .95 / 15)*15);
                                            $dom.style.width = w + "px";
                                            w > 300 && tz();
                                        }
                                    };
                                    w > 300 && tz();
                                }
                            }
                            typeof callback == "function" && callback(options);
                            if(item.showTime > 0){
                                let len = item.showTime, timer = setInterval(()=>{
                                    len-=app.timer;
                                    if(len <= 0){
                                        clearInterval(timer);
                                        item.close();
                                    }
                                }, 1000);
                            }
                        })
                    }
                });

                app.history[item.id] = item;
                return item;
            },
            loading(content,data){
                return this.open({type:"loading", content:content||'loading', data:data});
            },
            toast(content,showTime){
                return this.open({type:"toast", content:content||'', showTime:showTime>0 ? showTime : 5});
            },
            error(content,showTime){
                return this.open({type:"error", content:content||'error', showTime:showTime>=0 ? showTime : 30});
            },
            message(content,showTime){
                return this.open({type:"message", content:content||'error', showTime:showTime>=0 ? showTime : 5});
            },
            info(content,showTime){
                return this.message(content,showTime);
            },
            alert(content,ok,title){
                return this.open({
                    type:"alert",
                    title : title,
                    content:content||'alert',
                    btns : [
                        {
                            value: "确定",
                            primary : true,
                            action(item, btn) {
                                typeof ok == "function" ? ok(item, btn) : item.close();
                            }
                        }
                    ]
                });
            },
            confirm(content,ok,cancel){
                return this.open({
                    type:"alert",
                    content:content.content || content||'confirm',
                    title : content.title || null,
                    btns : [
                        {
                            value : "取消",
                            action(item, btn){
                                typeof cancel == "function" ? cancel(item, btn) : item.close();
                            }
                        },
                        {
                            value: "确定",
                            primary : true,
                            action(item, btn) {
                                typeof ok == "function" ? ok(item, btn) : item.close();
                            }
                        }
                    ]
                });
            },
            close(id, cb){
                let app = this, item;
                if(typeof id == "function"){
                    cb = id;
                    item = app.pop();
                }else if(id){
                    item = app.history[id.toString()];
                }else{
                    item = app.pop();
                }
                return item ? item.close(cb) : app.export;
            },
            pop(){
                let app = this, o = Object.keys(app.history);
                if(o.length == 0){
                    return null;
                }
                return app.history[o.pop()];
            },
            clean(){
                let app = this;
                this.each(app.history, item=>{
                    item.close();
                });
                return app.export;
            },
        },
        created(){
            let app = this;
            app.export = app.$common.dialog = {
                open : app.open,
                loading : app.loading,
                toast : app.toast,
                error : app.error,
                message : app.message,
                confirm : app.confirm,
                info : app.info,
                alert : app.alert,
                close : app.close,
                clean : app.clean,
            };
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    @import "../../src/assets/css/var";
    .dialog-item {
        transition: all 1s;
        display: inline-block;
        margin-right: 10px;
    }
    .dialog-enter, .dialog-leave-to
        /* .dialog-leave-active for below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(30px);
    }
    .dialog-leave-active {
        position: absolute;
    }
    #dialog{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        overflow: hidden;

        >ul{
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            margin: 0;
            padding: 0;
            overflow: hidden;
            >li{
                max-width: 100%;
                max-height: 100%;
                margin: 0;
                padding: 0;
                list-style: none;
                background-color: #FFF;
                pointer-events: all;
            }
            &.alert{
                background-color: rgba(0,0,0,.7);
                pointer-events: all;
                li{
                    display: none;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    min-width: 300px;
                    border-radius: .03rem;
                    transform:translate(-50%,-50%);
                    &.full{
                        width: 100vw;
                        height: 100vh;
                        border-radius: 0;
                        overflow: auto;
                    }
                    &:last-child{
                        display: block;
                    }
                    >.dialog_title{
                        font-size: 18px;
                        line-height: 2;
                        font-weight: 500;
                        padding-top: @vSpace/3;
                        padding-left: @vSpace;
                    }
                    >.dialog_content {
                        padding: @vSpace;
                        text-align: left;
                        min-height: .8rem;
                        box-sizing: border-box;

                        /deep/ div[id^="dialog_"] > ul {
                            .column(1,0);
                        }
                    }
                    &.btnCenter > .dialog_btn{
                        text-align: center;
                    }
                    &.btnLeft > .dialog_btn{
                        text-align: left;
                    }
                    >.dialog_btn{
                        padding: @vSpace/3*2 @vSpace;
                        text-align: right;
                        >a{
                            .btnBorder;
                            &.primary{
                                background-color: @themeColor;
                                color: @lightFontColor;
                            }
                            &.disabled, &.primary.disabled{
                                background-color: @disable;
                                border-color: @disable;
                                pointer-events: none;
                            }
                            &+a{
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
            &.toast{
                left: 50%;
                top: 50%;
                bottom: auto;
                right: auto;
                transform:translate(-50%,-50%);
                >li{
                    background: none;
                    &+li{
                        margin-top: 10px;
                    }
                    .dialog_content{
                        display: inline-block;
                        background-color: rgba(0,0,0,.7);
                        color: #FFF;
                        border-radius: 5px;
                        padding: 5px 10px;
                    }
                }
            }
            &.error{
                left: 50%;
                top: 10px;
                bottom: auto;
                right: auto;
                transform:translate(-50%,0);
                width: 320px;
                >li{
                    background: none;
                    position: relative;
                    &+li{
                        margin-top: 10px;
                    }
                    .dialog_content{
                        display: block;
                        background-color: #fef0f0;//rgba(255,0,0,.7);
                        color: #f56c6c;
                        border:solid 1px #fde2e3;
                        border-radius: 5px;
                        padding: 8px 30px 5px 10px;
                        text-align: left;
                    }
                    .dialog_close_btn{
                        position: absolute;
                        top: 50%;
                        right: 5px;
                        transform:translate(0, -50%);
                        cursor: pointer;
                        pointer-events: all;
                        color:#999;
                        &:after{
                           // .luxIcon("\e60e");
                        }
                    }
                }
            }
            &.message{
                right: 10px;
                top: 10px;
                bottom: auto;
                left: auto;
                width: 300px;
                >li{
                    background: none;
                    position: relative;
                    &+li{
                        margin-top: 10px;
                    }
                    .dialog_content{
                        display: block;
                        background-color: #f0faeb;
                        color: #67c23a;
                        border: solid 1px #e0f3d8;
                        border-radius: 5px;
                        padding: 8px 30px 5px 10px;
                        text-align: left;
                    }
                    .dialog_close_btn{
                        position: absolute;
                        top: 50%;
                        right: 5px;
                        transform:translate(0, -50%);
                        cursor: pointer;
                        pointer-events: all;
                        color:#999;
                        &:after{
                           // .luxIcon("\e60e");
                        }
                    }
                }
            }
            &.loading{
                background-color: rgba(0,0,0,.7);
                pointer-events: all;
                li{
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform:translate(-50%,-50%);
                    width: 80px;
                    height: 80px;
                    *{
                        display: none;
                    }
                    .dialog_content{
                        display: block;
                        padding: 10px;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%,-50%);
                        width: 100%;
                        box-sizing: border-box;
                        text-align: center;
                        line-height: 18px;
                        font-size: 15px;
                    }
                    background: transparent url("data:image/svg+xml,%3Csvg width='38' height='38' xmlns='http://www.w3.org/2000/svg' stroke='%23fff'%3E%3Cg transform='translate(1 1)' stroke-width='2' fill='none' fill-rule='evenodd'%3E%3Ccircle stroke-opacity='.5' cx='18' cy='18' r='18'/%3E%3Cpath d='M36 18c0-9.94-8.06-18-18-18'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 18 18' to='360 18 18' dur='1s' repeatCount='indefinite'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E") center center no-repeat;
                    background-size: contain;
                    display: none;
                    &:last-child{
                        display: block;
                    }
                }
            }
        }
    }
    @media screen and (max-width: 480px){
        #dialog{
            >ul{
                &.alert{
                    li{
                        >.dialog_btn{
                            padding:0;
                            border-top: solid 1px rgba(0,0,0,.175);
                            display: -moz-box;
                            display: -webkit-box;
                            display: -ms-flexbox;
                            display: -webkit-flex;
                            display: flex;
                            width: 100%;
                            position: relative;
                            border-radius: 0 0 3px 3px;
                            overflow: hidden;
                            >a{
                                display: block;
                                border: none;
                                padding: 0;
                                margin: 0;
                                line-height: 40px;
                                border-radius: 0;
                                -webkit-box-flex: 1; -webkit-flex: 1; -ms-flex: 1; -moz-box-flex: 1; flex: 1;
                                &+a{
                                    margin: 0;
                                    border-left: solid 1px rgba(0,0,0,.175);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>