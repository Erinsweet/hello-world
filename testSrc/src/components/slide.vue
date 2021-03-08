<!--
 Author: erin
 DateTime: 2021/3/7 10:01 下午
 
 以下是路由设置，要启用需去掉参数前的下划线
 _pagetitle:
 _requiresauth: 
 _layout: 
 _keepalive:
 _name:
-->
<template>
    <div class="picker-main">
        <div v-if="show" class="picker">
            <div class="picker-main">
                <h3>
                    <span @click="show = false">取消</span>
                    <span @click="sure()">确认</span>
                </h3>
                <ul ref="ul">
                    <li v-for="(item, index) in list"
                        :key="index"
                        :class="activeIndex==index?'active':activeIndex==index-1||activeIndex==index+1?'active2':null"
                        @click="selectCity(item,index)"
                        :ref="'li'+item.label"
                    >{{item.val}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list: [
                    {
                        id: 0,
                        val: "北京",
                        label: "bj"
                    },
                    {
                        id: 1,
                        val: "上海",
                        label: "sh"
                    },
                    {
                        id: 2,
                        val: "广州",
                        label: "gz"
                    },
                    {
                        id: 3,
                        val: "深圳",
                        label: "sz"
                    }
                ],
                show:true,
                activeIndex: 0,
                city: "",
                listOffsetTop: [],
                timer: null
            };
        },
        mounted(){
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                this.getOffsetTop();
                this.computeActive();
            }, 50);
        },
        methods: {
            selectCity(item,index){
               this.activeIndex = index;
                let scroll = this.$refs.ul;
                scroll.scrollTop = scroll.scrollTop + (index-1)*50
            },
            sure() {
               console.log(this.activeIndex)
            },
            getOffsetTop() {
                this.listOffsetTop = [];
                this.list.map((item, index) => {
                    let liTop = this.$refs["li" + item.label];
                    this.listOffsetTop.push(liTop[0].offsetTop - 41);
                });
                console.log(99,this.listOffsetTop)
            },
            computeActive() {
                let scroll = this.$refs.ul;
                scroll.addEventListener("scroll", () => {
                    this.listOffsetTop.map((item, index) => {
                        item <= scroll.scrollTop + 100 ? (this.activeIndex = index - 1) : null;
                    });
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .picker {
        background-color: rgba(0, 0, 0, 0.2);
        max-height: 100vh;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 50%;
        right: 0;
        display: flex;
        .picker-main {
            width: 100%;
            position: absolute;
            bottom: 0;
            background-color: #fff;
            h3 {
                padding: 0;
                margin: 0;
                display: flex;
                justify-content: space-around;
                border-bottom: solid 1px #ddd;
                font-size: 20px;
                line-height: 40px;
            }
            ul {
                max-height: 120px;
                padding: 0;
                margin: 0;
                overflow: auto;
                background-color: #fff;
                li {
                    list-style: none;
                    font-size: 25px;
                    line-height: 50px;
                    text-align: center;
                    opacity: 0.3;
                    height: 50px;
                    background-color: #fff;
                }
            }
        }
    }
    .active {
        color: blue;
        /*border: 1px solid red;*/
        /*border-width: 1px 0;*/
    }
    .active2 {
        //color: red;
        opacity: 0.2 !important;
    }
</style>

