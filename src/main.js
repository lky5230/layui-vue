import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/common/font-awesome/css/font-awesome.min.css';
import '@/common/reset.css';
import '@/common/util.js';
import '@/common/http.js';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small' });

import echarts from 'echarts'
import 'echarts-gl'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
