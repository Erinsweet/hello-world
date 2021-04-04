/**
 *Author: erin
 *DateTime: 2021/4/4 8:36 下午
 */
import Vue from "vue";
let i = 0, list = {};
export default {
    loading: {data: []},
    vue: Vue,
    open(content){
        let options = {content:content}
        options.parent = this;
        let id = 'loading_' + ++i;
        options.content = `<div id="${id}">${options.content}</div>`;
        options.id = id;
        console.log(999,options)
        list[id] = 1;
        this.loading.data.push(options);
        options.index = this.loading.index = this.loading.data.length;
        this.loading.nextTick = this.vue.nextTick;
        this.loading.nextTick(()=>{
            if(list[id])
                options.vue = new Vue({
                    el : '#' + id,
                    data : options.data || {},
                });
        });
        return this;
    },
    close(){
        let d = this.loading.data.pop();
        if(!d) return this;
        delete list[d.id];
        delete d.vue;
        d = null;
        this.loading.index = this.loading.data.length;
        return this;
    },
}