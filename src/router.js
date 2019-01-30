import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
Vue.use(Router)

const Login = () => import('@/views/login/login.vue')
import Home from '@/views/Home.vue'

let spinRoute = {
  show() {
    store.commit('complateRouteMul', false);
  },
  resolve(resolve) {
      return component=>{
          setTimeout(()=>{
            store.commit('complateRouteMul', true);
            resolve(component);
          }, 0)
      }
  }
}

let router = new Router({
  routes: [

    //登录
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    //主要路由
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'index',
          component: resolve => {
            spinRoute.show();
            require(['@/views/index/index.vue'], spinRoute.resolve(resolve))
          }, 
        },
        {
          path: 'index2',
          name: 'index2',
          component: resolve => {
            spinRoute.show();
            require(['@/views/index2/index2.vue'], spinRoute.resolve(resolve))
          }, 
        },
        {
          path: 'index3',
          name: 'index3',
          component: resolve => {
            spinRoute.show();
            require(['@/views/index3/index3.vue'], spinRoute.resolve(resolve))
          }, 
        },


        //404
        {
          path: "*",
          name: '404',
          component: resolve => {
            spinRoute.show();
            require(['@/views/404.vue'], spinRoute.resolve(resolve))
          }, 
        }
      ]
    },
    
  ]
})

router.beforeEach((to, from, next) => {
  // ...
  next();
});

router.afterEach((to, from) => {
  // ...
});

export default router;
