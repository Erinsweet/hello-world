<!--
 Author: erin
 DateTime: 2021/3/28 11:02 上午

 以下是路由设置，要启用需去掉参数前的下划线
 _pagetitle:
 _requiresauth:
 _layout:
 _keepalive:
 _name:
-->
<template>
    <div v-if="loaded" class="setAuth">
        <div>

        </div>
    </div>
</template>

<script>
    export default {
        props: {},
        data() {
            return {
                loaded: true,
            }
        },
        created() {
        },
        mounted() {
        },
        activated() {
        },
        methods: {},
        computed: {}
    }
</script>

<style scoped lang="less">

</style>