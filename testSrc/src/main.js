import Vue from 'vue'
import App from './App.vue'
import dialog1 from './utils/dialog'
 import loadingFunc from './utils/loading'
import dialog from './components/dialog1'
//import Vue18n from 'vue-i18n' // 导入vue-i18n
import iPicker from 'i-picker';
Vue.prototype.$echarts = require('echarts');
Vue.use(iPicker);
// Vue.directive('longpress', {
//   bind: function (el, binding, vNode) {
//     // Make sure expression provided is a function
//     if (typeof binding.value !== 'function') {
//       // Fetch name of component
//       const compName = vNode.context.name
//       // pass warning to console
//       let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`
//       if (compName) { warn += `Found in component '${compName}' ` }
//
//       console.warn(warn)
//     }
//
//     // Define variable
//     let pressTimer = null
//
//     // Define funtion handlers
//     // Create timeout ( run function after 1s )
//     let start = (e) => {
//
//       if (e.type === 'click' && e.button !== 0) {
//         return;
//       }
//
//       if (pressTimer === null) {
//         pressTimer = setTimeout(() => {
//           // Run function
//           handler()
//         }, 1000)
//       }
//     }
//
//     // Cancel Timeout
//     let cancel = (e) => {
//       // Check if timer has a value or not
//       if (pressTimer !== null) {
//         clearTimeout(pressTimer)
//         pressTimer = null
//       }
//     }
//     // Run Function
//     const handler = (e) => {
//       binding.value(e)
//     }
//
//     // Add Event listeners
//     el.addEventListener("mousedown", start);
//     el.addEventListener("touchstart", start);
//     // Cancel timeouts if this events happen
//     el.addEventListener("click", cancel);
//     el.addEventListener("mouseout", cancel);
//     el.addEventListener("touchend", cancel);
//     el.addEventListener("touchcancel", cancel);
//   }
// })
import loading from './components/loading'
Vue.component('Loading', loading)
import "./utils/derective"

Vue.config.productionTip = false
Vue.prototype.$common= {
  loading: loadingFunc,
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
import Axios from 'axios'
Axios.defaults.timeout = 5000 // 请求超时

Vue.prototype.$axios = Axios;

new Vue({
  // i18n,
  render: h => h(App)
}).$mount('#app')

