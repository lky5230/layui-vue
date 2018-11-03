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
    height: calc(100% - 3px);
    background: rgba(0, 0, 0, .03);
    z-index: 98;
    left: 0px;
    overflow: hidden;
  }
  .loading{
    position: absolute;
    top: 0px;
    width: 20%;
    height: 2px;
    background: #ffa180;
    z-index: 99;
    left: -20%;
    animation: loading .75s 1s linear infinite normal;
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

