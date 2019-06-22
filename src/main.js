import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import '@/common/stylus/index.styl'

fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('@/common/image/default.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
