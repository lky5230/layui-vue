<template>
  <div class="home">
    <sidebar />
    <div class="main">
      <header-top />
      <pagetab />
      <div 
        class="spa" 
        :style="{'overflow-y': $store.state.complateRoute? 'auto': 'hidden'}">
        <div v-show="!$store.state.complateRoute" class="loading-wrap">
          <div class="loading"></div>
        </div>
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import sidebar from '@/components/sidebar';
import headerTop from '@/components/headerTop';
import pagetab from '@/components/pagetab';

export default {
  name: 'home',
  components: {
    sidebar,
    headerTop,
    pagetab,
  }
}
</script>

<style lang="less" scoped>
@media screen and (max-width: 768px) {
  .main{
    max-width: 100%;
  }
}
@media screen and (min-width: 768px) {
  .main{
    max-width: calc(100% - 220px);
  }
}
.home{
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}
.main{
  flex: auto;
  background: #f2f2f2;
}

.spa{
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  height: calc(100vh - 90px);
  background: #f2f2f2;
  position: relative;
  
  .loading-wrap{
    position: absolute;
    top: 1px;
    width: 100%;
    height: calc(100% - 4px);
    background: transparent;
    z-index: 98;
    left: 0px;
    overflow: hidden;
  }
  .loading{
    position: absolute;
    top: 0px;
    width: 20%;
    height: 3px;
    background: #1196db;
    z-index: 99;
    left: -20%;
    animation: loading .3s 1s cubic-bezier(0.285, 0.745, 0.735, 0.270) infinite normal;
  }
}
@keyframes loading {
  0%{
    left: -20%;
  }
  100%{
    left:100%;
  }
}
</style>

