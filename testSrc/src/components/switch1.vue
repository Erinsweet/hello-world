<template>
    <label :class="{checked:value, text: bigSize || (on && off)}" @click.stop="change">
        <b ref="off">{{off}}</b><a ref="on">{{on}}</a><i ref="c"></i>
    </label>
</template>

<script>
    export default {
        //name: "switch",
        data(){
            return {
                a : 24,
                b : 24,
                c : null
            }
        },
        props:{
            value : {},
            on : {},
            off : {},
            bigSize:{}
        },
        methods:{
            change(init){
                let app = this, v, c = app.c;
                if(init !== true){
                    v = !app.value;
                    app.$emit('input', v);
                    app.$emit('change', v);
                }else{
                    v = app.value;
                }
                if(!v){
                    c.style.width = app.a;
                    c.style.left = 0;
                    c.style.marginLeft = 0;
                }else{
                    c.style.width = app.b;
                    c.style.left = app.a;
                    c.style.marginLeft = '-3px';
                }
            }
        },
        mounted(){
            let app = this;
            app.$nextTick(()=>{
                app.a = app.$refs.on.offsetWidth + 'px';
                app.b= app.$refs.off.offsetWidth + 'px';
                app.c = app.$refs.c;
                app.change(!0);
            })
        },
        watch:{
            value(v){
                this.change(!0);
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/css/var.less";
    @borderColor:#ccc;
    @themeColor: blue;
    label{
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
            a{
                color: @themeColor;
            }
            b{
                color: @borderColor;
            }
        }
        &.text{
            height: @_H;
            a,b{
                min-width: @_H;
                height: @_H;
                line-height: @_H;
            }
            i{
                height: @_H;
                width: @_H;
            }
        }

        a,b{
            color: @disable;
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
        b{
            color: @themeColor;
        }
        a{
            margin-left: -3px;
        }
        i{
            display: block;
            position: absolute;
            z-index: 1;
            .duration(@_t);
            left: 0;
            top: 0;
            height: @_h;
            width: @_h;
            border-radius: @_h;
            background-color: #FFF;
            //box-shadow: 1px 1px 1px @borderColor;
        }
    }
</style>