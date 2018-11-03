import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
      children: [
        {
          path: '',
          name: 'index',
          component: () => import('@/views/index/index.vue'), 
        },



        //404
        {
          path: "*",
          name: '404',
          component: () => import('@/views/404.vue'),
        }
      ]
    },
    
    //登录
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue')
    },
  ]
})

//路由前置守卫
router.beforeEach((to, from, next) => {
  store.commit('complateRouteMul', false);
  // ...
  next();
});

//路由后置路由
router.afterEach((to, from) => {
  store.commit('complateRouteMul', true);
  // ...
});

export default router;
