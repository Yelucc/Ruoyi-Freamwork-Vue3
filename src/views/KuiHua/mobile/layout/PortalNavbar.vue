<template>
  <div class="portal-navbar">
    <div class="left-container">
      <PortalTopNav />
    </div>
  </div>
</template>
<script setup>
import PortalTopNav from '@/views/KuiHua/mobile/components/PortalTopNav';
</script>
<style lang="scss" scoped>
.portal-navbar {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(19, 20, 21);
  overflow: hidden;
}
</style>
