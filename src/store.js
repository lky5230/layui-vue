import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router.js'
Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    complateRoute: false,
    refreshMark: 0,
    pagetab: [],
    showSidebarLeft: false,
    tabToPos: '',
    
  },

  mutations: {
    complateRouteMul(state, payload){
      state.complateRoute = payload;
    },
    refreshMarkMut(state, payload){
      state.refreshMark = Date.now() + '@' + router.currentRoute.name;
    },
    changeSidebarLeft(state, payload){
      if(payload){
        state.showSidebarLeft = payload;
      }else{
        state.showSidebarLeft = !state.showSidebarLeft;
      }
    },
    // 插入/切换/删除标签
    pagetabAction(state, payload){
      let pagetab = state.pagetab;
      //插入/切换
      if(payload.action == 'insert'){
        for(let i=0; i<pagetab.length; i++){
          if(pagetab[i].id == payload.data.id){
            state.tabToPos = 'change' + '@' + pagetab[i].id + '@' + Date.now();
            return ;
          };
        }
        pagetab.push(payload.data);
        state.tabToPos = 'insert' + '@' + Date.now();
      };
      //删除
      if(payload.action == 'delete'){
        for(let i=0; i<pagetab.length; i++){
          if(pagetab[i].id == payload.data.id){
            if(router.currentRoute.path == payload.data.url){
              if(i == pagetab.length -1){
                if(pagetab.length == 1){
                  router.push('/')
                }else{
                  router.push(pagetab[i-1].url)
                }
              }else{
                router.push(pagetab[i+1].url)
              }
            }
            pagetab.splice(i, 1);
            break ;
          }
        }
      };
    },
    
  },

  actions: {

  },

})
