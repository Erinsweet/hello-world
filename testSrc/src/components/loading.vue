<!--
 Author: erin
 DateTime: 2021/4/4 8:35 下午
 
 以下是路由设置，要启用需去掉参数前的下划线
 _pagetitle:
 _requiresauth: 
 _layout: 
 _keepalive:
 _name:
-->
<template>
    <div id="loading">
    <div @click="test">12de2</div>

    </div>
</template>

<script>
    export default {
        props: {},
        data() {
            return {
                loaded: false,
            }
        },
        created() {
        },
        mounted() {
        },
        activated() {
        },
        methods: {
            test(){
                let url= "https://blog.csdn.net/weixin_38032826/article/details/107202448"
                window.location.href = url
            }
        },
        computed: {}
    }
</script>

<style scoped lang="less">
   #loading {
        position: fixed;
        left: 0;
        top: 0;
        background: #fff url("data:image/svg+xml,%3Csvg width='38' height='38' xmlns='http://www.w3.org/2000/svg' stroke='%23fff'%3E%3Cg transform='translate(1 1)' stroke-width='2' fill='none' fill-rule='evenodd'%3E%3Ccircle stroke-opacity='.5' cx='18' cy='18' r='18'/%3E%3Cpath d='M36 18c0-9.94-8.06-18-18-18'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 18 18' to='360 18 18' dur='1s' repeatCount='indefinite'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E") center center no-repeat;
        // background: url('~@/assets/img/loading-ball.svg') center center no-repeat #fff;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
    }
</style>