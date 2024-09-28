<template>
  <div class="portal-wrapper">
<!--    <PortalNavbar />-->
    <PortalMain />
  </div>
</template>
<script setup>
import PortalMain from '@/views/KuiHua/mobile/layout/PortalMain.vue';
</script>
<style lang="scss" scoped>
@import '@/assets/styles/portal.scss';

.portal-wrapper {
  position: relative;
  //height: 100%;
  background-color: #005adb;
  width: 100%;
}
</style>
