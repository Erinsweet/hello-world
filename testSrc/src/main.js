import Vue from 'vue'
import App from './App.vue'
import dialog1 from './utils/dialog'
import dialog from './components/dialog1'
Vue.config.productionTip = false
Vue.prototype.$common= {
  dialog : dialog,
  dialog1 : dialog1
}
new Vue({
  render: h => h(App)
}).$mount('#app')

