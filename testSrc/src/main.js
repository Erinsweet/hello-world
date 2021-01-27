import Vue from 'vue'
import App from './App.vue'
import dialog1 from './utils/dialog'
import dialog from './components/dialog1'
import Vue18n from 'vue-i18n' // 导入vue-i18n
Vue.use(Vue18n)
// 定义标识符
const i18n = new Vue18n({
  locale: 'zh-CN',  //默认显示的语言
  // this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': require('./assets/lang/zh-cn'), // 中文语言包
    'en-US': require('./assets/lang/en-us') // 英文语言包
  }
})
Vue.config.productionTip = false
Vue.prototype.$common= {
  dialog : dialog,
  dialog1 : dialog1,
  lang : {},
  setLang(lang){
    try{
      this.lang = require('./assets/lang/' + lang);
    } catch (e) {
      this.lang = require('./assets/lang/zh-cn');
    }
    return this.lang;
  },
}
Vue.prototype.$lang = (name)=>{
  return Vue.prototype.$common.lang[name] || '';
};
// Vue.prototype.$setLang = Vue.prototype.$common.setLang;
//Vue.prototype.$common.setLang((navigator.language||navigator.userLanguage).toLowerCase());
Vue.prototype.$common.setLang('en-us');


new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')

