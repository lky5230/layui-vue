<template>
    <!-- 侧边栏：最多3级 -->
    <div>
      <div class="sidebar" :style="{left: $store.state.showSidebarLeft? '0px': '-220px'}">
          <div class="sidebar-title nowrap"></div>
          <div 
              class="sidebar-list" 
              @click.stop
              ref="sidebarList" 
              @mouseleave="sidebarIndicator = false">
              <div class="wraper">

              <!-- 1级 -->
              <div 
                  v-for="menuItem in menu" 
                  :key="menuItem.id"
                  @mouseover="getIndicatorTop(menuItem)">

                  <a
                    class="listItem nowrap" 
                    @click.stop="collapsible(menuItem)"
                    :class="{'router-active': $route.path == menuItem.url && menuItem._isleaf != 0}"
                    :title="menuItem.title"
                    :ref="'menuItem'+menuItem.id">
                    <i class="fa fa-home listItem-icon"></i>
                    {{menuItem.title}}
                    <transition name="arrow">
                        <i 
                        v-if="menuItem._isleaf == 0" 
                        v-show="!menuItem._showChild"
                        class="fa fa-caret-down listItem-arrow">
                        </i>
                    </transition>
                    <transition name="arrow">
                        <i 
                        v-if="menuItem._isleaf == 0" 
                        v-show="menuItem._showChild"
                        class="fa fa-caret-up listItem-arrow">
                        </i>
                    </transition>
                  </a>

                  <!-- 2级 -->
                  <div 
                  v-if="menuItem._isleaf == 0" 
                  v-for="menuItem2 in menuItem._child" 
                  v-show="menuItem._showChild"
                  :key="menuItem2.id">
                  <a 
                      class="listItem2 nowrap"
                      @click.stop="collapsible(menuItem2)"
                      :title="menuItem2.title"
                      :class="{'router-active': $route.path == menuItem2.url && menuItem2._isleaf != 0}"
                      :style="{'background-size': menuItem2._isleaf == 0? '14px': '0px'}">
                      {{menuItem2.title}}
                      <transition name="arrow">
                      <i 
                          v-if="menuItem2._isleaf == 0" 
                          v-show="!menuItem2._showChild"
                          class="fa fa-caret-down listItem-arrow">
                      </i>
                      </transition>
                      <transition name="arrow">
                      <i 
                          v-if="menuItem2._isleaf == 0" 
                          v-show="menuItem2._showChild"
                          class="fa fa-caret-up listItem-arrow">
                      </i>
                      </transition>
                  </a>

                  <!-- 3级 -->
                  <div 
                      v-if="menuItem2._isleaf == 0" 
                      v-for="menuItem3 in menuItem2._child" 
                      v-show="menuItem2._showChild"
                      :key="menuItem3.id">
                      <a 
                        class="listItem3 nowrap"
                        @click.stop="collapsible(menuItem3)"
                        :title="menuItem3.title"
                        :class="{'router-active': $route.path == menuItem3.url && menuItem3._isleaf != 0}"
                        :style="{'background-size': menuItem3._isleaf == 0? '14px': '0px'}">
                        {{menuItem3.title}}
                      </a>
                  </div>

                  </div>

              </div>

              </div>

              <transition name="indicator">
              <div 
                  class="indicator" 
                  v-show="sidebarIndicator" 
                  :style="{
                  top: sidebarIndicatorTop+'px', 
                  height: sidebarIndicatorHeight+'px'
                  }">
              </div>
              </transition>

          </div>
      </div>
      <div @click.stop="$store.commit('changeSidebarLeft', false)" class="mask" :style="{transform: $store.state.showSidebarLeft? 'scale(1)': 'scale(0)'}"></div>
    </div>
</template>

<script>
import BS from 'better-scroll'

export default {
  name: 'sidebar',
  data(){
    return {
      // 侧边栏滚动实例
      sidebarScroll: '',
      //整理菜单
      menu: [],
      //菜单项指示条-是否显示
      sidebarIndicator: false,
      sidebarIndicatorTop: 0,
      sidebarIndicatorHeight: 0,

    }
  },
  created(){
    
  },
  mounted(){
    this.$nextTick(()=>{
      this.getMenu(()=>{
        this.BScroll()
        this.initPageTab()
      });
    })
  },
  methods: {
    //侧边栏滚动条实例
    BScroll(){
      this.sidebarScroll = new BS(this.$refs.sidebarList, {
        scrollbar: {
          fade: false, //可隐藏
          interactive: true, //可交互
        },
        click: true,
        mouseWheel: true,
      });
    },

    //菜单目录
    getMenu(cb){
      this.$http.get('/menu.json').then(res=>{
        let menu = this.$utils.cleanData(res.data);
        (function showExc(arr){
          for(let i=0; i<arr.length; i++){
            arr[i]._showChild = false;
            if(arr[i]._isleaf == 0){
              showExc(arr[i]._child);
            }
          };
        }(menu));
        this.menu = menu;
        this.$nextTick(()=>{
          cb && cb();
        });
      }).catch(err=>{
        console.error(err);
      });
    },

    //点击菜单项
    collapsible(menuItem){
      //1、跳转url 
      if(menuItem._isleaf != 0){
        this.$store.commit('pagetabAction', {action: 'insert', data: menuItem});
        this.$router.push(menuItem.url);
        this.$store.commit('changeSidebarLeft', false);
        return ;
      };
      //2、展开伸缩
      menuItem._showChild = !menuItem._showChild;
      this.$nextTick(()=>{
        this.sidebarScroll.refresh();
      })
    },

    //计算菜单指示条top
    getIndicatorTop(menuItem){
      let sidebarList = this.$refs.sidebarList;
      let _menuItem = this.$refs['menuItem'+menuItem.id];
      if(_menuItem instanceof Array) _menuItem = _menuItem[0];
      let s = sidebarList.getBoundingClientRect();
      let m = _menuItem.getBoundingClientRect();
      this.sidebarIndicatorHeight = m.height;
      this.sidebarIndicatorTop = m.y - s.y;
      this.sidebarIndicator = true;
    },

    //初始化 pagetab、菜单展开等
    initPageTab(){
      let path = this.$router.currentRoute.path;
      let menu = this.$utils.jsonClone(this.menu);
      let vm = this;
      let curPid = '';
      //1、pagetab 插入当前标签页
      (function exec(menu){
        for(let i=0; i<menu.length; i++){
          if(menu[i]._isleaf != 0){
            if(path == menu[i].url){
              curPid = menu[i].parentid == 0? 'FIRST': menu[i].parentid;
              return vm.$store.commit('pagetabAction', {action: 'insert', data: menu[i]});
            }
          }else{
            exec(menu[i]._child);
          }
        }
      }(menu));

      if(curPid == 'FIRST') return this.menu = menu;

      //2、侧边栏展开当前标签页的所有父层标签
      let willFindPid = curPid;
      let findComplate = false;
      function exec2(menu){
        for(let i=0; i<menu.length; i++){
          if(menu[i].id == willFindPid){
            menu[i]._showChild = true;
            if(menu[i].parentid == 0){
              return findComplate = true;
            }else{
              return willFindPid = menu[i].parentid;
            }
          }else{
            if(menu[i]._isleaf == 0){
              exec2(menu[i]._child);
            }
          }
        }
      }
      while(!findComplate){
        exec2(menu);
      }
      this.menu = menu;
    },
    

  },


}
</script>


<style lang="less">
@indicatorColor: #0487c3;
@sidebarActiveBg: #0487c3;
@sidebarMainBg: #20222a;
@sidebarChildBg: #070a15;
@media screen and (max-width: 768px) {
  .sidebar{
    position: fixed;
    z-index: 1000;
    top: 0px;
  }
  .mask{
    position: fixed;
    z-index: 999;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .35);
  }
}
@media screen and (min-width: 768px) {
  .sidebar{
    position: static;
  }
  .mask{
    display: none;
  }
}
.sidebar{
  flex: none;
  width: 220px;
  transition: left .3s;
  height: 100vh;
  background: @sidebarMainBg;
  color: rgba(255, 255, 255, .7);

  .sidebar-title{
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    padding-left: 20px;
    padding-right: 20px;
    background: url(../assets/title.jpg) no-repeat left top;
    background-size: 100% 100%;
    color: #fff;
    text-align: center;
  }

  .sidebar-list{
    height: calc(100vh - 50px);
    overflow: hidden;
    position: relative;
    padding-top: 5px;
    .wraper{
      position: relative;
      .router-active{
        background-color: @sidebarActiveBg !important;
        color: #fff;
      }
      .listItem, .listItem2, .listItem3{
        position: relative;
        padding-right: 30px;
        transition: color .3s;
        display: block;
        outline: none;
        &:hover{
          cursor: pointer;
          color: rgba(255, 255, 255, 1);
        }
        .listItem-arrow{
          position: absolute;
          right: 20px;
          top: 50%;
          font-size: 20px;
          transform: translateY(-50%);
        }
      }
      .listItem{
        height: 56px;
        line-height: 56px;
        padding-left: 45px;
        background: @sidebarMainBg;
        .listItem-icon{
          position: absolute;
          left: 20px;
          top: 50%;
          font-size: 14px;
          transform: translateY(-50%);
        }
      }
      .listItem2{
        height: 40px;
        line-height: 40px;
        padding-left: 60px;
        background: url(../assets/expand.png) no-repeat 42px 12px;
        background-size: 14px 14px;
        background-color: @sidebarChildBg;
      }
      .listItem3{
        height: 40px;
        line-height: 40px;
        padding-left: 75px;
        background: url(../assets/expand.png) no-repeat 58px 12px;
        background-size: 14px 14px;
        background-color: @sidebarChildBg;
      }
          
    }
    .indicator{
      position: absolute;
      left: 0px;
      width: 5px;
      background: @indicatorColor;
      transition: all .2s;
      transform-origin: center center;
      transform: scaleY(0.9);
    }
  }

  .bscroll-indicator{
    border: none !important;
    background: rgba(120, 120, 120, .5) !important;
  }


  .arrow-enter-active,
  .arrow-leave-active {
    transition: all .4s ease;
  }
  .arrow-enter, 
  .arrow-leave-to{
    opacity: 0;
  }
  .indicator-enter-active,
  .indicator-leave-active {
    transition: all .4s ease;
  }
  .indicator-enter, 
  .indicator-leave-to{
    transform: scaleY(0);
    opacity: 0;
  }
  

}

</style>
