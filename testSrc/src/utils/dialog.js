/**
 *Author: erin
 *DateTime: 2021/1/23 6:50 下午
 */
import Vue from "vue";
let i = 0, list = {}, ct = 0;
export default {
    dialog : {data:[]},
    vue: Vue,
    open(options, callback){
        typeof options != "object" && (options = {content:options});
        options.parent = this;
        let id = 'dialog_' + ++i;
        options.content = `<div id="${id}">${options.content}</div>`;
        options.id = id;
        list[id] = 1;
        this.dialog.data.push(options);

        options.index = this.dialog.index = this.dialog.data.length;
        this.dialog.isToast = this.isToast();
        options.oldData = Object.assign({}, options.data || {});
        //this.dialog.nextTick = this.vue.nextTick;
        this.dialog.nextTick(()=>{
            if(list[id])
                options.vue = new Vue({
                    el : '#' + id,
                    data : options.data || {},
                    methods : options.methods || {}
                });
            callback && callback(options);
        });
        options.type != 'loading' && (options.btns || (ct = setTimeout(()=>{
            this.close();
        }, (options.showTime || 2) * 1000)));
        return this;
    },
    loading(content, data){
        return this.open({type:"loading", content:content||'loading', data:data});
    },
    toast(content, showTime){
        return this.open({type:"toast", content:content||'', showTime:showTime});
    },
    error(content,showTime){
        return this.open({type:"error", content:content||'error', showTime:showTime});
    },
    cancel(userFun){
        let d = this.getActive();
        if(userFun){
            userFun(d);
        }else{
            for(let i in d.oldData){
                d.data[i] = d.oldData[i];
            }
        }
        return this;
    },
    cancelAndClose(){
        this.cancel();
        this.close();
    },
    close(callback){
        let d = this.dialog.data.pop();
        if(!d) return this;
        clearTimeout(ct);
        delete list[d.id];
        delete d.vue;
        d = null;
        callback && callback(this.dialog);
        this.dialog.index = this.dialog.data.length;
        this.dialog.isToast = this.isToast();
        return this;
    },
    getActive(){
        return this.dialog.data[this.dialog.data.length - 1];
    },
    isToast(){
        let act = this.getActive() || {type:""};
        return !!({toast:1,error:1}[act.type]);
    }
};
