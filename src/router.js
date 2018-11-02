import Vue from 'vue'
import Router from 'vue-router'
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

//路由守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    next()
  } else {
    next()
  }
});

export default router;
