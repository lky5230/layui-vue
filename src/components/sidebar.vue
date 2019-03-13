<template>
    <!-- 最多3级 -->
    <div 
      class="sidebar" 
      :style="{
        left: $store.state.showSidebarLeft? '0px': '-220px'
      }">
        <div class="sidebar-title nowrap"></div>
        <div 
            class="sidebar-list" 
            @click.stop
            ref="sidebarList">
            <div class="wraper">

            <!-- 1级 -->
            <div 
                v-for="menuItem in menu" 
                :key="menuItem.id">

                <a
                  class="listItem nowrap" 
                  @click.stop="collapsible(menuItem)"
                  :class="{
                    'router-active': $route.path == menuItem.url && menuItem._isleaf != 0
                  }"
                  :title="menuItem.title"
                  :ref="'menuItem'+menuItem.id">
                  <i 
                    class="fa listItem-icon" 
                    :class="[menuItem.icon? menuItem.icon: 'fa-home']">
                  </i>
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
                      :class="{
                        'router-active': $route.path == menuItem2.url && menuItem2._isleaf != 0
                      }"
                      :style="{
                        'background-size': menuItem2._isleaf == 0? '14px': '0px'
                      }">
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
                        :class="{
                          'router-active': $route.path == menuItem3.url && menuItem3._isleaf != 0
                        }"
                        :style="{
                          'background-size': menuItem3._isleaf == 0? '14px': '0px'
                        }">
                        {{menuItem3.title}}
                      </a>
                  </div>

                </div>

            </div>

            </div>

        </div>
        <div 
          @click.stop="$store.commit('changeSidebarLeft', false)" 
          class="mask" 
          :style="{
            transform: $store.state.showSidebarLeft? 'scale(1)': 'scale(0)',
            right:  $store.state.showSidebarLeft? '0px': '-100%',
          }">
        </div>
    </div>
</template>

<script>
const menuUrl = '/menu.json'
import BS from 'better-scroll'

export default {
  name: 'sidebar',
  data(){
    return {
      sidebarScroll: '',
      menu: [],

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
  watch: {
    '$route'(newVal, oldVal){
      this.initPageTab(newVal);
    }
  },
  methods: {
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
    getMenu(cb){
      this.$http.get(menuUrl).then(res=>{
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
    collapsible(menuItem){
      //跳转
      if(menuItem._isleaf != 0){
        this.$store.commit('pagetabAction', {action: 'insert', data: menuItem});
        this.$router.push(menuItem.url);
        this.$store.commit('changeSidebarLeft', false);
        return ;
      };
      //伸缩
      menuItem._showChild = !menuItem._showChild;
      this.$nextTick(()=>{
        this.sidebarScroll.refresh();
      })
    },
    initPageTab(data){
      let path = data? data.path: this.$router.currentRoute.path;
      let menu = this.$utils.jsonClone(this.menu);
      let vm = this;
      let curPid = '';
      (function exec(menu){
        for(let i=0; i<menu.length; i++){
          if(menu[i]._isleaf != 0){
            if(path == menu[i].url){
              curPid = menu[i].parentid == 0? 'FIRST': menu[i].parentid;
              return data? null: vm.$store.commit('pagetabAction', {action: 'insert', data: menu[i]});
            }
          }else{
            exec(menu[i]._child);
          }
        }
      }(menu));
      if(curPid == 'FIRST' || curPid == '') return this.menu = menu;
      let willFindPid = curPid;
      let findComplate = false;
      while(!findComplate){
        (function exec2(menu){
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
        }(menu))
      }
      this.menu = menu;
      this.$nextTick(()=>{
        data? this.sidebarScroll.refresh(): void(0);
      })
    },

  },

}
</script>
<style lang="less">
@indicatorColor: #4caf50;
@sidebarActiveBg: #343742;
@sidebarMainBg: #20222a;
@sidebarChildBg: #20222a;
@keyframes a{
	from{
		transform: scaleY(0);
		opacity: 0;
	}
	to{
		transform: scaleY(1);
		opacity: 1;
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
    background: url(../assets/title.png) no-repeat center center @sidebarMainBg;
    background-size: contain;
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
        color: #00a8ff !important;
		&:after{
			position: absolute;
			right: 4px;
			top: 4px;
			content: ' ';
			width: 4px;
			border-radius: 2px;
			transfrom-origin: center;
			height: calc(100% - 8px);
			animation: a .3s;
			animation-fill-mode: forwards;
			background: #00a8ff;
		}
      }
      .listItem, .listItem2, .listItem3{
        position: relative;
        padding-right: 30px;
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
        height: 40px;
        line-height: 40px;
        padding-left: 45px;
        background: @sidebarMainBg;
        position: relative;
        
        .listItem-icon{
          position: absolute;
          left: 20px;
          top: 50%;
          width: 14px;
          height: 14px;
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
}
@media screen and (max-width: 768px) {
  .sidebar{
    position: fixed;
    z-index: 3000;
    top: 0px;
  }
  .mask{
    position: fixed;
    z-index: 999;
    top: 0px;
    width: calc(100% - 220px);
    height: 100%;
    background: transparent;
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
</style>
