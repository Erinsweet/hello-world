<template>
    <div class="eChart" ref="eChart"></div>
</template>

<script>
    export default {
        data(){
            return {
                eChart:{
                    setOption(){},
                    resize(){}
                }
            }
        },
        props:{
            option:{
                type:Object,
                required:true
            }
        },
        mounted(){
            let app =this, eCharts = app.$echarts;
            app.eChart = eCharts.init(app.$refs.eChart);
            window.onresize=()=>{
                app.eChart.resize();
            };
            app.eChart.setOption(app.option);
            app.eChart.on('click', function (params) {
                app.$emit("click", params);
            });
            app.$emit("loaded", app.eChart);
        },
        watch:{
            option:{
                handler(val){
                    this.eChart.setOption(val)
                },
                deep:true
            }
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    .eChart{
        position: absolute;
        top:0;
        left: 0;
        bottom: 0;
        right: 0;
    }
</style>