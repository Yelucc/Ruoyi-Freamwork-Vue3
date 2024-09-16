<template>
  <div class="headline">
    <img class="logo" src="@/assets/logo/logo.png" />
<!--    <span class="title">Growl e-sports overseas independent station</span>-->
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.headline {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;

  color: #fff;
  .title {
    font-size: 28px;
    margin-left: 10px;
  }

  .logo{
    width: 80px;
    height: auto;
  }
}
</style>
