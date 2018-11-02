<template>
  <div class="home">
    <sidebar />
    <div class="main">
      <header-top />
      <pagetab />
      <div class="spa">
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
  overflow-y: auto;
  background: #f2f2f2;
}
</style>

