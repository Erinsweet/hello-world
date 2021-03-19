<template>
    <div class="picker">
        <div class="select_box">
            <div class="sign"></div>
            <div class="wheel-wrapper" ref="wrapper">
                <ul class="wheel-scroller">
                    <li class="wheel-item"
                        v-for="(item,index) in data"
                        :class="{'active':selectedIndex==index}"
                        :key="index">{{item}}
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>
<script>
    const EVENT_CHANGE = 'change'
    import BScroll from 'better-scroll'
    export default {
        props: {

        },
        data() {
            return {
                selectedIndex:0,
                data:[1,2,3,45,7,9,8]
            }
        },
        mounted() {
            this.$nextTick(() => {
                this._createWheel().enable()
            })
        },
        methods: {
            _createWheel() {
                if (!this.wheels) {
                    const wheel = this.wheels = new BScroll(this.$refs.wrapper, {
                        wheel: {
                            selectedIndex: this.selectedIndex,
                            wheelWrapperClass: 'wheel-scroller',
                            wheelItemClass: 'wheel-item',
                            rotate: 0
                        },
                        observeDOM: false
                    })
                    wheel.on('scrollEnd', () => {
                        //滚动完成之后获取当前选取的索引值
                        this.$emit(EVENT_CHANGE,wheel.getSelectedIndex())
                        this.selectedIndex = wheel.getSelectedIndex()
                    })
                } else {
                    this.wheels.refresh()
                }
                return this.wheels
            },
        }
    }
</script>
<style lang="less" scoped>
    @import "../assets/css/var";
    .picker {
        position: fixed;
        width: calc(100% - 0.48rem*2);
        height: 40%;
        background-color: wheat;
        border-radius: 1.2rem;
        margin-left: 0.48rem;
        bottom: 0.48rem;
        padding-top: 50px;
        .select_box {
            position: relative;
            .sign {
                position: absolute;
                top: 50px;
                height: 60px;
                width: 3.84rem;
                left: calc((100% - 3.84rem)/2);
                border-top: 1px solid red;
                border-bottom: 1px solid red;
            }
            .wheel-wrapper{
                height: 300px;
                overflow: hidden;
                padding-top: 50px;
                .wheel-scroller{
                    width: 100%;
                    padding: 0;
                    text-align: center;
                    .wheel-item{
                        line-height:50px;
                        list-style: none;
                        text-align: center;
                        &.active{
                            line-height: 60px;
                            font-size: 30px;
                            color:red;
                        }
                    }
                }
            }
        }
    }

</style>