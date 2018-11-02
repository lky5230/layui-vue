import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router.js'
Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    // 刷新spa 动态标记
    refreshMark: 0,
    // tab标签页列表
    pagetab: [],
    // 改变sidebar的left状态
    showSidebarLeft: false,
    //增加或切换标签页时，移动到合适位置 动态标记
    tabToPos: '',

  },

  mutations: {
    // 点击刷新spa按钮的 改变标记
    refreshMarkMut(state, payload){
      state.refreshMark = Date.now() + '@' + router.currentRoute.name;
    },

    // 改变sidebar的left状态
    changeSidebarLeft(state, payload){
      if(payload){
        state.showSidebarLeft = payload;
      }else{
        state.showSidebarLeft = !state.showSidebarLeft;
      }
    },

    // 改变pagetab标签页集合
    pagetabAction(state, payload){
      let pagetab = state.pagetab;
      //1、插入/切换
      if(payload.action == 'insert'){
        for(let i=0; i<pagetab.length; i++){
          if(pagetab[i].id == payload.data.id){
            //切换到id位置
            state.tabToPos = 'change' + '@' + pagetab[i].id + '@' + Date.now();
            return ;
          };
        }
        pagetab.push(payload.data);
        //直接移到最右侧
        state.tabToPos = 'insert' + '@' + Date.now();
      };
      //2、删除
      if(payload.action == 'delete'){
        for(let i=0; i<pagetab.length; i++){
          if(pagetab[i].id == payload.data.id){
            if(router.currentRoute.path == payload.data.url){
              //最后一个
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
