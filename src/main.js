import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import '@/common/font-awesome/css/font-awesome.min.css'
import '@/common/reset.css'

import '@/common/util.js'
import '@/common/http.js'


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
