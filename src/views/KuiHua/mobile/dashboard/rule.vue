<template>
  <div class="rule-wrapper">
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.rule-wrapper {
  width: 100%;
  height: 3500px;
  overflow-y: scroll; // 保留垂直滚动
  &::-webkit-scrollbar {
    display: none; // 隐藏滚动条
  }
  background: url("@/assets/images/rule.jpg") no-repeat center center;
  background-size: cover; /* 图片覆盖整个容器 */
}
</style>