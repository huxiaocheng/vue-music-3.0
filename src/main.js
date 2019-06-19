import 'babel-polyfill'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router/router'
import store from '@/store/store'
import fastclick from 'fastclick'

import '@/common/stylus/index.styl'

fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
