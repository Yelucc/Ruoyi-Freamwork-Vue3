<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    class="portal-menu"
    :ellipsis="false"
    :router="true"
  >
    <el-menu-item index="/">
      <PortalHeadline />
    </el-menu-item>
    <el-menu-item index="/dashboard">
      Home
    </el-menu-item>
    <el-menu-item index="/product">
      Product
    </el-menu-item>
    <el-menu-item index="/about">
      About
    </el-menu-item>
  </el-menu>
</template>
<script setup>
import PortalHeadline from '@/views/portal/components/PortalHeadline';
import { useRoute } from 'vue-router';

const route = useRoute();

const activeMenu = ref('/dashboard');
onMounted(()=>{
  activeMenu.value = route.path
})

</script>
<style lang="scss" scoped>
.portal-menu {
  --el-menu-bg-color: #131415;
  --el-menu-text-color: rgb(255, 255, 255);
  --el-menu-hover-text-color: rgb(255, 255, 255);
  --el-menu-active-color: rgb(255, 255, 255);
  --el-menu-hover-bg-color: rgba(0, 0, 0, 0.33);
  font-weight: bold;

  width: 100vw;

}
</style>
