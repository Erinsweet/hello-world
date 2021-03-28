<template>
   <div class="switch">
       <label :class="{checked:value}" @click.stop="change">
           <b ref="off"></b>
           <a ref="on"></a>
           <span class="circle" ref="circle"></span>
       </label>
   </div>
</template>

<script>
    export default {
        data(){
            return {
                onWidth : "",
                offWidth : "",
                circleDom : null
            }
        },
        props:{
            value: {},
        },
        methods:{
            change(init){
                let app = this, value, circle = app.circleDom;
                if(init !== true){
                    value = !app.value;
                    app.$emit('input', value);
                    app.$emit('change', value);
                }else{
                    value = app.value;
                }
                if(!value){
                    circle.style.width = app.onWidth;
                    circle.style.left = 0;
                    circle.style.marginLeft = 0;
                }else{
                    circle.style.width = app.offWidth;
                    circle.style.left = app.onWidth;
                    circle.style.marginLeft = '-3px';
                }
            }
        },
        mounted(){
            let app = this;
            app.$nextTick(()=>{
                app.onWidth = app.$refs.on.offsetWidth + 'px';
                app.offWidth = app.$refs.off.offsetWidth + 'px';
                app.circleDom = app.$refs.circle;
                app.change(!0);
            })
        },
        watch:{
            value(val){
                this.change(!0);
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/css/var.less";
    @borderColor:#ccc;
    @themeColor: blue;
    .switch {
        >label{
            @_h : 16px;
            @_H : 24px;
            @_t : 300ms;
            cursor: pointer;
            display: inline-block;
            vertical-align: middle;
            font-size: 0;
            height: @_h;
            border: solid 2px @borderColor;
            background-color: @borderColor;
            border-radius: @_h;
            position: relative;
            overflow: hidden;
            .duration(@_t);
            &.checked{
                background-color: @themeColor;
                border-color: @themeColor;
            }
            a,b{
                font-weight: normal;
                display: inline-block;
                min-width: @_h;
                box-sizing: border-box;
                text-align: center;
                padding: 0 8px;
                font-size: 14px;
                height: @_h;
                line-height: @_h;
                position: relative;
                z-index: 2;
                vertical-align: middle;
            }
            a{
                margin-left: -3px;
            }
            .circle{
                display: block;
                position: absolute;
                z-index: 1;
                left: 0;
                top: 0;
                height: @_h;
                width: @_h;
                border-radius: @_h;
                background-color: #FFF;
                .duration(@_t);
            }
        }
    }

</style>